import { Functionality } from '@prisma/client';

import { prismaClient } from '@src/database';

import { IFunctionalityRepository, Paginated, Paging } from '.';
import { BaseRepository } from './repository';

export class FunctionalityRepository
  extends BaseRepository<Functionality>
  implements IFunctionalityRepository
{
  constructor() {
    super(prismaClient.functionality);
  }

  protected getCustomFindAllProps() {
    return {
      include: {
        functionalityType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };
  }

  public async findFunctionalitiesByProfile(
    profileId: string,
    options: Partial<Functionality>,
    paging: Paging,
  ): Promise<Paginated<Functionality>> {
    try {
      const { limit, page } = paging;
      const where = this.buildWhere(options);

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
          profilePermissions: {
            select: {
              id: true,
              allow: true,
            },
            where: {
              profileId,
              active: true,
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

  public async findFunctionalitiesByUser(
    userId: string,
    options: Partial<Functionality>,
    paging: Paging,
  ): Promise<Paginated<Functionality>> {
    try {
      const { limit, page } = paging;
      const where = this.buildWhere(options);

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
          userPermissions: {
            select: {
              id: true,
              allow: true,
            },
            where: {
              userId,
              active: true,
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
