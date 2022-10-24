import logger from '@src/logger';
import { IBaseCrudRepository } from '@src/repositories';
import { NoId } from '@src/util/id-utils';
import { Paginated, Paging } from '@src/util/page-utils';

export interface IBaseCrudService<T> {
  create(data: NoId<T>): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
  getAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>>;
  getById(id: string): Promise<T | null>;
}

export abstract class AbstractCrudService<T> implements IBaseCrudService<T> {
  public abstract create(data: NoId<T>): Promise<T>;
  public abstract update(id: string, data: T): Promise<T>;
  public abstract delete(id: string): Promise<T>;
  public abstract getAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>>;
  public abstract getById(id: string): Promise<T | null>;
}

export class BaseCrudService<T> extends AbstractCrudService<T> {
  constructor(protected repository: IBaseCrudRepository<T>) {
    super();
  }

  public async create(data: NoId<T>): Promise<T> {
    return await this.repository.create(data);
  }

  public async update(id: string, data: T): Promise<T> {
    if (!id) {
      logger.error('Missing parameter id');
      throw new Error('Missing parameter id');
    }

    return await this.repository.update(id, data);
  }

  public async delete(id: string): Promise<T> {
    if (!id) {
      logger.error('Missing parameter id');
      throw new Error('Missing parameter id');
    }

    return await this.repository.delete(id);
  }

  public async getAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>> {
    return await this.repository.findAll(options, paging);
  }

  public async getById(id: string): Promise<T | null> {
    if (!id) {
      logger.error('Missing parameter id');
      throw new Error('Missing parameter id');
    }
    return await this.repository.findOne({ id });
  }
}
