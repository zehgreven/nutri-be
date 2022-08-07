import { User } from '@src/models/user';
import { UserRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class UserMongoDBRepository
  extends DefaultMongoDBRepository<User>
  implements UserRepository
{
  constructor(private userModel = User) {
    super(userModel);
  }

  async findOneById(id: string) {
    return this.findOne({ id });
  }

  async findOneByEmail(email: string) {
    return await this.findOne({ email });
  }
}
