import { PlanInterval, type PrismaClient } from '../../generated/prisma/client';

/**
 * Idempotent: safe to run on every `pnpm db:seed`.
 * Starter / Growth sample plans. Adjust pricing and limits for your product.
 */
export async function upsertBillingPlans(prisma: PrismaClient): Promise<void> {
  await prisma.plan.upsert({
    where: { code: 'starter' },
    create: {
      name: 'Starter',
      code: 'starter',
      price: 29,
      currency: 'USD',
      interval: PlanInterval.monthly,
      intervalCount: 1,
      trialDays: 7,
      maxUsers: 2,
      isActive: true,
    },
    update: {
      name: 'Starter',
      price: 29,
      currency: 'USD',
      interval: PlanInterval.monthly,
      trialDays: 7,
      maxUsers: 2,
      isActive: true,
      deletedAt: null,
    },
  });

  await prisma.plan.upsert({
    where: { code: 'growth' },
    create: {
      name: 'Growth',
      code: 'growth',
      price: 99,
      currency: 'USD',
      interval: PlanInterval.monthly,
      intervalCount: 1,
      trialDays: 7,
      maxUsers: null,
      isActive: true,
    },
    update: {
      name: 'Growth',
      price: 99,
      currency: 'USD',
      interval: PlanInterval.monthly,
      trialDays: 7,
      maxUsers: null,
      isActive: true,
      deletedAt: null,
    },
  });

  console.log('[seed] Billing plans upserted (starter, growth).');
}
