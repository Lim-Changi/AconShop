import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@app/entity/domain/user/User.entity';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtPayload } from '@app/common/guard/JwtPayload';
import { UserService } from 'src/User/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger?: Logger,
  ) {}

  async signup(signupUser: User): Promise<User> {
    try {
      return await this.userService.createUser(signupUser);
    } catch (e) {
      throw e;
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    const user: User = await this.userService.getUser(userId);
    if (!user) {
      throw new UnauthorizedException('요청을 처리할수 없습니다.');
    }
    return user;
  }
}
