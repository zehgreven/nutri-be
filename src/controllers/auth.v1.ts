import { Controller, Post } from '@overnightjs/core';
import { UserRepository } from '@src/repositories/user.repository';
import AuthService from '@src/services/auth.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('auth/v1')
// @ClassMiddleware(rateLimiter)
export class AuthControllerV1 extends BaseController {
  constructor(private repository: UserRepository) {
    super();
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

    return res.status(StatusCodes.OK).send(token);
  }

  @Post('refresh')
  public async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.body['refresh-token'];
      const token = await AuthService.refreshToken(refreshToken);
      return res.status(StatusCodes.OK).send(token);
    } catch (error) {
      return this.sendErrorResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Sua sessão expirou',
      });
    }
  }
}
