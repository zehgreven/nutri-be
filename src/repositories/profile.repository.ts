import { Profile } from '@prisma/client';
import { prismaClient } from '@src/database';

import { IProfileRepository } from '.';
import { BaseRepository } from './repository';

export class ProfileRepository
  extends BaseRepository<Profile>
  implements IProfileRepository
{
  constructor() {
    super(prismaClient.profile);
  }
}
