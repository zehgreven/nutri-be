import AuthService from '@src/services/auth.service';
import { UserMongoDBRepository } from '@src/repositories/user-mongodb-repository';
import { PersonMongoDBRepository } from '@src/repositories/person-mongdb-repository';
import { Person } from '@src/models/person';

describe('Person functional tests', () => {
  const personRepository = new PersonMongoDBRepository();
  const userRepository = new UserMongoDBRepository();
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
    permissions: [],
    profiles: [],
  };
  let token: string;
  let person: Person;

  beforeEach(async () => {
    await userRepository.deleteAll();
    await personRepository.deleteAll();

    const user = await userRepository.create(defaultUser);

    const defaultPerson = {
      name: 'Person Name',
      email: 'person@email.com',
      birthDate: new Date(1998, 8, 19, 0, 0, 0, 0),
      gender: 'male',
    };
    person = await personRepository.create(defaultPerson);

    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new person', () => {
    it('Should successfully create a new person', async () => {
      const newPerson = {
        name: 'Other Person',
        email: 'otherperson@email.com',
        birthDate: '1998-09-19T03:00:00.000Z',
        gender: 'male',
      };

      const { status, body } = await global.testRequest
        .post('/person/v1')
        .set({ 'x-access-token': token })
        .send(newPerson);

      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newPerson));
    });

    it('Should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Person.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create person'));

      const newPerson = {};
      const { status, body } = await global.testRequest
        .post('/person/v1')
        .set({ 'x-access-token': token })
        .send(newPerson);

      expect(status).toBe(500);
      expect(body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
  describe('When searching for the person', () => {
    it('Should return a person when a person exists', async () => {
      const { status, body } = await global.testRequest
        .get('/person/v1')
        .set({ 'x-access-token': token })
        .send();

      const compare = {
        ...person,
        birthDate: '1998-09-19T03:00:00.000Z',
      };

      expect(status).toBe(200);
      expect(body).toEqual([compare]);
    });
  });
});
