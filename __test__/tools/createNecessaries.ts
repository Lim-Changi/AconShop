import { Country } from '@app/entity/domain/country/Country.entity';
import { Product } from '@app/entity/domain/product/Product.entity';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { User } from '@app/entity/domain/user/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomString } from './randomString';

@Injectable()
export class TestTools {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createTestUser(count = 1, role: UserRole): Promise<User[]> {
    const testUsers: User[] = [];
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(async () => {
        const testUser = new User();
        testUser.account = randomString(5);
        testUser.password = 'test' + randomString(5);
        testUser.role = role;
        testUsers.push(testUser);
        this.userRepository.save(testUser);
      });
    }
    await Promise.all(promises);
    return testUsers;
  }

  async createTestCountry(count = 1): Promise<Country[]> {
    const testCountries: Country[] = [];
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(async () => {
        const testCountry = new Country();
        testCountry.name = randomString(5);
        testCountry.exchangeRate = Number((Math.random() * 10).toFixed(5));
        testCountry.currency = randomString(1, true);
        testCountries.push(testCountry);
        this.countryRepository.save(testCountry);
      });
    }
    await Promise.all(promises);
    return testCountries;
  }

  async createTestProduct(
    count = 1,
    authorId: number,
    countryId: number,
  ): Promise<Product[]> {
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
        testProducts.push(testProduct);
        this.productRepository.save(testProduct);
      });
    }
    await Promise.all(promises);
    return testProducts;
  }
}
