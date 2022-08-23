import { ProfilePermission } from '@prisma/client';
import { prismaClient } from '@src/database';

import { IProfilePermissionRepository } from '.';
import { BaseRepository } from './repository';

export class ProfilePermissionRepository
  extends BaseRepository<ProfilePermission>
  implements IProfilePermissionRepository
{
  constructor() {
    super(prismaClient.profilePermission);
  }
}
