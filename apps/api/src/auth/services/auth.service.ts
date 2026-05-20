import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AccessContext,
  MembershipStatus,
  OrganizationType,
  type RefreshToken,
} from '@generated/prisma/client';
import { SubscriptionService } from '@/billing/subscription.service';
import { env } from '@/env';
import { OrganizationMembershipService } from '@/organizations/organization-membership.service';
import { OrganizationService } from '@/organizations/organization.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RoleService } from '@/roles/role.service';
import { UserService } from '@/users/user.service';
import type { AuthLoginBodyDto } from '../dto/auth-login-body.dto';
import type { AuthMeResponseDto } from '../dto/auth-me-response.dto';
import type { AuthSignupBodyDto } from '../dto/auth-signup-body.dto';
import type { ForgotPasswordBodyDto } from '../dto/forgot-password-body.dto';
import type { ResetPasswordBodyDto } from '../dto/reset-password-body.dto';
import type { AccessTokenPayload } from '../types/access-token-payload';
import type { RefreshClientMeta } from '../types/refresh-client-meta';
import { parseDurationMs } from '../utils/parse-duration-ms';
import { PasswordResetService } from './password-reset.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly refreshTokens: RefreshTokenService,
    private readonly passwordResets: PasswordResetService,
    private readonly organizations: OrganizationService,
    private readonly organizationMemberships: OrganizationMembershipService,
    private readonly roles: RoleService,
    private readonly subscriptions: SubscriptionService,
    private readonly users: UserService,
  ) {}

  async loginPlatformAdmin(input: AuthLoginBodyDto, clientMeta?: RefreshClientMeta) {
    const refreshExpiresIn =
      input.rememberMe === false ? env.JWT_REFRESH_SESSION_EXPIRES_IN : env.JWT_REFRESH_EXPIRES_IN;
    return this.loginWithPassword(input, AccessContext.platform, refreshExpiresIn, clientMeta);
  }

  async login(input: AuthLoginBodyDto, clientMeta?: RefreshClientMeta) {
    const refreshExpiresIn =
      input.rememberMe === false ? env.JWT_REFRESH_SESSION_EXPIRES_IN : env.JWT_REFRESH_EXPIRES_IN;
    return this.loginWithPassword(input, AccessContext.organization, refreshExpiresIn, clientMeta);
  }

  async signup(input: AuthSignupBodyDto, clientMeta?: RefreshClientMeta) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const { userId } = await this.prisma.$transaction(async (tx) => {
      const organization = await this.organizations.create(
        {
          name: input.organizationName.trim(),
          type: OrganizationType.workspace,
          isActive: true,
        },
        tx,
      );

      const user = await this.users.create(
        {
          email,
          name: input.name.trim(),
          passwordHash,
        },
        tx,
      );

      await this.organizationMemberships.createOwnerMembership(
        {
          userId: user.id,
          organizationId: organization.id,
        },
        tx,
      );

      const ownerRole = await this.roles.createOrganizationRoleWithAllPermissions(
        {
          name: 'Owner',
          organizationId: organization.id,
        },
        tx,
      );

      await this.roles.assignRoleToUserInOrganization(
        {
          userId: user.id,
          roleId: ownerRole.id,
          organizationId: organization.id,
        },
        tx,
      );

      await this.subscriptions.createTrialSubscriptionForOrganization(
        {
          organizationId: organization.id,
          ...(input.planCode ? { planCode: input.planCode } : {}),
        },
        tx,
      );

      return { userId: user.id };
    });

    return this.issueSessionForUser(
      userId,
      AccessContext.organization,
      env.JWT_REFRESH_EXPIRES_IN,
      clientMeta,
    );
  }

  async getMe(userId: string): Promise<AuthMeResponseDto> {
    const user = await this.users.getUserDetails(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const permissionMap = new Map<string, AuthMeResponseDto['permissions'][0]>();

    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        const permission = rolePermission.permission;
        if (!permissionMap.has(permission.key)) {
          permissionMap.set(permission.key, {
            key: permission.key,
            name: permission.name,
            module: permission.module,
            contextType: permission.contextType,
          });
        }
      }
    }

    const permissions = [...permissionMap.values()].sort((permissionA, permissionB) =>
      permissionA.key.localeCompare(permissionB.key),
    );

    const roles = user.userRoles.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      contextType: userRole.role.contextType,
      organizationId: userRole.role.organizationId,
      isSystem: userRole.role.isSystem,
    }));

    const organizations = user.organizationMemberships.map((membership) => {
      const organization = membership.organization;
      return {
        id: organization.id,
        name: organization.name,
        type: organization.type,
        isActive: organization.isActive,
        membershipStatus: membership.status,
        isOwner: membership.isOwner,
      };
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPlatformOwner: user.isPlatformOwner,
      },
      organizations,
      roles,
      permissions,
    };
  }

  async getSessionFromRefresh(
    refreshRaw: string | undefined,
    accessContext: AccessContext,
    clientMeta?: RefreshClientMeta,
  ) {
    const row = await this.requireValidRefreshToken(refreshRaw, accessContext);
    await this.refreshTokens.updateClientMeta(row.id, clientMeta ?? {});

    const [sessionAuth, me] = await Promise.all([
      this.issueAccessToken(row.user.id, row.user.email, accessContext),
      this.getMe(row.user.id),
    ]);

    return {
      ...sessionAuth,
      me,
    };
  }

  async refreshSession(
    refreshRaw: string | undefined,
    accessContext: AccessContext,
    clientMeta?: RefreshClientMeta,
  ) {
    const row = await this.requireValidRefreshToken(refreshRaw, accessContext);
    const rotated = await this.refreshTokens.rotate(row, clientMeta ?? {});
    const sessionAuth = await this.issueAccessToken(row.user.id, row.user.email, accessContext);

    return {
      ...sessionAuth,
      refreshTokenRaw: rotated.rawToken,
      refreshCookieMaxAgeMs: rotated.maxAgeMs,
    };
  }

  async logout(refreshRaw: string | undefined) {
    await this.refreshTokens.revokeByRaw(refreshRaw);
  }

  async requestPasswordReset(input: ForgotPasswordBodyDto): Promise<{ message: string }> {
    return this.passwordResets.requestPasswordReset(input);
  }

  async resetPassword(input: ResetPasswordBodyDto): Promise<{ message: string }> {
    return this.passwordResets.resetPassword(input);
  }

  async canAccessAsPlatform(userId: string): Promise<boolean> {
    return this.canAccessContext(userId, AccessContext.platform);
  }

  async canAccessAsOrganization(userId: string): Promise<boolean> {
    return this.canAccessContext(userId, AccessContext.organization);
  }

  private async loginWithPassword(
    input: AuthLoginBodyDto,
    accessContext: AccessContext,
    refreshExpiresIn: string,
    meta?: RefreshClientMeta,
  ) {
    const email = input.email.trim().toLowerCase();

    const user = await this.users.findByEmail(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const eligible =
      accessContext === AccessContext.platform
        ? await this.canAccessAsPlatform(user.id)
        : await this.canAccessAsOrganization(user.id);

    if (!eligible) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueSessionForUser(user.id, accessContext, refreshExpiresIn, meta);
  }

  private async issueSessionForUser(
    userId: string,
    accessContext: AccessContext,
    refreshExpiresIn: string,
    meta?: RefreshClientMeta,
  ) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const sessionAuth = await this.issueAccessToken(user.id, user.email, accessContext);
    const refreshTokenRaw = await this.refreshTokens.createAndPersist(
      user.id,
      accessContext,
      meta,
      refreshExpiresIn,
    );
    const refreshCookieMaxAgeMs = parseDurationMs(refreshExpiresIn);

    return {
      ...sessionAuth,
      refreshTokenRaw,
      refreshCookieMaxAgeMs,
    };
  }

  private async issueAccessToken(userId: string, email: string, accessContext: AccessContext) {
    const accessToken = await this.signAccessToken(userId, email, accessContext);
    return {
      accessToken,
      tokenType: 'Bearer' as const,
    };
  }

  private async signAccessToken(userId: string, email: string, accessContext: AccessContext) {
    const payload: AccessTokenPayload = { sub: userId, email, aud: accessContext };
    return this.jwtService.signAsync(payload);
  }

  private async requireValidRefreshToken(
    refreshRaw: string | undefined,
    accessContext: AccessContext,
  ): Promise<RefreshToken & { user: { id: string; email: string; deletedAt: Date | null } }> {
    const row = await this.refreshTokens.findValidByRaw(refreshRaw);
    if (!row || row.accessContext !== accessContext) {
      throw new UnauthorizedException();
    }

    return row;
  }

  private async canAccessContext(userId: string, accessContext: AccessContext): Promise<boolean> {
    const user = await this.users.findById(userId);

    if (!user) {
      return false;
    }

    if (accessContext === AccessContext.platform) {
      if (user.isPlatformOwner) {
        return true;
      }

      const platformRole = await this.prisma.userRole.findFirst({
        where: {
          userId,
          deletedAt: null,
          role: {
            deletedAt: null,
            contextType: AccessContext.platform,
          },
        },
        select: { id: true },
      });

      return platformRole !== null;
    }

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
