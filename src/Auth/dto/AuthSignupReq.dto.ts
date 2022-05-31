import { ApiProperty } from '@nestjs/swagger';
import { User } from '@app/entity/domain/user/User.entity';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserRole } from '@app/entity/domain/user/UserRole';

export class AuthSignupReq {
  @ApiProperty({
    example: 'test',
    description: '회원 가입시 입력 받는 아이디입니다.',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'Test123!',
    description:
      '회원 가입시 입력 받는 비밀번호입니다. 하나 이상의 소문자, 대문자, 숫자 및 특수 문자를 포함하는 8~20자 비밀번호를 입력하세요',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/,
    {
      message:
        '하나 이상의 소문자, 대문자, 숫자 및 특수 문자를 포함하는 8~20자 비밀번호를 입력하세요',
    },
  )
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.AUTHOR,
    description:
      '회원 가입시 입력 받는 유저 타입입니다. Customer = 1, Author = 2, Editor = 3',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  role: UserRole;

  toEntity(): Promise<User> {
    return User.signup(this.userId, this.password, this.role);
  }
}
