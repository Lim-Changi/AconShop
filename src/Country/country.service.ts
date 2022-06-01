import { Country } from '@app/entity/domain/country/Country.entity';
import { CountryDao } from '@app/entity/domain/country/dao/CountryDao';
import { ProductJoinCountryDao } from '@app/entity/domain/product/dao/ProductJoinCountryDao';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CountryDataRes } from './dto/CountryDataRes';
import { CountryRepository } from './repository/country.repository';
import { snakeToCamel } from '@app/util/snake-camel-converter';
@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async addCountry(createCountry: Country): Promise<CountryDataRes> {
    try {
      const newCountry = await this.countryRepository.createCountry(
        createCountry,
      );
      return new CountryDataRes(newCountry as unknown as CountryDao);
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

  async getCountryData(countryId: number): Promise<Country> {
    try {
      return await this.countryRepository.getCountryData(countryId);
    } catch (e) {
      throw e;
    }
  }

  async getCountryProduct(countryId: number): Promise<ProductJoinCountryDao[]> {
    try {
      return await this.countryRepository.getCountryProduct(countryId);
    } catch (e) {
      throw e;
    }
  }
}
