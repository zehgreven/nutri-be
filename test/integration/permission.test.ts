import { Functionality } from '@src/models/functionality';
import { Permission } from '@src/models/permission';
import { FunctionalityMongoDBRepository } from '@src/repositories/functionality-mongdb-repository';
import { FunctionalityTypeMongoDBRepository } from '@src/repositories/functionality-type-mongdb-repository';
import { PermissionMongoDBRepository } from '@src/repositories/permission-mongdb-repository';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import AuthService from '@src/services/auth.service';

describe('Functionality functional tests', () => {
  const functionalityRepository = new FunctionalityMongoDBRepository();
  const functionalityTypeRepository = new FunctionalityTypeMongoDBRepository();
  const permissionRepository = new PermissionMongoDBRepository();
  const userRepository = new UserMongoDBRepository();

  let token: string;
  let defaultPermission: Permission;

  beforeEach(async () => {
    await permissionRepository.deleteAll();
    await functionalityRepository.deleteAll();
    await functionalityTypeRepository.deleteAll();
    await userRepository.deleteAll();

    const defaultUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };
    const user = await userRepository.create(defaultUser);

    const type = await functionalityTypeRepository.create({
      name: 'Sidebar button',
      description: 'Sidebar button',
    });

    const functionality = await functionalityRepository.create({
      name: 'Home',
      description: 'Home button from sidebar',
      path: '/',
      functionalityTypeId: type.id,
    });

    defaultPermission = {
      allow: true,
      functionalityId: functionality.id,
    };

    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new permission', () => {
    it('Should successfully create a new permission', async () => {
      const { status, body } = await global.testRequest
        .post('/permission/v1')
        .set({ 'x-access-token': token })
        .send(defaultPermission);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(defaultPermission));
    });

    it('Should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Permission.prototype, 'save')
        .mockImplementationOnce(() =>
          Promise.reject('fail to create permission'),
        );

      const { status, body } = await global.testRequest
        .post('/permission/v1')
        .set({ 'x-access-token': token })
        .send(defaultPermission);

      expect(status).toBe(500);
      expect(body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
  describe('When searching for the permission', () => {
    it('Should return a permission when a permission exists', async () => {
      const permission = await permissionRepository.create(defaultPermission);

      const { status, body } = await global.testRequest
        .get('/permission/v1')
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual([permission]);
    });
  });
});
