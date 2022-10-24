import { ProfilePermission } from '@src/generated/client';
import { ProfilePermissionRepository } from '@src/repositories/profile-permission.repository';
import { BaseCrudService } from '.';

export class ProfilePermissionService extends BaseCrudService<ProfilePermissionRepository, ProfilePermission> {
  async updateManyOrCreateMany(permissions: ProfilePermission[]): Promise<void | null> {
    return await this.repository.updateManyOrCreateMany(permissions);
  }

  async findAllByUser(userId: string): Promise<Partial<ProfilePermission>[]> {
    return await this.repository.findAllByUser(userId);
  }
}
