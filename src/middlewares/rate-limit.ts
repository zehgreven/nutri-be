import ApiError from '@src/errors/api-error';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import config from 'config';

export const rateLimiter = rateLimit({
  windowMs: config.get('rateLimit.windowMs'),
  max: config.get('rateLimit.maxRequestsNumber'),
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: 'Too many requests',
      }),
    );
  },
});
