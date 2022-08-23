import { Functionality } from '@prisma/client';

import { prismaClient } from '@src/database';

import { IFunctionalityRepository, Paginated, Paging } from '.';
import { BaseRepository } from './repository';

export class FunctionalityRepository
  extends BaseRepository<Functionality>
  implements IFunctionalityRepository
{
  constructor() {
    super(prismaClient.functionality);
  }

  protected getCustomFindAllProps(): any {
    return {
      include: {
        functionalityType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    };
  }
}
