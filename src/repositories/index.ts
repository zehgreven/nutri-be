import { User } from '@src/models/user';

export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  findAll(options: Partial<WithId<T>>): Promise<WithId<T>[]>;
  findOne(options: Partial<WithId<T>>): Promise<WithId<T> | undefined>;
  deleteAll(): Promise<void>;
}

export interface UserRepository extends BaseRepository<User> {
  findOneById(id: string): Promise<WithId<User> | undefined>;
  findOneByEmail(email: string): Promise<WithId<User> | undefined>;
}
