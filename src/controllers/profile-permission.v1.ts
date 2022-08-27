import { ClassMiddleware, Controller, Get, Post, Put } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { ProfilePermissionRepository } from '@src/repositories/profile-permission.repository';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('profile-permission/v1')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(rateLimiter)
export class ProfilePermissionControllerV1 extends BaseController {
  constructor(private repository: ProfilePermissionRepository) {
    super();
  }

  @Get('me')
  public async findAllByLoggedUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      const result = await this.repository.findAllByUser(req.context.userId);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }
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
