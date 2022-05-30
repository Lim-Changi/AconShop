import { Country } from '@app/entity/domain/country/Country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class CountryModule {}
