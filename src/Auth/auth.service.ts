import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@app/entity/domain/user/User.entity';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtPayload } from '@app/common/guard/JwtPayload';
import { UserService } from 'src/User/user.service';
import { compare } from 'bcrypt';
import { UserAccessToken } from '@app/entity/domain/User/UserAccessToken';

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
      if (e.errno === 1062) throw new ForbiddenException('중복된 계정입니다.');
      throw e;
    }
  }

  async login(loginUser: User): Promise<UserAccessToken> {
    try {
      const accountData = await this.userService.getLoginData(
        loginUser.account,
      );
      if (!accountData) {
        throw new ForbiddenException('Login Fail');
      }
      if (
        (await this.comparePassword(
          loginUser.password,
          accountData.password,
        )) === false
      ) {
        this.logger.error(
          `유저 [${accountData.account}] 의 비밀번호가 올바르지 않습니다`,
        );
        throw new ForbiddenException('Login Fail');
      }
      await this.userService.setLoggedAt(loginUser.id, loginUser.loggedAt);
      const payload: JwtPayload = {
        userId: accountData.id,
      };

      return { accessToken: this.jwtService.sign(payload) };
    } catch (e) {
      throw e;
    }
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
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
