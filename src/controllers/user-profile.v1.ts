import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware, userIdValidationMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { UserProfileService } from '@src/services/user-profile.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('user-profile/v1')
@ClassMiddleware([rateLimiter, authMiddleware, userIdValidationMiddleware])
export class UserProfileControllerV1 extends BaseController {
  constructor(private service: UserProfileService) {
    super();
  }

  @Post('batch')
  public async updateManyOrCreateMany(req: Request, res: Response): Promise<void> {
    try {
      await this.service.updateManyOrCreateMany(req.body);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
