import { Profile } from '@src/models/profile';
import { ProfileRepository } from '.';
import { DefaultMongoDBRepository } from './default-mongodb-repository';

export class ProfileMongoDBRepository
  extends DefaultMongoDBRepository<Profile>
  implements ProfileRepository
{
  constructor(private profileModel = Profile) {
    super(profileModel);
  }
}
