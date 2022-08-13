import { Functionality } from '@src/models/functionality';
import { FunctionalityType } from '@src/models/functionality-type';
import { Permission } from '@src/models/permission';
import { Person } from '@src/models/person';
import { Profile } from '@src/models/profile';
import { User } from '@src/models/user';
import { Paging } from './default-mongodb-repository';

export type WithId<T> = { id: string } & T;

export type Paginated<T> = {
  result: WithId<T>[];
  page: number;
  previousPage: number | undefined;
  nextPage: number | undefined;
  totalPages: number;
  limit: number;
  count: number;
};

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  update(id: string, data: T): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(options: Partial<WithId<T>>, paging: Paging): Promise<Paginated<T>>;
  findOne(options: Partial<WithId<T>>): Promise<WithId<T> | undefined>;
  deleteAll(): Promise<void>;
}

export type FunctionalityTypeRepository = BaseRepository<FunctionalityType>;

export type FunctionalityRepository = BaseRepository<Functionality>;

export type PermissionRepository = BaseRepository<Permission>;

export type ProfileRepository = BaseRepository<Profile>;

export type PersonRepository = BaseRepository<Person>;

export interface UserRepository extends BaseRepository<User> {
  findOneById(id: string): Promise<WithId<User> | undefined>;
  findOneByEmail(email: string): Promise<WithId<User> | undefined>;
}
