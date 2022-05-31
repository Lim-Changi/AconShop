import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSignupReq } from './dto';
import { AuthService } from './auth.service';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { SignupSuccess } from '@app/common/response/swagger/domain/auth/SignupSuccess';
import { SignupFail } from '@app/common/response/swagger/domain/auth/SignupFail';

@Controller('auth')
@ApiTags('회원가입, 로그인 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원 가입',
    description: `
    회원 가입할 때 accountId, password, role을 입력받습니다. \n
    회원 가입할 때 입력값을 누락한 경우 에러를 출력합니다. \n
    `,
  })
  @ApiCreatedResponse({
    description: '회원 가입에 성공했습니다.',
    type: SignupSuccess,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiInternalServerErrorResponse({
    description: '회원 가입에 실패했습니다',
    type: SignupFail,
  })
  @Post('/signup')
  async signup(@Body() dto: AuthSignupReq): Promise<ResponseEntity<string>> {
    try {
      await this.authService.signup(await dto.toEntity());
      return ResponseEntity.CREATED_WITH('회원 가입에 성공했습니다.');
    } catch (error) {
      throw ResponseEntity.ERROR_WITH('회원 가입에 실패했습니다. >> ' + error);
    }
  }
}
