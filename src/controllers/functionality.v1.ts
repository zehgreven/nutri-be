import { ClassMiddleware, Controller, Delete, Get, Post, Put } from '@overnightjs/core';
import { authMiddleware, userIdValidationMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { FunctionalityService } from '@src/services/functionality.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('functionality/v1')
@ClassMiddleware([rateLimiter, authMiddleware, userIdValidationMiddleware])
export class FunctionalityControllerV1 extends BaseController {
  constructor(private service: FunctionalityService) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.create(req.body);
      res.status(201).send(result);
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

  @Get('')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getAll(this.queryWithoutPagination(req), this.paginated(req));
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
      const result = await this.service.getById(req?.params?.id);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
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

  @Get('profile/:profileId')
  public async findFunctionalitiesByProfile(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.findFunctionalitiesByProfile(
        req.params?.profileId,
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

  @Get('user/:userId')
  public async findFunctionalitiesByUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.findFunctionalitiesByUser(
        req.params?.userId,
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
}
