import { FunctionalityType } from '@src/models/functionality-type';
import { FunctionalityTypeRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class FunctionalityTypeMongoDBRepository
  extends DefaultMongoDBRepository<FunctionalityType>
  implements FunctionalityTypeRepository
{
  constructor(private functionalityTypeModel = FunctionalityType) {
    super(functionalityTypeModel);
  }
}
