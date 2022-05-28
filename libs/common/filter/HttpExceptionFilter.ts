import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';
import CustomValidationError from '@app/common/filter/CustomValidationError';
import CustomError from '@app/common/filter/CustomError';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message === ''
        ? 'Internal Server Error'
        : exception.message;

    const customErrorCode = Object.keys(exceptionResponse).includes('code')
      ? exceptionResponse['code']
      : httpStatus;

    const { url, method } = request;

    const isValidationError = exceptionResponse instanceof ValidationError;

    const commonErrorObject = {
      error:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] === undefined
          ? exceptionResponse['error']
          : exceptionResponse['message'],

      code: customErrorCode,

      data: isValidationError
        ? [this.toCustomValidationErrorByNest(exceptionResponse, url, method)]
        : this.toCustomErrorByNest(url, method),
    };
    console.log(exception);
    return response.status(httpStatus).json(commonErrorObject);
  }

  toCustomValidationErrorByNest(
    responseBody: ValidationError,
    url: string,
    method: string,
  ): CustomValidationError {
    return new CustomValidationError(responseBody, url, method);
  }

  toCustomErrorByNest(url: string, method: string): CustomError {
    return new CustomError(url, method);
  }
}
