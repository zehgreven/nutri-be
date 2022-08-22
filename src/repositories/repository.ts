import { Prisma } from '@prisma/client';
import { IBaseRepository, NoId, Paginated, Paging } from '.';

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseValidationError extends DatabaseError {}

export class DatabaseUnknownClientError extends DatabaseError {}

export class DatabaseInternalError extends DatabaseError {}

export abstract class Repository<T> implements IBaseRepository<T> {
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
