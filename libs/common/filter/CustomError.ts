import { ApiProperty } from '@nestjs/swagger';

export default class CustomError {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  method: string;

  constructor(url: string, method: string) {
    this.timestamp = new Date().toISOString();
    this.url = url;
    this.method = method;
  }
}
