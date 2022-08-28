import { UserPermission } from '@src/generated/client';
import { prismaClient } from '@src/database';

import { IUserPermissionRepository } from '.';
import { BaseRepository } from './repository';

export class UserPermissionRepository
  extends BaseRepository<UserPermission>
  implements IUserPermissionRepository
{
  constructor() {
    super(prismaClient.userPermission);
  }

  async updateManyOrCreateMany(
    permissions: UserPermission[],
  ): Promise<void | null> {
    permissions.forEach(async data => {
      const found = await prismaClient.userPermission.findFirst({
        select: {
          id: true,
        },
        where: {
          functionalityId: data.functionalityId,
          userId: data.userId,
        },
      });
      if (found?.id) {
        await prismaClient.userPermission.update({
          data,
          where: { id: found.id },
        });
      } else {
        await prismaClient.userPermission.create({ data });
      }
    });
  }

  findAllByUser(userId: string): Promise<Partial<UserPermission>[]> {
    return prismaClient.userPermission.findMany({
      select: {
        id: true,
        active: true,
        allow: true,
        functionality: {
          select: {
            id: true,
            name: true,
            path: true,
            icon: true,
            functionalityType: {
              select: {
                name: true,
              },
            },
            master: {
              select: {
                id: true,
                name: true,
                path: true,
                icon: true,
              },
            },
          },
        },
      },
      where: {
        userId,
        active: true,
        allow: true,
        functionality: {
          active: true,
        },
      },
    });
  }
}
