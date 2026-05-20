import { createHash, randomBytes } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { env } from '@/env';
import { MembershipStatus } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/users/user.service';
import type { ForgotPasswordBodyDto } from '../dto/forgot-password-body.dto';
import type { ResetPasswordBodyDto } from '../dto/reset-password-body.dto';
import { parseDurationMs } from '../utils/parse-duration-ms';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class PasswordResetService {
  static readonly FORGOT_PASSWORD_MESSAGE =
    'If an account matches this address, password reset instructions will follow.';

  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UserService,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  async requestPasswordReset(data: ForgotPasswordBodyDto): Promise<{ message: string }> {
    const email = data.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user?.passwordHash) {
      return { message: PasswordResetService.FORGOT_PASSWORD_MESSAGE };
    }

    const eligible = await this.hasActiveOrganizationMembership(user.id);
    if (!eligible) {
      return { message: PasswordResetService.FORGOT_PASSWORD_MESSAGE };
    }

    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    const raw = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresMs = parseDurationMs(env.PASSWORD_RESET_EXPIRES_IN);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + expiresMs),
      },
    });

    const resetUrl = new URL('/reset-password', env.APP_PUBLIC_URL);
    resetUrl.searchParams.set('token', raw);

    // TODO: email integration — send resetUrl to user.email
    if (env.NODE_ENV !== 'production') {
      console.log('[password reset] dev link:', resetUrl.toString());
    }

    return { message: PasswordResetService.FORGOT_PASSWORD_MESSAGE };
  }

  async resetPassword(input: ResetPasswordBodyDto): Promise<{ message: string }> {
    const tokenHash = createHash('sha256').update(input.token).digest('hex');
    const row = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        deletedAt: null,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!row?.user || row.user.deletedAt) {
      throw new BadRequestException('This reset link is invalid or has expired.');
    }

    const eligible = await this.hasActiveOrganizationMembership(row.userId);
    if (!eligible) {
      throw new BadRequestException('This reset link is invalid or has expired.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    await this.prisma.$transaction(async (tx) => {
      await this.users.update(row.userId, { passwordHash }, tx);
      await tx.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      });
    });

    await this.refreshTokens.revokeAllForUser(row.userId);

    return { message: 'Password updated.' };
  }

  private async hasActiveOrganizationMembership(userId: string): Promise<boolean> {
    const membership = await this.prisma.organizationMembership.findFirst({
      where: {
        userId,
        deletedAt: null,
        status: MembershipStatus.active,
        organization: {
          deletedAt: null,
          isActive: true,
        },
      },
      select: { id: true },
    });

    return membership !== null;
  }
}
