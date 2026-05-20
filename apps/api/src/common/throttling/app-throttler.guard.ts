import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { getClientIp } from '@/auth/utils/request-client.util';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Parameters<ThrottlerGuard['getTracker']>[0]) {
    return Promise.resolve(getClientIp(req as Request) ?? 'unknown');
  }
}
