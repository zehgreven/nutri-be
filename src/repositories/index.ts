import {
  Functionality,
  FunctionalityType,
  UserPermission,
  ProfilePermission,
  Profile,
  User,
  Prisma,
  UserProfile,
} from '@src/generated/client';
import { NoId } from '@src/util/id-utils';
import { Paginated, Paging } from '@src/util/page-utils';

export interface IBaseCrudRepository<T> {
  create(data: NoId<T>): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
  findAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>>;
  findOne(options: Partial<T>): Promise<T | null>;
  deleteAll(): Promise<Prisma.BatchPayload>;
}

export type IFunctionalityTypeRepository = IBaseCrudRepository<FunctionalityType>;

export type IFunctionalityRepository = IBaseCrudRepository<Functionality>;

export type IProfileRepository = IBaseCrudRepository<Profile>;

export interface IUserRepository extends IBaseCrudRepository<User> {
  findOneById(id: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
}

export interface IProfilePermissionRepository extends IBaseCrudRepository<ProfilePermission> {
  updateManyOrCreateMany(permissions: ProfilePermission[]): Promise<void | null>;
}

export interface IUserPermissionRepository extends IBaseCrudRepository<UserPermission> {
  updateManyOrCreateMany(permissions: UserPermission[]): Promise<void | null>;
}

export interface IUserProfileRepository extends IBaseCrudRepository<UserProfile> {
  updateManyOrCreateMany(data: UserProfile[]): Promise<void | null>;
}
