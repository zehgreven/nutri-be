import ApiError, { APIError } from '@src/errors/api-error';
import logger from '@src/logger';
import {
  DatabaseError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
} from '@src/repositories/repository';
import { Response } from 'express';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    error: unknown,
  ): Response {
    if (
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseUnknownClientError
    ) {
      const clientErrors = handleClientErrors(error);
      this.sendErrorResponse(res, clientErrors);
    } else {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
    return res;

    function handleClientErrors(error: DatabaseError): {
      code: number;
      message: string;
    } {
      if (error instanceof DatabaseValidationError) {
        return { code: 409, message: error.message };
      }

      return { code: 400, message: error.message };
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    logger.error(JSON.stringify(apiError));
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
