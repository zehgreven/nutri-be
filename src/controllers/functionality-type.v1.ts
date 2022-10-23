import {
  ClassMiddleware,
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from '@overnightjs/core';
import logger from '@src/logger';
import {
  authMiddleware,
  userIdValidationMiddleware,
} from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { FunctionalityTypeRepository } from '@src/repositories/functionality-type.repository';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('functionality-type/v1')
@ClassMiddleware([rateLimiter, authMiddleware, userIdValidationMiddleware])
export class FunctionalityTypeControllerV1 extends BaseController {
  constructor(private repository: FunctionalityTypeRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.repository.create(req.body);
      res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Put(':id')
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const requestParamId = req.params?.id;

      if (!requestParamId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing parameter id');
        return;
      }

      await this.repository.update(requestParamId, req.body);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const requestParamId = req.params?.id;

      if (!requestParamId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing parameter id');
        return;
      }

      await this.repository.delete(requestParamId);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.repository.findAll(
        this.queryWithoutPagination(req),
        this.paginated(req),
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  @Get(':id')
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params?.id) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing parameter id');
        return;
      }
      const result = await this.repository.findOne({
        id: req.params.id,
      });
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
