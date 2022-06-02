import { Country } from '@app/entity/domain/country/Country.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { User } from '@app/entity/domain/user/User.entity';
import { genSalt, hash } from 'bcrypt';
import { createQueryBuilder } from 'typeorm';
import { randomString } from './randomString';

export const createTestUser = async (
  count = 1,
  role: UserRole,
): Promise<User[]> => {
  const testUsers: User[] = [];
  const promises = [];
  const salt = await genSalt();
  for (let i = 0; i < count; i++) {
    promises.push(async () => {
      const password = '!23test' + randomString(5);
      const testUser = new User();
      testUser.account = randomString(5);
      testUser.password = await hash(password, salt);
      testUser.role = role;
      const insertQuery = await createQueryBuilder()
        .insert()
        .into(User)
        .values(testUser)
        .execute();
      testUser.id = insertQuery.raw.insertId;
      testUser.password = password;
      testUsers.push(testUser);
    });
  }
  await Promise.all(
    promises.map((func) => {
      return func();
    }),
  );
  return testUsers;
};

export const createTestCountry = async (count = 1): Promise<Country[]> => {
  const testCountries: Country[] = [];
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(async () => {
      const testCountry = new Country();
      testCountry.name = randomString(5);
      testCountry.exchangeRate = Number((Math.random() * 10).toFixed(5));
      testCountry.currency = randomString(1, true);
      const insertQuery = await createQueryBuilder()
        .insert()
        .into(Country)
        .values(testCountry)
        .execute();
      testCountry.id = insertQuery.raw.insertId;
      testCountries.push(testCountry);
    });
  }
  await Promise.all(
    promises.map((func) => {
      return func();
    }),
  );
  return testCountries;
};

export const createTestProduct = async (
  count = 1,
  authorId: number,
  countryId: number,
): Promise<Product[]> => {
  const testProducts: Product[] = [];
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(async () => {
      const testProduct = new Product();
      testProduct.status = ProductStatus.Pending;
      testProduct.title = randomString(10);
      testProduct.description = randomString(20);
      testProduct.Author = authorId.toString();
      testProduct.Country = countryId.toString();
      testProduct.price = Math.floor(Math.random() * 100000 + 1000);

      const insertQuery = await createQueryBuilder()
        .insert()
        .into(Product)
        .values(testProduct)
        .execute();
      testProduct.id = insertQuery.raw.insertId;
      testProducts.push(testProduct);
    });
  }
  await Promise.all(
    promises.map((func) => {
      return func();
    }),
  );
  return testProducts;
};
