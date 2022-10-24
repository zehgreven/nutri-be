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
import { FunctionalityTypeService } from '@src/services/functionality-type.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('functionality-type/v1')
@ClassMiddleware([rateLimiter, authMiddleware, userIdValidationMiddleware])
export class FunctionalityTypeControllerV1 extends BaseController {
  constructor(private service: FunctionalityTypeService) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Put(':id')
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const requestParamId = req.params?.id;
      await this.service.update(requestParamId, req.body);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const requestParamId = req.params?.id;
      await this.service.delete(requestParamId);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getAll(
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
      const requestParamId = req.params?.id;
      const result = await this.service.getById(requestParamId);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
