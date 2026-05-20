import type { AccessContext } from '@generated/prisma/client';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  aud: AccessContext;
};
