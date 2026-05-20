import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AccessContext } from '@generated/prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ThrottlePublicAuth } from '@/common/throttling/throttle.decorator';
import { env } from '@/env';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from './utils/cookie.util';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthLoginBodyDto } from './dto/auth-login-body.dto';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { AuthMeResponseDto } from './dto/auth-me-response.dto';
import { AuthMessageResponseDto } from './dto/auth-message-response.dto';
import { AuthRefreshResponseDto } from './dto/auth-refresh-response.dto';
import { AuthSignupBodyDto } from './dto/auth-signup-body.dto';
import { AuthSessionResponseDto } from './dto/auth-session-response.dto';
import { ForgotPasswordBodyDto } from './dto/forgot-password-body.dto';
import { ResetPasswordBodyDto } from './dto/reset-password-body.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import type { RefreshClientMeta } from './types/refresh-client-meta';
import { rawRefreshCookie } from './utils/raw-refresh-cookie.util';
import { getClientIp, getUserAgent } from './utils/request-client.util';
import type { JwtUser } from './types/request-user';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getClientMeta(request: Request): RefreshClientMeta {
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    return {
      ...(ipAddress ? { ipAddress } : {}),
      ...(userAgent ? { userAgent } : {}),
    };
  }

  @Post('admin/login')
  @HttpCode(200)
  @ThrottlePublicAuth()
  @ApiOperation({ summary: 'Admin UI login — access token in body, refresh in HttpOnly cookie' })
  @ApiBody({ type: AuthLoginBodyDto })
  @ApiOkResponse({
    description: 'accessToken, tokenType (refresh token only in Set-Cookie)',
    type: AuthLoginResponseDto,
  })
  async adminLogin(
    @Body() input: AuthLoginBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginPlatformAdmin(input, this.getClientMeta(request));
    setRefreshTokenCookie(
      response,
      result.refreshTokenRaw,
      env.ADMIN_REFRESH_COOKIE_NAME,
      result.refreshCookieMaxAgeMs,
    );
    const { refreshTokenRaw: _raw, refreshCookieMaxAgeMs: _maxAge, ...body } = result;
    return body;
  }

  @Post('login')
  @HttpCode(200)
  @ThrottlePublicAuth()
  @ApiOperation({
    summary: 'Login — access token in body, refresh in HttpOnly cookie',
  })
  @ApiBody({ type: AuthLoginBodyDto })
  @ApiOkResponse({ description: 'accessToken, tokenType', type: AuthLoginResponseDto })
  async login(
    @Body() input: AuthLoginBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(input, this.getClientMeta(request));
    setRefreshTokenCookie(
      response,
      result.refreshTokenRaw,
      env.REFRESH_COOKIE_NAME,
      result.refreshCookieMaxAgeMs,
    );
    const { refreshTokenRaw: _raw, refreshCookieMaxAgeMs: _maxAge, ...body } = result;
    return body;
  }

  @Post('signup')
  @HttpCode(201)
  @ThrottlePublicAuth()
  @ApiOperation({
    summary: 'Create organization account — access token in body, refresh in HttpOnly cookie',
  })
  @ApiBody({ type: AuthSignupBodyDto })
  @ApiCreatedResponse({ description: 'accessToken, tokenType', type: AuthLoginResponseDto })
  async signup(
    @Body() input: AuthSignupBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signup(input, this.getClientMeta(request));
    setRefreshTokenCookie(
      response,
      result.refreshTokenRaw,
      env.REFRESH_COOKIE_NAME,
      result.refreshCookieMaxAgeMs,
    );
    const { refreshTokenRaw: _raw, refreshCookieMaxAgeMs: _maxAge, ...body } = result;
    return body;
  }

  @Post('forgot-password')
  @ThrottlePublicAuth()
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Request password reset (organization app users only; same response whether email exists)',
  })
  @ApiBody({ type: ForgotPasswordBodyDto })
  @ApiOkResponse({ description: 'Generic success message', type: AuthMessageResponseDto })
  async forgotPassword(@Body() input: ForgotPasswordBodyDto) {
    return this.authService.requestPasswordReset(input);
  }

  @Post('reset-password')
  @ThrottlePublicAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Complete password reset with token from email link' })
  @ApiBody({ type: ResetPasswordBodyDto })
  @ApiOkResponse({ type: AuthMessageResponseDto })
  async resetPassword(@Body() input: ResetPasswordBodyDto) {
    return this.authService.resetPassword(input);
  }

  @Post('admin/session')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Admin UI bootstrap — issue access token and me from admin refresh cookie',
  })
  @ApiOkResponse({
    description: 'accessToken, tokenType, me',
    type: AuthSessionResponseDto,
  })
  async adminSession(@Req() request: Request) {
    return this.authService.getSessionFromRefresh(
      rawRefreshCookie(request, env.ADMIN_REFRESH_COOKIE_NAME),
      AccessContext.platform,
      this.getClientMeta(request),
    );
  }

  @Post('admin/refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin UI — issue new access token using admin refresh cookie' })
  @ApiOkResponse({ description: 'accessToken, tokenType', type: AuthRefreshResponseDto })
  async adminRefresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refreshSession(
      rawRefreshCookie(request, env.ADMIN_REFRESH_COOKIE_NAME),
      AccessContext.platform,
      this.getClientMeta(request),
    );
    setRefreshTokenCookie(
      response,
      result.refreshTokenRaw,
      env.ADMIN_REFRESH_COOKIE_NAME,
      result.refreshCookieMaxAgeMs,
    );
    const { refreshTokenRaw: _raw, refreshCookieMaxAgeMs: _maxAge, ...body } = result;
    return body;
  }

  @Post('admin/logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Admin UI — revoke admin refresh session and clear cookie' })
  @ApiNoContentResponse({ description: 'Admin refresh session revoked' })
  async adminLogout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const rawToken = rawRefreshCookie(request, env.ADMIN_REFRESH_COOKIE_NAME);
    await this.authService.logout(rawToken);
    clearRefreshTokenCookie(response, env.ADMIN_REFRESH_COOKIE_NAME);
  }

  @Post('session')
  @HttpCode(200)
  @ApiOperation({ summary: 'Issue access token and me using refresh cookie' })
  @ApiOkResponse({
    description: 'accessToken, tokenType, me',
    type: AuthSessionResponseDto,
  })
  async session(@Req() request: Request) {
    return this.authService.getSessionFromRefresh(
      rawRefreshCookie(request, env.REFRESH_COOKIE_NAME),
      AccessContext.organization,
      this.getClientMeta(request),
    );
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Issue new access token using refresh cookie' })
  @ApiOkResponse({ description: 'accessToken, tokenType', type: AuthRefreshResponseDto })
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.refreshSession(
      rawRefreshCookie(request, env.REFRESH_COOKIE_NAME),
      AccessContext.organization,
      this.getClientMeta(request),
    );
    setRefreshTokenCookie(
      response,
      result.refreshTokenRaw,
      env.REFRESH_COOKIE_NAME,
      result.refreshCookieMaxAgeMs,
    );
    const { refreshTokenRaw: _raw, refreshCookieMaxAgeMs: _maxAge, ...body } = result;
    return body;
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke refresh session and clear cookie' })
  @ApiNoContentResponse({ description: 'Refresh session revoked' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const rawToken = rawRefreshCookie(request, env.REFRESH_COOKIE_NAME);
    await this.authService.logout(rawToken);
    clearRefreshTokenCookie(response, env.REFRESH_COOKIE_NAME);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Current user, orgs, roles, permissions' })
  @ApiOkResponse({ type: AuthMeResponseDto })
  async me(@CurrentUser() user: JwtUser) {
    return this.authService.getMe(user.userId);
  }
}
