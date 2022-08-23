import { UserPermission } from '@prisma/client';
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
}
