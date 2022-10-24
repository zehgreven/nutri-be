import { Profile } from '@src/generated/client';
import { ProfileRepository } from '@src/repositories/profile.repository';
import { Paginated, Paging } from '@src/util/page-utils';
import { BaseCrudService } from '.';

export class ProfileService extends BaseCrudService<ProfileRepository, Profile> {
  public async findProfilesByUser(
    userId: string,
    options: Partial<Profile>,
    paging: Paging,
  ): Promise<Paginated<Profile>> {
    return await this.repository.findProfilesByUser(userId, options, paging);
  }
}
