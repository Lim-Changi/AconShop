import { Country } from '@app/entity/domain/country/Country.entity';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AddCountryRes } from './dto/AddCountryRes';
import { CountryRepository } from './repository/country.repository';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepository: CountryRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger?: Logger,
  ) {}

  async addCountry(createCountry: Country): Promise<AddCountryRes> {
    try {
      const newCountry = await this.countryRepository.createCountry(
        createCountry,
      );
      return new AddCountryRes(newCountry);
    } catch (e) {
      if (e.errno === 1062) throw new ForbiddenException('중복된 국가입니다.');
      throw e;
    }
  }
}
