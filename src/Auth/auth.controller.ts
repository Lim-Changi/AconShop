import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthSignupReq, AuthLoginReq } from './dto';
import { AuthService } from './auth.service';
import { ResponseEntity } from '@app/common/response/ResponseEntity';
import { BadRequestError } from '@app/common/response/swagger/common/error/BadRequestError';
import { SignupSuccess } from '@app/common/response/swagger/domain/auth/SignupSuccess';
import { SignupFail } from '@app/common/response/swagger/domain/auth/SignupFail';
import { UserAccessToken } from '@app/entity/domain/user/dao/UserAccessToken';
import { LoginSuccess } from '@app/common/response/swagger/domain/auth/LoginSuccess';
import { LoginForbiddenFail } from '@app/common/response/swagger/domain/auth/LoginForbiddenFail';
import { LoginFail } from '@app/common/response/swagger/domain/auth/LoginFail';
import { SignupForbiddenFail } from '@app/common/response/swagger/domain/auth/SignupForbiddenFail';

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
  @ApiForbiddenResponse({
    description: '중복된 계정 실패',
    type: SignupForbiddenFail,
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
    } catch (e) {
      if (e.status === HttpStatus.FORBIDDEN)
        throw ResponseEntity.FORBIDDEN_WITH(e.message);

      throw ResponseEntity.ERROR_WITH('회원 가입에 실패했습니다. >> ' + e);
    }
  }

  @ApiOperation({
    summary: '로그인',
    description: `
    로그인할 때 AccountId, Password 를 입력받습니다. \n
    로그인할 때 입력값을 누락한 경우 400 에러를 출력합니다. \n
    로그인할 때 아이디 혹은 비밀번호가 올바르지 않을 시, 403 에러를 출력합니다. \n
    `,
  })
  @ApiOkResponse({
    description: '로그인에 성공했습니다.',
    type: LoginSuccess,
  })
  @ApiBadRequestResponse({
    description: '입력값을 누락',
    type: BadRequestError,
  })
  @ApiForbiddenResponse({
    description: '아이디 및 비밀번호 오류입니다.',
    type: LoginForbiddenFail,
  })
  @ApiInternalServerErrorResponse({
    description: '로그인에 실패했습니다.',
    type: LoginFail,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() dto: AuthLoginReq,
  ): Promise<ResponseEntity<UserAccessToken | string>> {
    try {
      const userAccessToken = await this.authService.login(dto.toEntity());
      return ResponseEntity.OK_WITH_DATA<UserAccessToken>(
        '로그인에 성공했습니다.',
        userAccessToken,
      );
    } catch (e) {
      if (e.status === HttpStatus.FORBIDDEN)
        throw ResponseEntity.FORBIDDEN_WITH(e.message);

      throw ResponseEntity.ERROR_WITH('로그인에 실패했습니다. >> ' + e);
    }
  }
}
