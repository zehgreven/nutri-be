import { prismaClient } from '@src/database';
import { UserProfile } from '@src/generated/client';
import { IUserProfileRepository } from '.';

import { BaseRepository } from './repository';

export class UserProfileRepository
  extends BaseRepository<UserProfile>
  implements IUserProfileRepository
{
  constructor() {
    super(prismaClient.userProfile);
  }

  async updateManyOrCreateMany(data: UserProfile[]): Promise<void | null> {
    data.forEach(async userProfile => {
      const found = await prismaClient.userProfile.findFirst({
        select: {
          id: true,
        },
        where: {
          profileId: userProfile.profileId,
          userId: userProfile.userId,
        },
      });
      if (found?.id) {
        await prismaClient.userProfile.update({
          data: userProfile,
          where: { id: found.id },
        });
      } else {
        await prismaClient.userProfile.create({ data: userProfile });
      }
    });
  }
}
