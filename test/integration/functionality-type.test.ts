import AuthService from '@src/services/auth.service';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import { FunctionalityTypeMongoDBRepository } from '@src/repositories/functionality-type-mongdb-repository';
import { FunctionalityType } from '@src/models/functionality-type';

describe('Functionality Type functional tests', () => {
  const functionalityTypeRepository = new FunctionalityTypeMongoDBRepository();
  const userRepository = new UserMongoDBRepository();
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
  };
  let token: string;
  let functionalityType: FunctionalityType;

  beforeEach(async () => {
    await functionalityTypeRepository.deleteAll();
    await userRepository.deleteAll();
    const user = await userRepository.create(defaultUser);
    const defaultFunctionalityType = {
      name: 'Sidebar Item',
      description: 'Sidebar Item',
    };
    functionalityType = await functionalityTypeRepository.create(
      defaultFunctionalityType,
    );

    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new functionalityType', () => {
    it('Should successfully create a new functionalityType', async () => {
      const newFunctionalityType = {
        name: 'test',
        description: 'test',
      };

      const { status, body } = await global.testRequest
        .post('/functionality-type/v1')
        .set({ 'x-access-token': token })
        .send(newFunctionalityType);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newFunctionalityType));
    });

    it('Should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(FunctionalityType.prototype, 'save')
        .mockImplementationOnce(() =>
          Promise.reject('fail to create functionalityType'),
        );

      const newFunctionalityType = {};
      const { status, body } = await global.testRequest
        .post('/functionality-type/v1')
        .set({ 'x-access-token': token })
        .send(newFunctionalityType);

      expect(status).toBe(500);
      expect(body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
  describe('When searching for the functionalityType', () => {
    it('Should return a functionalityType when a functionalityType exists', async () => {
      const { status, body } = await global.testRequest
        .get('/functionality-type/v1')
        .set({ 'x-access-token': token })
        .send();

      expect(status).toBe(200);
      expect(body).toEqual([functionalityType]);
    });
  });
});
