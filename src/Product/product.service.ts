import { Product } from '@app/entity/domain/product/Product.entity';
import { UserPayload } from '@app/entity/domain/user/dao/UserPayload';
import { Injectable } from '@nestjs/common';
import { snakeToCamel } from 'libs/util/snake-camel-converter';
import { CountryService } from '../../src/Country/country.service';
import { GetPendingProductRes } from './dto/GetPendingProductRes';
import { SubmitProductRes } from './dto/SubmitProductRes';
import { ProductRepository } from './repository/product.repository';
import { ProductDao } from '@app/entity/domain/product/dao/ProductDao';
import { ProductDataRes } from './dto/ProductDataRes';
import { ProductSubmitDao } from '@app/entity/domain/product/dao/ProductSubmitDao';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly countryService: CountryService,
  ) {}

  async submitProduct(
    product: Product,
    user: UserPayload,
  ): Promise<SubmitProductRes> {
    try {
      const koreaData = await this.countryService.getCountryDataByName(
        '대한민국',
      );
      product.Author = user.id.toString();
      product.Country = snakeToCamel(koreaData);

      const newProduct = (await this.productRepository.submitProduct(
        product,
      )) as unknown as ProductSubmitDao;
      return new SubmitProductRes(newProduct);
    } catch (e) {
      throw e;
    }
  }

  async getPendingProduct(): Promise<GetPendingProductRes[]> {
    try {
      const pendingProduct = await this.productRepository.getPendingProduct();
      return snakeToCamel(pendingProduct).map(
        (product) => new GetPendingProductRes(product as unknown as ProductDao),
      );
    } catch (e) {
      throw e;
    }
  }

  async reviewProduct(
    product: Product,
    user: UserPayload,
  ): Promise<ProductDataRes> {
    try {
      console.log(product);
      await this.productRepository.reviewProduct(product, user.id);
      const updatedProduct = await this.productRepository.getProductById(
        product.id,
      );
      return new ProductDataRes(snakeToCamel(updatedProduct));
    } catch (e) {
      throw e;
    }
  }
}
