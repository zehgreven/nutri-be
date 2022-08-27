import {
  Functionality,
  FunctionalityType,
  UserPermission,
  ProfilePermission,
  Profile,
  User,
  Prisma,
} from '@prisma/client';

export type NoId<T> = Omit<T, 'id'>;
export type WithId<T> = T & { id: string };

export interface Paging {
  page: number;
  limit: number;
}

export type Paginated<T> = {
  result: T[];
  page: number;
  previousPage: number | undefined;
  nextPage: number | undefined;
  totalPages: number;
  limit: number;
  count: number;
};

export interface IBaseRepository<T> {
  create(data: NoId<T>): Promise<T>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
  findAll(options: Partial<T>, paging: Paging): Promise<Paginated<T>>;
  findOne(options: Partial<T>): Promise<T | null>;
  deleteAll(): Promise<Prisma.BatchPayload>;
}

export type IFunctionalityTypeRepository = IBaseRepository<FunctionalityType>;

export type IFunctionalityRepository = IBaseRepository<Functionality>;

export type IProfileRepository = IBaseRepository<Profile>;

export interface IUserRepository extends IBaseRepository<User> {
  findOneById(id: string): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
}

export interface IProfilePermissionRepository
  extends IBaseRepository<ProfilePermission> {
  updateManyOrCreateMany(
    permissions: ProfilePermission[],
  ): Promise<void | null>;
}

export interface IUserPermissionRepository
  extends IBaseRepository<UserPermission> {
  updateManyOrCreateMany(permissions: UserPermission[]): Promise<void | null>;
}
