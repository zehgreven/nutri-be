import AuthService from '@src/services/auth.service';
import httpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import { FunctionalityMongoDBRepository } from '@src/repositories/functionality-mongdb-repository';
import { FunctionalityTypeMongoDBRepository } from '@src/repositories/functionality-type-mongdb-repository';
import { PermissionMongoDBRepository } from '@src/repositories/permission-mongdb-repository';
import { ProfileMongoDBRepository } from '@src/repositories/profile-mongdb-repository';
import { ExistingProfile } from '@src/models/profile';
import { ExistingPermission } from '@src/models/permission';

describe('Users functional tests', () => {
  const functionalityRepository = new FunctionalityMongoDBRepository();
  const functionalityTypeRepository = new FunctionalityTypeMongoDBRepository();
  const permissionRepository = new PermissionMongoDBRepository();
  const profileRepository = new ProfileMongoDBRepository();
  const userRepository = new UserMongoDBRepository();

  let defaultProfile: ExistingProfile;
  let permissionBFalse: ExistingPermission;

  beforeEach(async () => {
    await profileRepository.deleteAll();
    await permissionRepository.deleteAll();
    await functionalityRepository.deleteAll();
    await functionalityTypeRepository.deleteAll();
    await userRepository.deleteAll();

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

    const permissionBTrue = await permissionRepository.create({
      allow: true,
      functionalityId: functionalityB.id,
    });

    permissionBFalse = await permissionRepository.create({
      allow: false,
      functionalityId: functionalityB.id,
    });

    defaultProfile = await profileRepository.create({
      name: 'Admin',
      description: 'This represents the administrators profile',
      permissions: [permissionA.id, permissionBTrue.id],
    });
  });

  describe('When creating a new user', () => {
    it('Should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
        profiles: [defaultProfile.id],
        permissions: [permissionBFalse.id],
      };

      const { status, body } = await global.testRequest
        .post('/user/v1')
        .send(newUser);

      expect(status).toBe(201);
      await expect(
        AuthService.comparePasswords(newUser.password, body.password),
      ).resolves.toBeTruthy();
      expect(body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        }),
      );
    });

    it('Should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };

      const { status, body } = await global.testRequest
        .post('/user/v1')
        .send(newUser);

      expect(status).toBe(400);
      expect(body).toEqual({
        code: 400,
        error: httpStatusCodes.getStatusText(400),
        message: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
        profiles: [],
        permissions: [],
      };
      // 1st time
      await global.testRequest.post('/user/v1').send(newUser);

      // 2nd time
      const { status, body } = await global.testRequest
        .post('/user/v1')
        .send(newUser);

      expect(status).toBe(409);
      expect(body).toEqual({
        code: 409,
        error: httpStatusCodes.getStatusText(409),
        message:
          'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('When authenticating a user', () => {
    it('Should generate a valid token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
        profiles: [],
        permissions: [],
      };

      const user = await userRepository.create(newUser);

      const { status, body } = await global.testRequest
        .post('/user/v1/authenticate')
        .send({
          email: newUser.email,
          password: newUser.password,
          profiles: [],
        });

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({ token: expect.any(String) }),
      );

      const decodedToken = jwt.decode(body.token, { json: true });
      expect(decodedToken?.sub).toBe(user.id);
    });

    it('Should return UNAUTHORIZED if the user with given email is not found', async () => {
      const { status, body } = await global.testRequest
        .post('/user/v1/authenticate')
        .send({ email: 'invalid@email.com' });
      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: httpStatusCodes.getStatusText(401),
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    });

    it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
        profiles: [],
        permissions: [],
      };

      await userRepository.create(newUser);

      const { status, body } = await global.testRequest
        .post('/user/v1/authenticate')
        .send({
          email: newUser.email,
          password: 'wrong-password',
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        code: 401,
        error: httpStatusCodes.getStatusText(401),
        message: 'Password does not match!',
      });
    });
  });

  describe('When getting user profile info', () => {
    // eslint-disable-next-line quotes
    it("Should return the token's owner profile information", async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
        profiles: [],
        permissions: [],
      };

      const user = await userRepository.create(newUser);
      const token = AuthService.generateToken(user.id);
      const { body, status } = await global.testRequest
        .get('/user/v1/me')
        .set({ 'x-access-token': token });

      expect(status).toBe(200);
      expect(body).toMatchObject(
        JSON.parse(
          JSON.stringify({
            user: { ...JSON.parse(JSON.stringify(user)), password: undefined },
          }),
        ),
      );
    });

    it('Should return not found when the user is not found', async () => {
      const token = AuthService.generateToken('fake-user-id');
      const { body, status } = await global.testRequest
        .get('/user/v1/me')
        .set({ 'x-access-token': token });

      expect(status).toBe(404);
      expect(body.message).toBe('User not found!');
    });
  });
});
