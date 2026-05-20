import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@generated/prisma/client';
import type { PrismaDbClient } from '@/prisma/prisma.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrialSubscriptionForOrganization(
    args: { organizationId: string; planCode?: string },
    dbClient?: PrismaDbClient,
  ) {
    const db = dbClient ?? this.prisma;
    const planCode = args.planCode?.trim() || 'starter';

    const plan = await db.plan.findFirst({
      where: {
        code: planCode,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!plan) {
      throw new BadRequestException('Invalid plan selected.');
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000);

    return db.subscription.create({
      data: {
        organizationId: args.organizationId,
        planId: plan.id,
        status: SubscriptionStatus.trialing,
        subscribedAt: now,
        trialStartAt: now,
        trialEndAt: trialEnd,
        currentPeriodStart: now,
        currentPeriodEnd: trialEnd,
        billingProvider: 'manual',
      },
    });
  }
}
