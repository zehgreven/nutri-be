import AuthService from '@src/services/auth.service';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction,
): void {
  const token = req.headers?.['x-access-token'];
  try {
    const claims = AuthService.decodeToken(token as string);
    req.context = { userId: claims.sub };
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status?.(401).send({
        code: 401,
        error: error.message,
      });
    }
  }
}
