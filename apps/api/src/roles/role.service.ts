import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessContext } from '@generated/prisma/client';
import type { PrismaDbClient } from '@/prisma/prisma.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganizationRoleWithAllPermissions(
    args: { name: string; organizationId: string },
    dbClient?: PrismaDbClient,
  ) {
    const db = dbClient ?? this.prisma;

    const role = await db.role.create({
      data: {
        name: args.name,
        contextType: AccessContext.organization,
        organizationId: args.organizationId,
        isSystem: true,
      },
    });

    const permissions = await db.permission.findMany({
      where: {
        contextType: AccessContext.organization,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (permissions.length > 0) {
      await db.rolePermission.createMany({
        data: permissions.map((permission) => ({
          roleId: role.id,
          permissionId: permission.id,
        })),
      });
    }

    return role;
  }

  async assignRoleToUserInOrganization(
    args: { userId: string; roleId: string; organizationId: string; assignedBy?: string | null },
    dbClient?: PrismaDbClient,
  ) {
    const db = dbClient ?? this.prisma;

    const role = await db.role.findFirst({
      where: {
        id: args.roleId,
        deletedAt: null,
        contextType: AccessContext.organization,
        organizationId: args.organizationId,
      },
      select: { id: true },
    });

    if (!role) {
      throw new NotFoundException('Organization role not found');
    }

    return db.userRole.create({
      data: {
        userId: args.userId,
        roleId: args.roleId,
        organizationId: args.organizationId,
        assignedBy: args.assignedBy ?? null,
        assignedAt: new Date(),
      },
    });
  }
}
