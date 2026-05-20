import { Injectable } from '@nestjs/common';
import type { Prisma } from '@generated/prisma/client';
import { PrismaService, type PrismaDbClient } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput, dbClient?: PrismaDbClient) {
    const db = dbClient ?? this.prisma;
    return db.user.create({ data });
  }

  async update(userId: string, data: Prisma.UserUpdateInput, dbClient?: PrismaDbClient) {
    const db = dbClient ?? this.prisma;
    return db.user.update({
      where: { id: userId },
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findById(userId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  async findByIdAndEmail(userId: string, email: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        email,
        deletedAt: null,
      },
    });
  }

  async getUserDetails(userId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      include: {
        organizationMemberships: {
          where: {
            deletedAt: null,
            organization: { deletedAt: null },
          },
          include: { organization: true },
        },
        userRoles: {
          where: {
            deletedAt: null,
            role: { deletedAt: null },
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
            organization: true,
          },
        },
      },
    });
  }
}
