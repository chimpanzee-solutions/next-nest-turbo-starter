import type { AccessContext } from '@generated/prisma/client';

export type JwtUser = {
  userId: string;
  email: string;
  accessContext: AccessContext;
};
