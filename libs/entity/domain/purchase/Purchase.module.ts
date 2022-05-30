import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Purchase } from './Purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class PurchaseModule {}
