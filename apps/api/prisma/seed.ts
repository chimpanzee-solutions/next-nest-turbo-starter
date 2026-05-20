import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from '../src/env';
import { upsertBillingPlans } from './seed/billing-plans-seed';
import { runInitialSeed } from './seed/initial-seed';

async function main() {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    await upsertBillingPlans(prisma);
    await runInitialSeed(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
