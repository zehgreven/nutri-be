import { ProfilePermission } from '@prisma/client';
import { prismaClient } from '@src/database';
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
        const updated = await prismaClient.profilePermission.update({
          data,
          where: { id: found.id },
        });
        logger.error('updated >> ' + updated);
      } else {
        const created = await prismaClient.profilePermission.create({ data });
        logger.error('created >> ' + created);
      }
    });
  }
}
