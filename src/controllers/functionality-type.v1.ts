import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { FunctionalityTypeRepository } from '@src/repositories';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('functionality-type/v1')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(rateLimiter)
export class FunctionalityTypeControllerV1 extends BaseController {
  constructor(
    private functionalityTypeRepository: FunctionalityTypeRepository,
  ) {
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

      const result = await this.functionalityTypeRepository.create(req.body);
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.context?.userId) {
        this.sendErrorResponse(res, {
          code: 500,
          message: 'Something went wrong',
        });
        logger.error('Missing userId');
        return;
      }

      const result = await this.functionalityTypeRepository.findAll({});
      res.status(200).send(result);
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
