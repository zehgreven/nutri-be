import { prismaClient } from '@src/database';
import { Profile } from 'prisma/generated/client';

import { IProfileRepository, Paginated, Paging } from '.';
import { BaseRepository } from './repository';

export class ProfileRepository
  extends BaseRepository<Profile>
  implements IProfileRepository
{
  constructor() {
    super(prismaClient.profile);
  }
}
