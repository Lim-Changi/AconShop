import { HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class InternalServerError {
  @ApiProperty({
    type: 'number',
    description: 'HTTP Error Code입니다.',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    title: '응답 메시지',
    example: '알 수 없는 서버 에러',
    description: '알 수 없는 서버 에러',
  })
  message: string;

  @ApiProperty({
    type: 'string',
    description: '응답 데이터',
    example: '',
  })
  data: string;
}
