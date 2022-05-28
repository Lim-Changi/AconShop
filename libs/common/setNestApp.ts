import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import CustomValidationError from '@app/common/filter/CustomValidationError';
import { HttpExceptionFilter } from '@app/common/filter/HttpExceptionFilter';

export function SetNestApp<T extends INestApplication>(app: T): void {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        value: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((e) => new CustomValidationError(e)),
        );
      },
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}
