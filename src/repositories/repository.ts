import { Prisma } from '@src/generated/client';
import logger from '@src/logger';
import { IBaseCrudRepository, NoId, Paginated, Paging } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class AbstractRepository<T> implements IBaseCrudRepository<T> {
  public abstract create(data: NoId<T>): Promise<T>;
  public abstract update(id: string, data: T): Promise<T>;
  public abstract delete(id: string): Promise<T>;
  public abstract findAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>>;
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

  public async create(data: NoId<T>): Promise<T> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async update(id: string, data: T): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async delete(id: string): Promise<T> {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      this.handleError(error);
    }
  }

  protected getCustomFindAllProps(): any {
    return {};
  }

  public async findAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected buildWhere(options: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    Object.entries({ ...options }).map((val, _, __) => {
      const key = val[0];
      const value = val[1];

      if (typeof options[key] === 'string') {
        where[key] = { contains: value, mode: 'insensitive' };
      } else if (Array.isArray(options[key])) {
        where[key] = { in: value };
      } else {
        where[key] = value;
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const message = this.formatDatabaseError(error.code);

      if (this.isDatabaseValidationError(error.code)) {
        throw new DatabaseValidationError(message);
      }
      throw new DatabaseUnknownClientError(message);
    }
    logger.warn(`Database ${error}`);
    throw new DatabaseInternalError('Something unexpected happened to the database');
  }

  private isDatabaseValidationError(code: string): boolean {
    return ['P2000', 'P2002', 'P2003', 'P2004', 'P2007', 'P2011', 'P2012', 'P2020', 'P2033'].includes(code);
  }

  private formatDatabaseError(code: string): string {
    switch (code) {
      case 'P2000':
        return "The provided value for the column is too long for the column's type";
      case 'P2002':
        return 'Unique constraint failed';
      case 'P2003':
        return 'Foreign key constraint failed';
      case 'P2004':
        return 'A constraint failed on the database';
      case 'P2007':
        return 'Data validation error';
      case 'P2011':
        return 'Null constraint violation';
      case 'P2012':
        return 'Missing a required value';
      case 'P2015':
        return 'A related record could not be found.';
      case 'P2018':
        return 'The required connected records were not found.';
      case 'P2019':
        return 'Input error.';
      case 'P2020':
        return 'Value out of range for the type.';
      case 'P2023':
        return 'Inconsistent column data';
      case 'P2025':
        return 'An operation failed because it depends on one or more records that were required but not found';
      case 'P2033':
        return 'A number used in the query does not fit into a 64 bit signed integer.';
      default:
        return 'Something unexpected happened to the database';
    }
  }
}
