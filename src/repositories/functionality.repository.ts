import { Functionality } from '@prisma/client';

import { prismaClient } from '@src/database';

import { IFunctionalityRepository, Paginated, Paging } from '.';
import { BaseRepository } from './repository';

export class FunctionalityRepository
  extends BaseRepository<Functionality>
  implements IFunctionalityRepository
{
  async findAll(
    options: Partial<Functionality>,
    paging: Paging,
  ): Promise<Paginated<Functionality>> {
    try {
      const { limit, page } = paging;

      const where = {};
      Object.entries({ ...options }).map((val, _, __) => {
        if (typeof options[val[0]] === 'string') {
          where[val[0]] = { contains: val[1], mode: 'insensitive' };
        } else if (typeof options[val[0]] === 'array') {
          where[val[0]] = { in: val[1] };
        } else {
          where[val[0]] = val[1];
        }
      });

      const result = await prismaClient.functionality.findMany({
        skip: limit * page,
        take: limit,
        where,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          functionalityType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const count = await prismaClient.functionality.count({ where });

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
