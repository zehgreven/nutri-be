import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { ProfileRepository } from '@src/repositories';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('profile/v1')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(rateLimiter)
export class ProfileControllerV1 extends BaseController {
  constructor(private profileRepository: ProfileRepository) {
    super();
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: 500,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      const result = await this.profileRepository.create(req.body);
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('')
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: 500,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      const result = await this.profileRepository.findAll(
        {},
        this.paginated(req),
      );
      res.status(200).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
