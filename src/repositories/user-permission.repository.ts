import { UserPermission, Prisma } from '@prisma/client';

import { prismaClient } from '@src/database';
import logger from '@src/logger';

import { IUserPermissionRepository, NoId, Paginated, Paging } from '.';
import { DatabaseInternalError } from './repository';

export class UserPermissionRepository implements IUserPermissionRepository {
  create(data: NoId<UserPermission>): Promise<UserPermission> {
    return prismaClient.userPermission.create({ data });
  }

  update(id: string, data: UserPermission): Promise<UserPermission> {
    return prismaClient.userPermission.update({
      where: { id },
      data,
    });
  }

  delete(id: string): Promise<UserPermission> {
    return prismaClient.userPermission.delete({ where: { id } });
  }

  async findAll(
    options: Partial<UserPermission>,
    paging: Paging,
  ): Promise<Paginated<UserPermission>> {
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

      const result = await prismaClient.userPermission.findMany({
        skip: limit * page,
        take: limit,
        where,
        orderBy: {
          created_at: 'desc',
        },
      });

      const count = await prismaClient.userPermission.count({ where });

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

  findOne(where: Partial<UserPermission>): Promise<UserPermission | null> {
    return prismaClient.userPermission.findFirst({ where });
  }

  deleteAll(): Promise<Prisma.BatchPayload> {
    return prismaClient.userPermission.deleteMany({});
  }

  protected handleError(error: unknown): never {
    // if (error instanceof Error.ValidationError) {
    //   const duplicatedKindErrors = Object.values(error.errors).filter(
    //     err =>
    //       err.name == 'ValidatorError' &&
    //       err.kind == CustomValidation.DUPLICATED,
    //   );

    //   if (duplicatedKindErrors.length) {
    //     throw new DatabaseValidationError(error.message);
    //   }
    //   throw new DatabaseUnknownClientError(error.message);
    // }
    logger.warn(`Database error ${error}`);
    throw new DatabaseInternalError(
      'Something unexpected happened to the database',
    );
  }
}
