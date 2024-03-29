import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: '서버 상태 체크',
  })
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-axios', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
    ]);
  }
}
