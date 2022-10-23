import {
  authMiddleware,
  userIdValidationMiddleware,
} from '@src/middlewares/auth';
import AuthService from '@src/services/auth.service';
import { StatusCodes } from 'http-status-codes';

describe('authMiddleware', () => {
  it('Should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken('fake-user-id').token;
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };
    const resFake = {};
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });
  it('Should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid-token',
      },
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'Unauthorized',
      message: 'jwt malformed',
    });
  });
  it('Should return UNAUTHORIZED if there is no token', () => {
    const reqFake = {
      headers: {},
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'Unauthorized',
      message: 'jwt must be provided',
    });
  });
});

describe('userIdValidationMiddleware', () => {
  it('Should verify a userId property and call the next middleware', () => {
    const jwtToken = AuthService.generateToken('fake-user-id').token;
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
      context: {
        userId: 'fake-user-id',
      },
    };
    const resFake = {};
    const nextFake = jest.fn();
    userIdValidationMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });
  it('Should return BAD REQUEST if there is a problem on the userId verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid-token',
      },
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    userIdValidationMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(sendMock).toHaveBeenCalledWith({
      code: StatusCodes.BAD_REQUEST,
      error: 'Bad Request',
      message: 'user id not provided',
    });
  });
});
