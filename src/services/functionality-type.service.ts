import { FunctionalityType } from '@src/generated/client';
import { FunctionalityTypeRepository } from '@src/repositories/functionality-type.repository';
import { BaseCrudService } from '.';

export class FunctionalityTypeService extends BaseCrudService<FunctionalityType> {
  constructor(repository: FunctionalityTypeRepository) {
    super(repository);
  }
}
