import { Person } from '@src/models/person';
import { PersonRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class PersonMongoDBRepository
  extends DefaultMongoDBRepository<Person>
  implements PersonRepository
{
  constructor(private personModel = Person) {
    super(personModel);
  }
}
