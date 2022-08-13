import ApiError from '@src/errors/api-error';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface HTTPError extends Error {
  status?: number;
}

export function apiERrorValidator(
  error: HTTPError,
  _: Partial<Request>,
  res: Response,
  __: NextFunction,
): void {
  const errorCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  res
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
}
