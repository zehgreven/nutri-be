import ApiError, { APIError } from '@src/errors/api-error';
import logger from '@src/logger';
import { Paging } from '@src/repositories';
import {
  DatabaseError,
  DatabaseInternalError,
  DatabaseUnknownClientError,
  DatabaseValidationError,
} from '@src/repositories/repository';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): Response {
    if (
      error instanceof DatabaseInternalError ||
      error instanceof DatabaseValidationError ||
      error instanceof DatabaseUnknownClientError
    ) {
      const clientErrors = handleClientErrors(error);
      this.sendErrorResponse(res, clientErrors);
    } else {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
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

  protected queryWithoutPagination(req: Request) {
    const query = { ...req.query };
    delete query.limit;
    delete query.page;
    return query;
  }

  protected paginated(req: Request): Paging {
    const { page, limit } = req.query;

    const _page = Math.max(0, Number(page) - 1);
    const _limit = Math.max(1, limit ? Number(limit) : 100);

    return {
      page: _page,
      limit: _limit,
    };
  }
}
