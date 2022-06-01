import { getWinstonLogger } from '@app/common/getWinstonLogger';
import { PurchaseModule } from '@app/entity/domain/purchase/Purchase.module';
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ProductApiModule } from 'src/Product/product.api.module';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './repository/purchase.repository';

@Module({
  imports: [
    PurchaseModule,
    ProductApiModule,
    WinstonModule.forRoot(
      getWinstonLogger(process.env.NODE_ENV, 'PurchaseApi'),
    ),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
  exports: [PurchaseService],
})
export class PurchaseApiModule {}
