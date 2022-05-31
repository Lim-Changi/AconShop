import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './HealthCheck/HealthCheckController';
import { TerminusModule } from '@nestjs/terminus';
import { ValidationSchema } from '@app/common/config/validationSchema';
import { LoggingModule } from '@app/common/logging/logging.module';
import { getTypeOrmModule } from '@app/entity/getTypeOrmModule';
import { UserApiModule } from './User/user.api.module';
import { AuthModule } from './Auth/auth.module';
import { CountryApiModule } from './Country/country.api.module';
import { ProductApiModule } from './Product/product.api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ValidationSchema,
    }),
    UserApiModule,
    ProductApiModule,
    CountryApiModule,
    HttpModule,
    TerminusModule,
    LoggingModule,
    getTypeOrmModule(),
    AuthModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
