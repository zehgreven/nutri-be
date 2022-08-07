import AuthService from '@src/services/auth.service';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import { FunctionalityMongoDBRepository } from '@src/repositories/functionality-mongdb-repository';
import { Functionality } from '@src/models/functionality';
import { FunctionalityTypeMongoDBRepository } from '@src/repositories/functionality-type-mongdb-repository';
import { FunctionalityType } from '@src/models/functionality-type';

describe('Functionality functional tests', () => {
  const functionalityRepository = new FunctionalityMongoDBRepository();
  const functionalityTypeRepository = new FunctionalityTypeMongoDBRepository();
  const userRepository = new UserMongoDBRepository();
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
  };
  const defaultFunctionalityType = {
    name: 'Sidebar button',
    description: 'Sidebar button',
  };
  let token: string;
  let defaultFunctionality: Functionality;

  beforeEach(async () => {
    await functionalityRepository.deleteAll();
    await userRepository.deleteAll();
    const user = await userRepository.create(defaultUser);
    const type = await functionalityTypeRepository.create(
      defaultFunctionalityType,
    );
    defaultFunctionality = {
      name: 'Home',
      description: 'Home button from sidebar',
      path: '/',
      functionalityTypeId: type.id,
    };

    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new functionality', () => {
    it('Should successfully create a new functionality', async () => {
      const { status, body } = await global.testRequest
        .post('/functionality/v1')
        .set({ 'x-access-token': token })
        .send(defaultFunctionality);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(defaultFunctionality));
    });

    it('Should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Functionality.prototype, 'save')
        .mockImplementationOnce(() =>
          Promise.reject('fail to create functionality'),
        );

      const newFunctionality = {};
      const { status, body } = await global.testRequest
        .post('/functionality/v1')
        .set({ 'x-access-token': token })
        .send(newFunctionality);

      expect(status).toBe(500);
      expect(body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
  describe('When searching for the functionality', () => {
    it('Should return a functionalitywhen a functionalityexists', async () => {
      const functionality = await functionalityRepository.create(
        defaultFunctionality,
      );

      const { status, body } = await global.testRequest
        .get('/functionality/v1')
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual([functionality]);
    });
  });
});
