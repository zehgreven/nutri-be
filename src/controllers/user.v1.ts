import { ClassMiddleware, Controller, Get, Middleware, Post, Put } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware, userIdValidationMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserService } from '@src/services/user.service';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('user/v1')
@ClassMiddleware(rateLimiter)
export class UserControllerV1 extends BaseController {
  constructor(private service: UserService) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 8);
      const newUser = await this.service.create(data);
      res.status(201).send(newUser);
    } catch (error) {
      logger.error(error);
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Put(':id')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const requestParamId = req.params?.id;
      await this.service.update(requestParamId, req.body);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('me')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getAuthenticatedUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.context?.userId;
      const user = await this.service.findOneById(userId);
      res.status(StatusCodes.OK).send({ ...user, password: undefined });
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  @Get(':id')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getById(req.params.id);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }

  @Get('')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      const result = await this.service.getAll(this.queryWithoutPagination(req), this.paginated(req));
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
  }
}
