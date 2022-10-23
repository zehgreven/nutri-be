import ApiError from '@src/errors/api-error';
import logger from '@src/logger';
import AuthService from '@src/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const authMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction,
) => {
  const token = req.headers?.['x-access-token'];
  try {
    const claims = AuthService.decodeToken(token as string);
    req.context = { userId: claims.sub };
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status?.(401).send(
        ApiError.format({
          code: StatusCodes.UNAUTHORIZED,
          message: error.message,
        }),
      );
    }
  }
};

export const userIdValidationMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction,
) => {
  const userId = req.context?.userId;
  if (!userId) {
    const apiError = {
      code: StatusCodes.BAD_REQUEST,
      message: 'user id not provided',
    };

    logger.error(JSON.stringify(apiError));
    return res.status?.(apiError.code).send(ApiError.format(apiError));
  }
  return next();
};
