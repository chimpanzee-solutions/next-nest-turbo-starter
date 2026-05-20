import { Injectable } from '@nestjs/common';
import type { Prisma } from '@generated/prisma/client';
import type { PrismaDbClient } from '@/prisma/prisma.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.OrganizationCreateInput, dbClient?: PrismaDbClient) {
    const db = dbClient ?? this.prisma;
    return db.organization.create({ data });
  }
}
