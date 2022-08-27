import { ProfilePermission } from 'prisma/generated/client';
import { prismaClient } from '@src/database';
import { UserPermission } from 'prisma/generated/client';

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
}
