import { RoleForbiddenFail } from '@app/common/response/swagger/common/error/RoleForbiddenError';
import { UnauthorizedError } from '@app/common/response/swagger/common/error/UnauthorizedError';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Common Response')
@Controller('only-for-swagger')
export class SwaggerResponseController {
  @ApiOperation({
    summary: '공통 Response 형식 (사용 X)',
  })
  @ApiForbiddenResponse({
    description: '유저에게 해당 API 권한이 없습니다.',
    type: RoleForbiddenFail,
  })
  @ApiUnauthorizedResponse({
    description: '인증 실패',
    type: UnauthorizedError,
  })
  @Get()
  commonResponse() {
    throw new InternalServerErrorException('Not For Use Purpose');
  }
}
