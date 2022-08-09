import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { rateLimiter } from '@src/middlewares/rate-limit';
import { ExistingUser } from '@src/models/user';
import { UserRepository } from '@src/repositories';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('client/v1')
@ClassMiddleware(rateLimiter)
export class ClientControllerV1 extends BaseController<ExistingUser> {
  constructor(private userRepository: UserRepository) {
    super();
  }

  @Get('')
  // @Middleware(authMiddleware)
  public async getAuthenticatedUser(
    req: Request,
    res: Response,
  ): Promise<Response> {
    // const userId = req.context?.userId;
    // if (!userId) {
    //   return this.sendErrorResponse(res, {
    //     code: 404,
    //     message: 'user id not provided',
    //   });
    // }

    const user = await this.userRepository.findAll(
      req.query,
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
