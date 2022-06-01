import { SetNestApp } from '@app/common/setNestApp';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  SetNestApp(app);

  await app.init();
});

afterAll(async () => {
  await app.close();
});

export { app };
