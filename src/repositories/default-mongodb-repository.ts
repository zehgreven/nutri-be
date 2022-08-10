import logger from '@src/logger';
import { BaseModel } from '@src/models';
import { CustomValidation } from '@src/models/user';
import { Error, Model } from 'mongoose';
import { WithId } from '.';
import {
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
  Repository,
} from './repository';

export interface Paging {
  page: number;
  limit: number;
}

export abstract class DefaultMongoDBRepository<
  T extends BaseModel,
> extends Repository<T> {
  constructor(private model: Model<T>) {
    super();
  }

  public async create(data: T) {
    try {
      const model = new this.model(data);
      const createdData = await model.save();
      return createdData.toJSON<WithId<T>>({ flattenMaps: false });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(options: Partial<WithId<T>>) {
    try {
      const data = await this.model.findOne(options);

      return data?.toJSON<WithId<T>>({ flattenMaps: false });
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(options: Partial<WithId<T>>, paging: Paging) {
    try {
      const { limit, page } = paging;

      const query = {};
      Object.entries({ ...options }).map((val, _, __) => {
        if (typeof options[val[0]] === 'string') {
          query[val[0]] = { $regex: val[1], $options: 'i' };
        } else {
          query[val[0]] = val[1];
        }
      });

      const data = await this.model
        .find(query)
        .skip(limit * page)
        .limit(limit);

      const count = await this.model.countDocuments(query);

      const previousPage = page > 0 ? page : undefined;
      const totalPages = Math.max(Math.ceil(count / limit), 1);
      const nextPage = page + 2 > totalPages ? undefined : page + 2;

      return {
        result: data.map(d => d.toJSON<WithId<T>>({ flattenMaps: false })),
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

  async deleteAll() {
    await this.model.deleteMany({});
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        err =>
          err.name == 'ValidatorError' &&
          err.kind == CustomValidation.DUPLICATED,
      );

      if (duplicatedKindErrors.length) {
        throw new DatabaseValidationError(error.message);
      }
      throw new DatabaseUnknownClientError(error.message);
    }
    logger.warn(`Database error ${error}`);
    throw new DatabaseInternalError(
      'Something unexpected happened to the database',
    );
  }
}
