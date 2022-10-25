import { UserProfile } from '@src/generated/client';
import { UserProfileRepository } from '@src/repositories/user-profile.repository';
import { BaseCrudService } from '.';

export class UserProfileService extends BaseCrudService<UserProfileRepository, UserProfile> {
  public async updateManyOrCreateMany(data: UserProfile[]): Promise<void | null> {
    return await this.repository.updateManyOrCreateMany(data);
  }
}
