import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MembershipStatus, AccessContext } from '@generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { JwtUser } from '@/auth/types/request-user';

@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: JwtUser; params?: Record<string, string> }>();
    const user = request.user;
    const organizationId = request.params?.organizationId;

    if (!user?.userId) {
      throw new UnauthorizedException();
    }
    if (!organizationId) {
      throw new ForbiddenException();
    }

    if (user.accessContext === AccessContext.platform) {
      return true;
    }

    const membership = await this.prisma.organizationMembership.findFirst({
      where: {
        userId: user.userId,
        organizationId,
        deletedAt: null,
        status: MembershipStatus.active,
      },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException();
    }

    return true;
  }
}
