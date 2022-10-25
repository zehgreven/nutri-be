import { User } from '@src/generated/client';
import { UserRepository } from '@src/repositories/user.repository';
import { BaseCrudService } from '.';

export class UserService extends BaseCrudService<UserRepository, User> {
  public async findOneById(id: string | undefined): Promise<User | null> {
    if (!id) {
      throw new Error('user id not provided');
    }

    const user = await this.repository.findOneById(id);

    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  }

  public async findOneByUsername(username: string): Promise<User | null> {
    return await this.repository.findOneByUsername(username);
  }
}
