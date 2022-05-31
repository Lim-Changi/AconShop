import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
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
    const isValidationError =
      exceptionResponse['message'][0] instanceof CustomValidationError;

    const commonErrorObject = {
      statusCode: customErrorCode,
      message: isValidationError
        ? '요청 값에 문제가 있습니다.'
        : exceptionResponse['error'],

      data: isValidationError
        ? this.toCustomValidationErrorByNest(
            exceptionResponse['message'][0],
            url,
            method,
          )
        : this.toCustomErrorByNest(url, method),
    };

    return response.status(httpStatus).json(commonErrorObject);
  }

  toCustomValidationErrorByNest(
    responseBody: CustomValidationError,
    url: string,
    method: string,
  ): CustomValidationError {
    responseBody.setUrl(url);
    responseBody.setMethod(method);
    return responseBody;
  }

  toCustomErrorByNest(url: string, method: string): CustomError {
    return new CustomError(url, method);
  }
}
