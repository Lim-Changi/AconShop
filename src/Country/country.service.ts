import { Country } from '@app/entity/domain/country/Country.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { snakeToCamel } from 'libs/util/snake-camel-converter';
import { CountryDataRes } from './dto/CountryDataRes';
import { CountryRepository } from './repository/country.repository';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async addCountry(createCountry: Country): Promise<CountryDataRes> {
    try {
      const newCountry = await this.countryRepository.createCountry(
        createCountry,
      );
      return new CountryDataRes(newCountry);
    } catch (e) {
      if (e.errno === 1062) throw new ForbiddenException('중복된 국가입니다.');
      throw e;
    }
  }

  async getCountryDataByName(countryName: string): Promise<Country> {
    try {
      return await this.countryRepository.getCountryDataByName(countryName);
    } catch (e) {
      throw e;
    }
  }

  async getAllCountryData(): Promise<CountryDataRes[]> {
    try {
      const allCountryData = await this.countryRepository.getAllCountryData();
      return snakeToCamel(allCountryData).map(
        (country) => new CountryDataRes(country),
      );
    } catch (e) {
      throw e;
    }
  }
}
