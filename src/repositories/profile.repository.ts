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

  public async findProfilesByUser(
    userId: string,
    options: Partial<Profile>,
    paging: Paging,
  ): Promise<Paginated<Profile>> {
    try {
      const { limit, page } = paging;
      const where = this.buildWhere(options);

      const result = await prismaClient.profile.findMany({
        skip: limit * page,
        take: limit,

        orderBy: {
          created_at: 'desc',
        },
      });

      const count = await prismaClient.profile.count({ where });

      const previousPage = page > 0 ? page : undefined;
      const totalPages = Math.max(Math.ceil(count / limit), 1);
      const nextPage = page + 2 > totalPages ? undefined : page + 2;

      return {
        result,
        page: page + 1,
        previousPage,
        nextPage,
        totalPages,
        limit,
        count,
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
