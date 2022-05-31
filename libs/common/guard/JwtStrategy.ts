import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './JwtPayload';
import { ConfigService } from '@app/entity/config/configService';
import { AuthService } from '../../../src/Auth/auth.service';
import { UserPayload } from '@app/entity/domain/user/UserPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: ConfigService.jwtSecretKey(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return await this.authService.validateUser(payload);
  }
}
