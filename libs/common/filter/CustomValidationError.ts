import { ApiProperty } from '@nestjs/swagger';
import { ValidationError } from '@nestjs/common';
import { Constraint } from '@app/common/filter/Constraint';

export default class CustomValidationError {
  @ApiProperty()
  property: string;

  @ApiProperty({
    type: 'string',
  })
  value: any;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  method: string;

  @ApiProperty({
    type: [Constraint],
  })
  constraints: Constraint[];

  constructor(
    validationError: ValidationError,
    url: string = null,
    method: string = null,
  ) {
    this.property = validationError.property;
    this.value =
      validationError.value === undefined ? '' : validationError.value;
    this.timestamp = new Date().toISOString();
    this.url = url;
    this.method = method;

    if (validationError.constraints) {
      this.constraints = Object.entries(validationError.constraints).map(
        (obj) => new Constraint(obj),
      );
    }
  }
}
