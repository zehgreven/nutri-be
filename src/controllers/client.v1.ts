import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import {
  authMiddleware,
  userIdValidationMiddleware,
} from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { ProfileRepository } from '@src/repositories/profile.repository';
import { UserRepository } from '@src/repositories/user.repository';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('client/v1')
@ClassMiddleware(rateLimiter)
export class ClientControllerV1 extends BaseController {
  constructor(
    private userRepository: UserRepository,
    private profileRepository: ProfileRepository,
  ) {
    super();
  }

  @Get('')
  @Middleware([authMiddleware, userIdValidationMiddleware])
  public async getAuthenticatedUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const profile = await this.profileRepository.findOne({ name: 'Cliente' });
    if (!profile) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'Client profile not found!',
      });
    }

    const user = await this.userRepository.findAll(
      this.queryWithoutPagination(req),
      this.paginated(req),
    );

    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'Client not found!',
      });
    }
    return res.send(user);
  }
}
