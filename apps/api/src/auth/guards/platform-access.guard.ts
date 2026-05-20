import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AccessContext } from '@generated/prisma/client';
import type { JwtUser } from '@/auth/types/request-user';

@Injectable()
export class PlatformAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: JwtUser }>();
    const user = request.user;
    if (!user || user.accessContext !== AccessContext.platform) {
      throw new ForbiddenException();
    }
    return true;
  }
}
