import { Functionality } from '@src/generated/client';
import { FunctionalityRepository } from '@src/repositories/functionality.repository';
import { Paging } from '@src/util/page-utils';
import { BaseCrudService } from '.';

export class FunctionalityService extends BaseCrudService<FunctionalityRepository, Functionality> {
  public async findFunctionalitiesByProfile(
    profileId: string,
    options: Partial<Functionality>,
    paging: Paging,
  ): Promise<void> {
    return await this.repository.findFunctionalitiesByProfile(profileId, options, paging);
  }

  public async findFunctionalitiesByUser(
    userId: string,
    options: Partial<Functionality>,
    paging: Paging,
  ): Promise<void> {
    return await this.repository.findFunctionalitiesByUser(userId, options, paging);
  }
}
