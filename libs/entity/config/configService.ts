import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

class SwaggerAdminConfig {
  readonly SWAGGER_ADMIN: string;
  readonly SWAGGER_PASSWORD: string;
}
class DBConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly synchronize: boolean;
  readonly logging: boolean;
}

@Injectable()
export class ConfigService {
  static appPort(): number {
    const { PORT } = process.env;
    return PORT ? Number(PORT) : 3000;
  }

  static swaggerAdminAuth(): SwaggerAdminConfig {
    const { SWAGGER_ADMIN, SWAGGER_PASSWORD } = process.env;
    return { SWAGGER_ADMIN, SWAGGER_PASSWORD };
  }

  static ormConfig(): TypeOrmModuleOptions {
    return {
      ...this.loadDBConfig(),
      type: 'mysql',
      entities: [path.join(__dirname, '..', 'domain/**/*.entity.{js,ts}')],
      migrations: [path.join(__dirname, '..', 'migrations/*{.ts,.js}')],
      cli: { migrationsDir: 'libs/entity/migrations' },
      migrationsTableName: 'migrations',
      autoLoadEntities: true,
      keepConnectionAlive: true,
      namingStrategy: new SnakeNamingStrategy(),
      maxQueryExecutionTime: Number(process.env.DB_CONNECTION_TIMEOUT),
    };
  }

  static loadDBConfig(): DBConfig {
    const [host, port, username, password, database, logging, synchronize] =
      process.env.NODE_ENV === 'production'
        ? [
            process.env.DB_HOST,
            process.env.DB_PORT,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            process.env.DB_NAME,
            process.env.LOGGING,
            process.env.SYNCHRONIZE,
          ]
        : [
            process.env.DB_LOCAL_HOST,
            process.env.DB_LOCAL_PORT,
            process.env.DB_LOCAL_USERNAME,
            process.env.DB_LOCAL_PASSWORD,
            process.env.DB_LOCAL_NAME,
            process.env.LOCAL_LOGGING,
            process.env.LOCAL_SYNCHRONIZE,
          ];

    return {
      host,
      port: Number(port),
      database,
      username,
      password,
      synchronize: synchronize === 'false' ? false : Boolean(synchronize),
      logging: logging === 'false' ? false : Boolean(logging),
    };
  }

  static jwtSecretKey(): string {
    return process.env.JWT_SECRET_KEY;
  }
}
