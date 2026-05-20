import { createHash, randomBytes } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessContext, type RefreshToken, type User } from '@generated/prisma/client';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import type { RefreshClientMeta } from '../types/refresh-client-meta';
import { parseDurationMs } from '../utils/parse-duration-ms';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createAndPersist(
    userId: string,
    accessContext: AccessContext,
    clientMeta?: RefreshClientMeta,
    refreshExpiresIn: string = env.JWT_REFRESH_EXPIRES_IN,
  ): Promise<string> {
    const raw = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresMs = parseDurationMs(refreshExpiresIn);
    const expiresAt = new Date(Date.now() + expiresMs);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        accessContext,
        expiresAt,
        ipAddress: clientMeta?.ipAddress ?? null,
        userAgent: clientMeta?.userAgent ?? null,
      },
    });

    return raw;
  }

  async rotate(
    token: RefreshToken & { user: Pick<User, 'id'> },
    clientMeta: RefreshClientMeta,
  ): Promise<{ rawToken: string; maxAgeMs: number }> {
    const rawToken = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const maxAgeMs = Math.max(token.expiresAt.getTime() - Date.now(), 0);

    await this.prisma.$transaction(async (tx) => {
      const revoked = await tx.refreshToken.updateMany({
        where: { id: token.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      if (revoked.count !== 1) {
        throw new UnauthorizedException();
      }

      await tx.refreshToken.create({
        data: {
          userId: token.user.id,
          tokenHash,
          accessContext: token.accessContext,
          expiresAt: token.expiresAt,
          ipAddress: clientMeta.ipAddress ?? null,
          userAgent: clientMeta.userAgent ?? null,
        },
      });
    });

    return { rawToken, maxAgeMs };
  }

  async updateClientMeta(id: string, clientMeta: RefreshClientMeta): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: {
        ipAddress: clientMeta.ipAddress ?? null,
        userAgent: clientMeta.userAgent ?? null,
      },
    });
  }

  async findValidByRaw(raw: string | undefined) {
    if (!raw?.length) {
      return null;
    }
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const row = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    if (!row) {
      return null;
    }
    if (row.user.deletedAt) {
      return null;
    }
    return row;
  }

  async revokeById(id: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeByRaw(raw: string | undefined): Promise<void> {
    if (!raw?.length) {
      return;
    }
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
