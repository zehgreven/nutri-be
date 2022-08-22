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

export type IUserPermissionRepository = IBaseRepository<UserPermission>;

export type IProfilePermissionRepository = IBaseRepository<ProfilePermission>;

export type IProfileRepository = IBaseRepository<Profile>;

export interface IUserRepository extends IBaseRepository<User> {
  findOneById(id: string): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
}
