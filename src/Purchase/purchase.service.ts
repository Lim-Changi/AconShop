import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { Purchase } from '@app/entity/domain/purchase/Purchase.entity';
import { UserPayload } from '@app/entity/domain/user/dao/UserPayload';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProductService } from '../../src/Product/product.service';
import { PurchaseRepository } from './repository/purchase.repository';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly productService: ProductService,
  ) {}

  async purchaseProduct(purchase: Purchase, user: UserPayload): Promise<void> {
    try {
      const productData = await this.productService.getProductById(
        Number(purchase.Product),
      );
      if (
        !productData ||
        productData?.status !== ProductStatus.Success ||
        !productData.editor_id
      ) {
        throw new ForbiddenException('잘못된 상품입니다.');
      }
      purchase.User = user.id.toString();
      await this.purchaseRepository.purchaseProduct(purchase);
    } catch (e) {
      throw e;
    }
  }
}
