import { getWinstonLogger } from '@app/common/getWinstonLogger';
import { UserModule } from '@app/entity/domain/user/User.module';
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    UserModule,
    WinstonModule.forRoot(getWinstonLogger(process.env.NODE_ENV, 'UserApi')),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserApiModule {}
