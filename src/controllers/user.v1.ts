import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserRepository } from '@src/repositories';
import AuthService from '@src/services/auth.service';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('user/v1')
@ClassMiddleware(rateLimiter)
export class UserControllerV1 extends BaseController {
  constructor(private userRepository: UserRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newUser = await this.userRepository.create(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const { email, password } = req.body;

    const user = await this.userRepository.findOneByEmail(email);

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

    return res.status(200).send({ token });
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

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }
    return res.send({
      user: { ...JSON.parse(JSON.stringify(user)), password: undefined },
    });
  }
}
