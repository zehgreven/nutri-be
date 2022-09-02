import ApiErrorTransformer from '@src/errors/api-error';

describe('ApiError', () => {
  const defaultErrorMessage = 'Error message';
  const defaultErrorDescription =
    'This error happens when there is no bla bla bla';
  const defaultErrorDocumentation = 'https://mydocs.com/error-404';
  it('Should format error with mandatory fields', () => {
    const error = ApiErrorTransformer.format({
      code: 404,
      message: defaultErrorMessage,
    });
    expect(error).toEqual({
      message: defaultErrorMessage,
      error: 'Not Found',
      code: 404,
    });
  });

  it('Should format error with mandatory fields and description', () => {
    const error = ApiErrorTransformer.format({
      code: 404,
      message: defaultErrorMessage,
      description: defaultErrorDescription,
    });
    expect(error).toEqual({
      message: defaultErrorMessage,
      error: 'Not Found',
      code: 404,
      description: defaultErrorDescription,
    });
  });

  it('Should format error with mandatory fields and documentation', () => {
    const error = ApiErrorTransformer.format({
      code: 404,
      message: defaultErrorMessage,
      documentation: defaultErrorDocumentation,
    });
    expect(error).toEqual({
      message: defaultErrorMessage,
      error: 'Not Found',
      code: 404,
      documentation: defaultErrorDocumentation,
    });
  });

  it('Should format error with mandatory fields and codeAsString', () => {
    const error = ApiErrorTransformer.format({
      code: 404,
      message: defaultErrorMessage,
      documentation: defaultErrorDocumentation,
      codeAsString: 'Not Found',
    });
    expect(error).toEqual({
      message: defaultErrorMessage,
      error: 'Not Found',
      code: 404,
      documentation: defaultErrorDocumentation,
    });
  });
});
