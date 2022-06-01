import { Product } from '@app/entity/domain/product/Product.entity';
import { UserPayload } from '@app/entity/domain/user/dao/UserPayload';
import { BadRequestException, Injectable } from '@nestjs/common';
import { snakeToCamel } from 'libs/util/snake-camel-converter';
import { CountryService } from '../../src/Country/country.service';
import { GetPendingProductRes } from './dto/GetPendingProductRes';
import { SubmitProductRes } from './dto/SubmitProductRes';
import { ProductRepository } from './repository/product.repository';
import { ProductDao } from '@app/entity/domain/product/dao/ProductDao';
import { ProductDataRes } from './dto/ProductDataRes';
import { ProductSubmitDao } from '@app/entity/domain/product/dao/ProductSubmitDao';
import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';

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
      await this.productRepository.reviewProduct(product, user.id);
      const updatedProduct = await this.productRepository.getProductById(
        product.id,
      );
      return new ProductDataRes(snakeToCamel(updatedProduct));
    } catch (e) {
      throw e;
    }
  }

  async addForeignProduct(
    product: Product,
    user: UserPayload,
  ): Promise<ProductDataRes> {
    try {
      const baseProduct = snakeToCamel(
        await this.productRepository.getProductById(product.id),
      );
      const foreignCountryInfo = snakeToCamel(
        await this.countryService.getCountryData(Number(product.Country)),
      );

      let failMessage = '';
      if (!baseProduct) failMessage = failMessage.concat('No Product, ');
      if (baseProduct?.status !== ProductStatus.Success)
        failMessage = failMessage.concat('Invalid Status, ');
      if (baseProduct?.name !== '대한민국')
        failMessage = failMessage.concat('Base Product Not Korea, ');
      if (!foreignCountryInfo)
        failMessage = failMessage.concat('No Target Country, ');
      if (foreignCountryInfo?.name === '대한민국')
        failMessage = failMessage.concat('Target Country is Korea');
      if (failMessage) {
        throw new BadRequestException(
          '올바르지 않은 요청 값입니다. >> ' + failMessage,
        );
      }

      product.Author = baseProduct.authorId;
      product.Editor = user.id.toString();
      product.status = baseProduct.status;
      product.fee = baseProduct.fee;
      product.price = Number(
        (baseProduct?.price * foreignCountryInfo?.exchangeRate).toFixed(2),
      );
      delete product.id;

      const addProduct = await this.productRepository.submitProduct(product);
      const newForeignProduct = await this.productRepository.getProductById(
        addProduct.id,
      );

      return new ProductDataRes(snakeToCamel(newForeignProduct));
    } catch (e) {
      throw e;
    }
  }
}
