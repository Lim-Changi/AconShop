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
}
