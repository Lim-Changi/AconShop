import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';
import { Country } from '@app/entity/domain/country/Country.entity';

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {
  async createCountry(country: Country): Promise<Country> {
    const insertQuery = await createQueryBuilder()
      .insert()
      .into(Country)
      .values(country)
      .execute();
    country.id = insertQuery.raw.insertId;
    return country;
  }

  async getCountryDataByName(countryName: string): Promise<Country> {
    const selectQuery = createQueryBuilder()
      .select(['id', 'name', 'exchange_rate', 'currency'])
      .from(Country, 'country')
      .where(`country.name =:countryName`, { countryName });

    return await selectQuery.getRawOne();
  }

  async getAllCountryData(): Promise<Country[]> {
    const selectQuery = createQueryBuilder()
      .select(['id', 'name', 'exchange_rate', 'currency'])
      .from(Country, 'country');

    return await selectQuery.getRawMany();
  }

  async getCountryData(countryId: number): Promise<Country> {
    const selectQuery = createQueryBuilder()
      .select(['id', 'name', 'exchange_rate', 'currency'])
      .from(Country, 'country')
      .where(`country.id =:countryId`, { countryId });

    return await selectQuery.getRawOne();
  }
}
