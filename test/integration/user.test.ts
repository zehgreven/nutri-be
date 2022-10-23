import { UserRepository } from '@src/repositories/user.repository';
import AuthService from '@src/services/auth.service';
import { getReasonPhrase } from 'http-status-codes';

describe('Users integration tests', () => {
  const userRepository = new UserRepository();

  beforeEach(async () => {
    await userRepository.deleteAll();
  });

  describe('When creating a new user', () => {
    it('Should successfully create a new user with encrypted password', async () => {
      const newUser = {
        username: 'john@mail.com',
        password: '1234',
        active: true,
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

    // it('Should return 400 when there is a validation error', async () => {
    //   const newUser = {
    //     username: 'john@mail.com',
    //     password: '1234',
    //   };

    //   const { status, body } = await global.testRequest
    //     .post('/user/v1')
    //     .send(newUser);

    //   expect(status).toBe(400);
    //   expect(body).toEqual({
    //     code: 400,
    //     error: getReasonPhrase(400),
    //     message: 'User validation failed: name: Path `name` is required.',
    //   });
    // });

    // it('Should return 409 when the username already exists', async () => {
    //   const newUser = {
    //     username: 'john@mail.com',
    //     password: '1234',
    //   };
    //   // 1st time
    //   await global.testRequest.post('/user/v1').send(newUser);

    //   // 2nd time
    //   const { status, body } = await global.testRequest
    //     .post('/user/v1')
    //     .send(newUser);

    //   expect(status).toBe(409);
    //   expect(body).toEqual({
    //     code: 409,
    //     error: getReasonPhrase(409),
    //     message:
    //       'User validation failed: email: already exists in the database.',
    //   });
    // });
  });

  // describe('When authenticating a user', () => {
  //   it('Should generate a valid token for a valid user', async () => {
  //     const newUser = {
  //       username: 'john@mail.com',
  //       password: '1234',
  //       active: true,
  //     };

  //     const user = await userRepository.create(newUser);

  //     const { status, body } = await global.testRequest
  //       .post('/user/v1/authenticate')
  //       .send({
  //         email: newUser.email,
  //         password: newUser.password,
  //         profiles: [],
  //       });

  //     expect(status).toBe(StatusCodes.OK);
  //     expect(body).toEqual(
  //       expect.objectContaining({ token: expect.any(String) }),
  //     );

  //     const decodedToken = jwt.decode(body.token, { json: true });
  //     expect(decodedToken?.sub).toBe(user.id);
  //   });

  //   it('Should return UNAUTHORIZED if the user with given email is not found', async () => {
  //     const { status, body } = await global.testRequest
  //       .post('/user/v1/authenticate')
  //       .send({ email: 'invalid@email.com' });
  //     expect(status).toBe(401);
  //     expect(body).toEqual({
  //       code: 401,
  //       error: getReasonPhrase(401),
  //       message: 'User not found!',
  //       description: 'Try verifying your email address.',
  //     });
  //   });

  //   it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
  //     const newUser = {
  //       name: 'John Doe',
  //       email: 'john@mail.com',
  //       password: '1234',
  //       profiles: [],
  //       permissions: [],
  //     };

  //     await userRepository.create(newUser);

  //     const { status, body } = await global.testRequest
  //       .post('/user/v1/authenticate')
  //       .send({
  //         email: newUser.email,
  //         password: 'wrong-password',
  //       });
  //     expect(status).toBe(401);
  //     expect(body).toEqual({
  //       code: 401,
  //       error: getReasonPhrase(401),
  //       message: 'Password does not match!',
  //     });
  //   });
  // });

  // describe('When getting user profile info', () => {
  //   // eslint-disable-next-line quotes
  //   it("Should return the token's owner profile information", async () => {
  //     const newUser = {
  //       name: 'John Doe',
  //       email: 'john@mail.com',
  //       password: '1234',
  //       profiles: [],
  //       permissions: [],
  //     };

  //     const user = await userRepository.create(newUser);
  //     const token = AuthService.generateToken(user.id);
  //     const { body, status } = await global.testRequest
  //       .get('/user/v1/me')
  //       .set({ 'x-access-token': token });

  //     expect(status).toBe(StatusCodes.OK);
  //     expect(body).toMatchObject(
  //       JSON.parse(
  //         JSON.stringify({
  //           user: { ...JSON.parse(JSON.stringify(user)), password: undefined },
  //         }),
  //       ),
  //     );
  //   });

  //   it('Should return not found when the user is not found', async () => {
  //     const token = AuthService.generateToken('fake-user-id');
  //     const { body, status } = await global.testRequest
  //       .get('/user/v1/me')
  //       .set({ 'x-access-token': token });

  //     expect(status).toBe(404);
  //     expect(body.message).toBe('User not found!');
  //   });
  // });
});
