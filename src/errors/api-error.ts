import httpStatusCodes from 'http-status-codes';

export interface APIError {
  code: number;
  message: string;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface APIErrorResponse extends Omit<APIError, 'codeAsString'> {
  error: string;
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code),
      },
      ...(error.description && { description: error.description }),
      ...(error.documentation && { documentation: error.documentation }),
    };
  }
}
