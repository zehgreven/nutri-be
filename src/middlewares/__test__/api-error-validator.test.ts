import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { apiErrorValidator, HTTPError } from '../api-error-validator';
import ApiError from '@src/errors/api-error';

describe('apiErrorValidator', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(), // This line
      send: jest.fn(), // also mocking for send function
    };
  });

  it('should include statusCode 500 when error doesnt have status', async () => {
    const error: HTTPError = {
      name: 'error name',
      message: 'error message',
    };

    const formattedError = ApiError.format({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    });

    apiErrorValidator(
      error,
      mockRequest,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.send).toHaveBeenCalledWith(formattedError);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should include same statusCode as the error status', async () => {
    const error: HTTPError = {
      name: 'error name',
      message: 'error message',
      status: StatusCodes.IM_A_TEAPOT,
    };

    const formattedError = ApiError.format({
      code: StatusCodes.IM_A_TEAPOT,
      message: error.message,
    });

    apiErrorValidator(
      error,
      mockRequest,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.IM_A_TEAPOT);
    expect(mockResponse.send).toHaveBeenCalledWith(formattedError);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
