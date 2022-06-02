import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { app } from '@test/global-hook.spec';
import { createTestUser } from '@test/tools/createNecessaries';
import { randomString } from '@test/tools/randomString';
import request from 'supertest';

describe('Auth API', () => {
  describe('회원가입', () => {
    it('필수 값 누락시, 400 에러 반환', async () => {
      const res1 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: 'test' + randomString(3),
          password: 'Test123!',
          role: null,
        });
      const res2 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: null,
          password: 'Test123!',
          role: UserRole.AUTHOR,
        });
      const res3 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: 'test' + randomString(3),
          password: null,
          role: UserRole.AUTHOR,
        });
      expect(res1.statusCode).toBe(400);
      expect(res2.statusCode).toBe(400);
      expect(res3.statusCode).toBe(400);
    });
    it('비밀번호 형식이 올바르지 않을 시, 400 에러 반환', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: 'test' + randomString(3),
          password: '123',
          role: UserRole.CUSTOMER,
        });
      expect(res.statusCode).toBe(400);
    });
    it('정상적인 데이터 전달시, 회원가입 성공 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: 'test' + randomString(3),
          password: 'Test123!',
          role: UserRole.CUSTOMER,
        });
      expect(res.statusCode).toBe(201);
    });
    it('중복된 계정으로 회원가입 시도 시, 403 에러 반환', async () => {
      const userId = 'test' + randomString(3);
      const res1 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: userId,
          password: 'Test123!',
          role: UserRole.CUSTOMER,
        });
      const res2 = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          userId: userId,
          password: 'Test123!',
          role: UserRole.CUSTOMER,
        });
      expect(res1.statusCode).toBe(201);
      expect(res2.statusCode).toBe(403);
    });
  });

  describe('로그인', () => {
    it('필수값 누락 시, 400 에러 반환', async () => {
      const testUser = (await createTestUser(1, UserRole.CUSTOMER))[0];
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        accountId: null,
        password: testUser.password,
      });
      expect(res.statusCode).toBe(400);
    });
    it('아이디 혹은 비밀번호가 일치하지 않을 시, 403 에러 반환', async () => {
      const testUser = (await createTestUser(1, UserRole.CUSTOMER))[0];
      const res1 = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          accountId: testUser.account,
          password: testUser.password + 'asd',
        });
      const res2 = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          accountId: testUser.account + 'asd',
          password: testUser.password,
        });
      expect(res1.statusCode).toBe(403);
      expect(res2.statusCode).toBe(403);
    });
    it('정상적인 데이터 전달시, 로그인 성공 200', async () => {
      const testUser = (await createTestUser(1, UserRole.CUSTOMER))[0];

      const res = await request(app.getHttpServer()).post('/auth/login').send({
        accountId: testUser.account,
        password: testUser.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });
});
