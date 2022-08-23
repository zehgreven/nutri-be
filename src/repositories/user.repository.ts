import { User } from '@prisma/client';

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

  findOneByEmail(email: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: { email },
    });
  }
}
