import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware, userIdValidationMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { ProfilePermissionService } from '@src/services/profile-permission.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('profile-permission/v1')
@ClassMiddleware([rateLimiter, authMiddleware, userIdValidationMiddleware])
export class ProfilePermissionControllerV1 extends BaseController {
  constructor(private service: ProfilePermissionService) {
    super();
  }

  @Get('me')
  public async findAllByLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.findAllByUser(req.context.userId);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
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
