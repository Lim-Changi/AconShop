import { SetNestApp } from '@app/common/setNestApp';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { ConfigService } from 'libs/entity/config/configService';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;

  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
  }

  private async swagger() {
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs'],
      expressBasicAuth({
        challenge: true,
        users: {
          [ConfigService.swaggerAdminAuth().SWAGGER_ADMIN]:
            ConfigService.swaggerAdminAuth().SWAGGER_PASSWORD,
        },
      }),
    );
  }

  private setUpOpenAPIMiddleware() {
    this.server.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      optionsSuccessStatus: 200,
    });
    const options = new DocumentBuilder()
      .setTitle('Acon3D - Shop')
      .setDescription('API Document')
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(this.server, options);
    SwaggerModule.setup('docs', this.server, document);
  }

  async bootstrap() {
    SetNestApp(this.server);
    await this.swagger();
    await this.server.listen(ConfigService.appPort());
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(
        `✅ Server on http://localhost:${ConfigService.appPort()}`,
      );
    } else {
      this.logger.log(`✅ Server on port ${ConfigService.appPort()}`);
    }
  }
}

async function bootstrap(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('Init', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });

  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

bootstrap().catch((error) => {
  new Logger('init').error(error);
});
