import * as bcrypt from 'bcrypt';
import {
  AccessContext,
  DiscountType,
  MembershipStatus,
  OrganizationType,
  Prisma,
  SubscriptionStatus,
  type PrismaClient,
} from '../../generated/prisma/client';

const SALT_ROUNDS = 10;
const defaultSeedPassword = 'password';

export const defaultAdminAccount = {
  email: 'admin@example.com',
  password: defaultSeedPassword,
  name: 'Platform Admin',
} as const;

export const defaultBusinessAccount = {
  organizationName: 'Acme Workspace',
  organizationType: OrganizationType.workspace,
  userName: 'Starter Owner',
  email: 'owner@example.com',
  password: defaultSeedPassword,
} as const;

const SUPER_ADMIN_ROLE_NAME = 'Super Admin';
const ORGANIZATION_OWNER_ROLE_NAME = 'Owner';

async function assertInitialSeedCanRun(prisma: PrismaClient): Promise<boolean> {
  const [userCount, roleCount, orgCount] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.organization.count(),
  ]);

  const hasSeededRows = userCount > 0 || roleCount > 0 || orgCount > 0;
  if (hasSeededRows) {
    console.log('[seed] Skipped: initial seed already applied.');
    return false;
  }

  return true;
}

async function createRoleForContext(
  prisma: PrismaClient,
  args: { name: string; contextType: AccessContext; organizationId: string | null },
) {
  return prisma.role.create({
    data: {
      name: args.name,
      contextType: args.contextType,
      organizationId: args.organizationId,
      isSystem: true,
    },
  });
}

export async function runInitialSeed(prisma: PrismaClient): Promise<void> {
  const shouldRun = await assertInitialSeedCanRun(prisma);
  if (!shouldRun) {
    return;
  }

  const adminPasswordHash = await bcrypt.hash(defaultAdminAccount.password, SALT_ROUNDS);
  const businessPasswordHash = await bcrypt.hash(defaultBusinessAccount.password, SALT_ROUNDS);

  const adminUser = await prisma.user.create({
    data: {
      email: defaultAdminAccount.email,
      name: defaultAdminAccount.name,
      passwordHash: adminPasswordHash,
      isPlatformOwner: true,
    },
  });

  const adminSuperAdminRole = await createRoleForContext(prisma, {
    name: SUPER_ADMIN_ROLE_NAME,
    contextType: AccessContext.platform,
    organizationId: null,
  });

  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminSuperAdminRole.id,
      organizationId: null,
      assignedAt: new Date(),
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: defaultBusinessAccount.organizationName,
      type: defaultBusinessAccount.organizationType,
      isActive: true,
    },
  });

  const businessUser = await prisma.user.create({
    data: {
      email: defaultBusinessAccount.email,
      name: defaultBusinessAccount.userName,
      passwordHash: businessPasswordHash,
    },
  });

  await prisma.organizationMembership.create({
    data: {
      userId: businessUser.id,
      organizationId: organization.id,
      isOwner: true,
      status: MembershipStatus.active,
      joinedAt: new Date(),
    },
  });

  const orgSuperAdminRole = await createRoleForContext(prisma, {
    name: ORGANIZATION_OWNER_ROLE_NAME,
    contextType: AccessContext.organization,
    organizationId: organization.id,
  });

  await prisma.userRole.create({
    data: {
      userId: businessUser.id,
      roleId: orgSuperAdminRole.id,
      organizationId: organization.id,
      assignedAt: new Date(),
    },
  });

  await prisma.$transaction(async (tx) => {
    const plan = await tx.plan.findFirst({
      where: { code: 'starter', deletedAt: null, isActive: true },
    });
    if (plan) {
      const now = new Date();
      const trialEnd = new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000);
      await tx.subscription.create({
        data: {
          organizationId: organization.id,
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
  });

  const seedNow = new Date();
  const currentPeriodEnd = new Date(seedNow.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.subscription.updateMany({
    where: { organizationId: organization.id, deletedAt: null },
    data: {
      status: SubscriptionStatus.active,
      activatedAt: seedNow,
      currentPeriodStart: seedNow,
      currentPeriodEnd,
      trialStartAt: null,
      trialEndAt: null,
      discountType: DiscountType.percent,
      discountValue: new Prisma.Decimal(100),
      discountReason: 'Seed: 100% discount forever (local dev)',
      discountStartsAt: seedNow,
      discountEndsAt: null,
    },
  });

  console.log('[seed] Initial seed completed.');
}
