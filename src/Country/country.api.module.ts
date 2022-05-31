import { getWinstonLogger } from '@app/common/getWinstonLogger';
import { CountryModule } from '@app/entity/domain/country/Country.module';
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { CountryRepository } from './repository/country.repository';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

@Module({
  imports: [
    CountryModule,
    WinstonModule.forRoot(getWinstonLogger(process.env.NODE_ENV, 'UserApi')),
  ],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
  exports: [CountryService],
})
export class CountryApiModule {}
