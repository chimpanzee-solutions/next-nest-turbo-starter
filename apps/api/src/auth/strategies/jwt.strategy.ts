import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessContext } from '@generated/prisma/client';
import { env } from '@/env';
import { UserService } from '@/users/user.service';
import { AuthService } from '../services/auth.service';
import type { AccessTokenPayload } from '../types/access-token-payload';
import type { JwtUser } from '../types/request-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly users: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<JwtUser> {
    const accessContext = payload.aud;

    if (
      !payload?.sub ||
      !payload?.email ||
      (accessContext !== AccessContext.platform && accessContext !== AccessContext.organization)
    ) {
      throw new UnauthorizedException();
    }

    const user = await this.users.findByIdAndEmail(payload.sub, payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (accessContext === AccessContext.platform) {
      const allowed = await this.authService.canAccessAsPlatform(user.id);
      if (!allowed) {
        throw new UnauthorizedException();
      }
    } else if (accessContext === AccessContext.organization) {
      const allowed = await this.authService.canAccessAsOrganization(user.id);
      if (!allowed) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }

    return { userId: user.id, email: user.email, accessContext };
  }
}
