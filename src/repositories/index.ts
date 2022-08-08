import { Functionality } from '@src/models/functionality';
import { FunctionalityType } from '@src/models/functionality-type';
import { Permission } from '@src/models/permission';
import { Profile } from '@src/models/Profile';
import { User } from '@src/models/user';

export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  findAll(options: Partial<WithId<T>>): Promise<WithId<T>[]>;
  findOne(options: Partial<WithId<T>>): Promise<WithId<T> | undefined>;
  deleteAll(): Promise<void>;
}

export type FunctionalityTypeRepository = BaseRepository<FunctionalityType>;

export type FunctionalityRepository = BaseRepository<Functionality>;

export type PermissionRepository = BaseRepository<Permission>;

export type ProfileRepository = BaseRepository<Profile>;

export interface UserRepository extends BaseRepository<User> {
  findOneById(id: string): Promise<WithId<User> | undefined>;
  findOneByEmail(email: string): Promise<WithId<User> | undefined>;
}
