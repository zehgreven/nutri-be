import ApiError from '@src/errors/api-error';
import { NextFunction, Request, Response } from 'express';

export interface HTTPError extends Error {
  status?: number;
}

export function apiERrorValidator(
  error: HTTPError,
  _: Partial<Request>,
  res: Response,
  __: NextFunction,
): void {
  const errorCode = error.status || 500;
  res
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
}
