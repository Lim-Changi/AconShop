import { User } from '@app/entity/domain/User/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class UserModule {}
