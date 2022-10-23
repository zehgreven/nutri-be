import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core';
import logger from '@src/logger';
import {
  authMiddleware,
  userIdValidationMiddleware,
} from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserRepository } from '@src/repositories/user.repository';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('user/v1')
@ClassMiddleware(rateLimiter)
export class UserControllerV1 extends BaseController {
  constructor(private repository: UserRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      data.password = bcrypt.hashSync(data.password, 8);
      const newUser = await this.repository.create(data);
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
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

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

  @Get('me')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getAuthenticatedUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId = req.context?.userId;
    if (!userId) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'user id not provided',
      });
    }

    const user = await this.repository.findOneById(userId);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }

    return res.send({ ...user, password: undefined });
  }

  @Get(':id')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

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

  @Get('')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

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
}
