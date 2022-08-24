import { Prisma } from '@prisma/client';
import logger from '@src/logger';
import { IBaseRepository, NoId, Paginated, Paging } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class AbstractRepository<T> implements IBaseRepository<T> {
  public abstract create(data: NoId<T>): Promise<T>;
  public abstract update(id: string, data: T): Promise<T>;
  public abstract delete(id: string): Promise<T>;
  public abstract findAll(
    options: Partial<T>,
    paging: Paging,
  ): Promise<Paginated<T>>;
  public abstract findOne(options: Partial<T>): Promise<T | null>;
  public abstract deleteAll(): Promise<Prisma.BatchPayload>;
}

export class BaseRepository<T> extends AbstractRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected model: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(model: any) {
    super();
    this.model = model;
  }

  public create(data: NoId<T>): Promise<T> {
    return this.model.create({ data });
  }

  public update(id: string, data: T): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  public delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  protected getCustomFindAllProps(): any {
    return {};
  }

  public async findAll(
    options: Partial<T>,
    paging: Paging,
  ): Promise<Paginated<T>> {
    try {
      const { limit, page } = paging;

      const where = this.buildWhere(options);

      const result = await this.model.findMany({
        skip: limit * page,
        take: limit,
        where,
        orderBy: {
          created_at: 'desc',
        },
        ...this.getCustomFindAllProps(),
      });

      const count = await this.model.count({ where });

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

  protected buildWhere(options: Partial<T>) {
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
    return where;
  }

  public findOne(where: Partial<T>): Promise<T | null> {
    return this.model.findFirst({ where });
  }

  public deleteAll(): Promise<Prisma.BatchPayload> {
    return this.model.deleteMany({});
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
