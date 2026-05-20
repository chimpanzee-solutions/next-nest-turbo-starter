import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Prisma } from '@generated/prisma/client';
import { env } from '@/env';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    super({ adapter });
  }

  async onModuleInit() {
    if (process.env.SKIP_DB_CONNECT === '1') {
      return;
    }
    await this.$connect();
  }

  async onModuleDestroy() {
    if (process.env.SKIP_DB_CONNECT === '1') {
      return;
    }
    await this.$disconnect();
  }
}

export type PrismaDbClient = PrismaService | Prisma.TransactionClient;
