import { User } from '@src/generated/client';

import { prismaClient } from '@src/database';

import { IUserRepository } from '.';
import { BaseRepository } from './repository';

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(prismaClient.user);
  }

  findOneById(id: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: { id },
    });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: { username },
    });
  }
}
