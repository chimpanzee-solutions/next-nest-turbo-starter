import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BillingModule } from '@/billing/billing.module';
import { env } from '@/env';
import { OrganizationsModule } from '@/organizations/organizations.module';
import { RolesModule } from '@/roles/roles.module';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { OrganizationAccessGuard } from './guards/organization-access.guard';
import { PlatformAccessGuard } from './guards/platform-access.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { PasswordResetService } from './services/password-reset.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    BillingModule,
    OrganizationsModule,
    UsersModule,
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn:
          env.JWT_ACCESS_EXPIRES_IN as `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RefreshTokenService,
    PasswordResetService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    PlatformAccessGuard,
    OrganizationAccessGuard,
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard, PlatformAccessGuard, OrganizationAccessGuard],
})
export class AuthModule {}
