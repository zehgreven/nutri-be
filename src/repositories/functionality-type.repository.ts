import { FunctionalityType } from '@src/generated/client';
import { prismaClient } from '@src/database';

import { IFunctionalityTypeRepository } from '.';
import { BaseRepository } from './repository';

export class FunctionalityTypeRepository
  extends BaseRepository<FunctionalityType>
  implements IFunctionalityTypeRepository
{
  constructor() {
    super(prismaClient.functionalityType);
  }
}
