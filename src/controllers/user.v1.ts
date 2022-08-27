import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
  Put,
} from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserRepository } from '@src/repositories/user.repository';
import AuthService from '@src/services/auth.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';
import bcrypt from 'bcrypt';

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

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const { username, password } = req.body;
    if (!username || !password) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }

    const user = await this.repository.findOneByUsername(username);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }

    const token = AuthService.generateToken(user.id);

    return res.status(StatusCodes.OK).send({ token });
  }

  @Put(':id')
  @Middleware(authMiddleware)
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
  @Middleware(authMiddleware)
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

    const permissions = await this.repository.findAllPermissionsFromLoggedUser(
      userId,
    );

    return res.send({
      user: { ...JSON.parse(JSON.stringify(user)), password: undefined },
      permissions,
    });
  }

  @Get(':id')
  @Middleware(authMiddleware)
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
  @Middleware(authMiddleware)
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
