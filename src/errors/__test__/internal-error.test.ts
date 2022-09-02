import { InternalError } from '@src/errors/internal-error';
import { StatusCodes } from 'http-status-codes';

describe('InternalError', () => {
  it('should ', () => {
    const error = new InternalError('testing message');

    try {
      throw error;
    } catch (e) {
      expect(e).toBeInstanceOf(InternalError);
      expect(e).toHaveProperty('message', 'testing message');
      expect(e).toHaveProperty('code', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
});
