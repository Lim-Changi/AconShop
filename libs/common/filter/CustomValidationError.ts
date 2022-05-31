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

  @ApiProperty({
    type: [Constraint],
  })
  constraints: Constraint[];

  @ApiProperty()
  url: string;

  @ApiProperty()
  method: string;

  constructor(validationError: ValidationError) {
    this.property = validationError.property;
    this.value =
      validationError.value === undefined ? '' : validationError.value;
    this.timestamp = new Date().toISOString();

    if (validationError.constraints) {
      this.constraints = Object.entries(validationError.constraints).map(
        (obj) => new Constraint(obj),
      );
    }
  }

  setUrl(url: string): void {
    this.url = url;
  }
  setMethod(method: string): void {
    this.method = method;
  }
}
