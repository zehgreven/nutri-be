import { UserPermission } from '@src/generated/client';
import { UserPermissionRepository } from '@src/repositories/user-permission.repository';
import { BaseCrudService } from '.';

export class UserPermissionService extends BaseCrudService<UserPermissionRepository, UserPermission> {
  public async updateManyOrCreateMany(permissions: UserPermission[]): Promise<void | null> {
    return await this.repository.updateManyOrCreateMany(permissions);
  }

  public async findAllByUser(userId: string): Promise<Partial<UserPermission>[]> {
    return await this.repository.findAllByUser(userId);
  }
}
