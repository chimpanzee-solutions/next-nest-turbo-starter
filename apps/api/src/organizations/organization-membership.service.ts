import { Injectable } from '@nestjs/common';
import { MembershipStatus } from '@generated/prisma/client';
import type { PrismaDbClient } from '@/prisma/prisma.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrganizationMembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async createOwnerMembership(
    args: { userId: string; organizationId: string },
    dbClient?: PrismaDbClient,
  ) {
    const db = dbClient ?? this.prisma;
    return db.organizationMembership.create({
      data: {
        userId: args.userId,
        organizationId: args.organizationId,
        isOwner: true,
        status: MembershipStatus.active,
        joinedAt: new Date(),
      },
    });
  }
}
