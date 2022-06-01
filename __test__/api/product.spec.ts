import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { app } from '@test/global-hook.spec';
import { createTestUser } from '@test/tools/createNecessaries';
import { randomString } from '@test/tools/randomString';
import request from 'supertest';

describe('Product API', () => {
  it('토큰 인증 실패시, 401 에러 반환', async () => {
    const res = await request(app.getHttpServer())
      .post('/product/submit')
      .set('Authorization', `Bearer ${null}`)
      .send({
        title: randomString(10),
        description: randomString(20),
        price: 100000,
      });

    expect(res.statusCode).toBe(401);
  });
  describe('작가 상품 제출', () => {
    it('권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
      const testCustomer = (await createTestUser(1, UserRole.CUSTOMER))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testCustomer.account,
          password: testCustomer.password,
        })
      ).body.data.accessToken;

      const res = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: randomString(10),
          description: randomString(20),
          price: 100000,
        });

      expect(res.statusCode).toBe(403);
    });
    it('필수 값 누락 시, 400 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testAuthor.account,
          password: testAuthor.password,
        })
      ).body.data.accessToken;

      const res1 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: null,
          description: randomString(20),
          price: 100000,
        });
      const res2 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: randomString(10),
          description: null,
          price: 100000,
        });
      const res3 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: randomString(10),
          description: randomString(20),
          price: null,
        });

      expect(res1.statusCode).toBe(400);
      expect(res2.statusCode).toBe(400);
      expect(res3.statusCode).toBe(400);
    });
    it('정상적으로 모든 값 입력 시, 상품 제출 성공 201', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testAuthor.account,
          password: testAuthor.password,
        })
      ).body.data.accessToken;

      const res = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: randomString(10),
          description: randomString(20),
          price: 100000,
        });

      expect(res.statusCode).toBe(201);
    });
  });
  describe('검토 대기 상품 확인', () => {
    it('권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
      const testCustomer = (await createTestUser(1, UserRole.CUSTOMER))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testCustomer.account,
          password: testCustomer.password,
        })
      ).body.data.accessToken;

      const res = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
    });
    it('관리자 검토 대기 상품 확인 성공 200', async () => {
      const testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testEditor.account,
          password: testEditor.password,
        })
      ).body.data.accessToken;

      const res = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
