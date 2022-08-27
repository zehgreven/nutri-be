import { prismaClient } from '@src/database';
import { ProfilePermission } from '@src/generated/client';

import logger from '@src/logger';
import { IProfilePermissionRepository } from '.';
import { BaseRepository } from './repository';

export class ProfilePermissionRepository
  extends BaseRepository<ProfilePermission>
  implements IProfilePermissionRepository
{
  constructor() {
    super(prismaClient.profilePermission);
  }

  async updateManyOrCreateMany(
    permissions: ProfilePermission[],
  ): Promise<void | null> {
    permissions.forEach(async data => {
      const found = await prismaClient.profilePermission.findFirst({
        select: {
          id: true,
        },
        where: {
          functionalityId: data.functionalityId,
          profileId: data.profileId,
        },
      });
      if (found?.id) {
        await prismaClient.profilePermission.update({
          data,
          where: { id: found.id },
        });
      } else {
        await prismaClient.profilePermission.create({ data });
      }
    });
  }

  async findAllByUser(userId: string): Promise<Partial<ProfilePermission>[]> {
    const user = await prismaClient.user.findFirst({
      where: { id: userId, active: true },
      include: {
        profiles: {
          where: {
            active: true,
            profile: {
              active: true,
            },
          },
          include: {
            profile: true,
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const { profiles } = user;

    const permissions = [];

    for (const userProfile of profiles) {
      const profilePermission = await prismaClient.profilePermission.findMany({
        select: {
          id: true,
          active: true,
          allow: true,
          functionality: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
        where: {
          profileId: userProfile.profile.id,
          functionality: {
            active: true,
          },
        },
      });

      if (profilePermission) {
        permissions.push(...profilePermission);
      }
    }

    return permissions;
  }
}
