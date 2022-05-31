import { getWinstonLogger } from '@app/common/getWinstonLogger';
import { ProductModule } from '@app/entity/domain/product/Product.module';
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { CountryApiModule } from '../../src/Country/country.api.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [
    CountryApiModule,
    ProductModule,
    WinstonModule.forRoot(getWinstonLogger(process.env.NODE_ENV, 'ProductApi')),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductApiModule {}
