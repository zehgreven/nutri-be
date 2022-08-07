import { Functionality } from '@src/models/functionality';
import { FunctionalityRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class FunctionalityMongoDBRepository
  extends DefaultMongoDBRepository<Functionality>
  implements FunctionalityRepository
{
  constructor(private functionalityModel = Functionality) {
    super(functionalityModel);
  }
}
