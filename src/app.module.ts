import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckController } from './HealthCheck/HealthCheckController';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [HttpModule, TerminusModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
