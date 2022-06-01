import request from 'supertest';
import { app } from './global-hook.spec';

describe('AppController (e2e)', () => {
  it('/health-check', () => {
    return request(app.getHttpServer()).get('/health-check').expect(200);
  });
});
