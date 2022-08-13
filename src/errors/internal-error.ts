import { StatusCodes } from 'http-status-codes';

export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = StatusCodes.INTERNAL_SERVER_ERROR,
    protected description?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
