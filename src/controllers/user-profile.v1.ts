import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserProfileRepository } from '@src/repositories/user-profile.repository';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('user-profile/v1')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(rateLimiter)
export class UserProfileControllerV1 extends BaseController {
  constructor(private repository: UserProfileRepository) {
    super();
  }

  @Post('batch')
  public async updateManyOrCreateMany(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      await this.repository.updateManyOrCreateMany(req.body);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
