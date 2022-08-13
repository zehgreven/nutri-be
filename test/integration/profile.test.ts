import { Profile } from '@src/models/profile';
import { FunctionalityMongoDBRepository } from '@src/repositories/functionality-mongdb-repository';
import { FunctionalityTypeMongoDBRepository } from '@src/repositories/functionality-type-mongdb-repository';
import { PermissionMongoDBRepository } from '@src/repositories/permission-mongdb-repository';
import { ProfileMongoDBRepository } from '@src/repositories/profile-mongdb-repository';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import AuthService from '@src/services/auth.service';
import { StatusCodes } from 'http-status-codes';

describe('Functionality functional tests', () => {
  const functionalityRepository = new FunctionalityMongoDBRepository();
  const functionalityTypeRepository = new FunctionalityTypeMongoDBRepository();
  const permissionRepository = new PermissionMongoDBRepository();
  const profileRepository = new ProfileMongoDBRepository();
  const userRepository = new UserMongoDBRepository();

  let token: string;
  let defaultProfile: Profile;

  beforeEach(async () => {
    await profileRepository.deleteAll();
    await permissionRepository.deleteAll();
    await functionalityRepository.deleteAll();
    await functionalityTypeRepository.deleteAll();
    await userRepository.deleteAll();

    const defaultUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
      permissions: [],
      profiles: [],
    };
    const user = await userRepository.create(defaultUser);

    const type = await functionalityTypeRepository.create({
      name: 'Sidebar button',
      description: 'Sidebar button',
    });

    const functionalityA = await functionalityRepository.create({
      name: 'Home',
      description: 'Home button from sidebar',
      path: '/',
      functionalityTypeId: type.id,
    });

    const functionalityB = await functionalityRepository.create({
      name: 'Invalid',
      description: 'Invalid button from sidebar',
      path: '/',
      functionalityTypeId: type.id,
    });

    const permissionA = await permissionRepository.create({
      allow: true,
      functionalityId: functionalityA.id,
    });

    const permissionB = await permissionRepository.create({
      allow: true,
      functionalityId: functionalityB.id,
    });

    defaultProfile = {
      name: 'Admin',
      description: 'This represents the administrators profile',
      permissions: [permissionA.id, permissionB.id],
    };

    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new profile', () => {
    it('Should successfully create a new profile', async () => {
      const { status, body } = await global.testRequest
        .post('/profile/v1')
        .set({ 'x-access-token': token })
        .send(defaultProfile);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(defaultProfile));
    });

    it('Should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Profile.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create profile'));

      const { status, body } = await global.testRequest
        .post('/profile/v1')
        .set({ 'x-access-token': token })
        .send(defaultProfile);

      expect(status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
  describe('When searching for the profile', () => {
    it('Should return a profile when a profile exists', async () => {
      const profile = await profileRepository.create(defaultProfile);

      const { status, body } = await global.testRequest
        .get('/profile/v1')
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual([profile]);
    });
  });
});
