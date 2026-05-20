import type { Request } from 'express';

export function getClientIp(request: Request): string | undefined {
  const ip = request.ip || request.socket?.remoteAddress;
  const s = ip || undefined;
  return s ? s.slice(0, 64) : undefined;
}

export function getUserAgent(request: Request): string | undefined {
  const userAgentHeader = request.headers['user-agent'];
  return typeof userAgentHeader === 'string' ? userAgentHeader : undefined;
}
