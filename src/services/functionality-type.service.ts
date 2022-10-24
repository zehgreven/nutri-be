import { FunctionalityType } from '@src/generated/client';
import { FunctionalityRepository } from '@src/repositories/functionality.repository';
import { BaseCrudService } from '.';

export class FunctionalityTypeService extends BaseCrudService<FunctionalityRepository, FunctionalityType> {}
