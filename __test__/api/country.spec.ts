import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { app } from '@test/global-hook.spec';
import {
  createTestCountry,
  createTestUser,
} from '@test/tools/createNecessaries';
import { randomString } from '@test/tools/randomString';
import request from 'supertest';

describe('Country API', () => {
  it('토큰 인증 실패시, 401 에러 반환', async () => {
    const res = await request(app.getHttpServer())
      .post('/country')
      .set('Authorization', `Bearer ${null}`)
      .send({
        name: randomString(5),
        exchangeRate: 0.12345,
        currency: '₩',
      });

    expect(res.statusCode).toBe(401);
  });
  it('권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
    const testEditor = (await createTestUser(1, UserRole.CUSTOMER))[0];
    const accessToken = (
      await request(app.getHttpServer()).post('/auth/login').send({
        accountId: testEditor.account,
        password: testEditor.password,
      })
    ).body.data.accessToken;

    const res = await request(app.getHttpServer())
      .post('/country')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: randomString(5),
        exchangeRate: 0.12345,
        currency: '₩',
      });

    expect(res.statusCode).toBe(403);
  });
  describe('나라 추가', () => {
    it('필수 값 누락시, 400 에러 반환', async () => {
      const testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testEditor.account,
          password: testEditor.password,
        })
      ).body.data.accessToken;

      const res1 = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: null,
          exchangeRate: 0.12345,
          currency: '₩',
        });
      const res2 = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: randomString(5),
          exchangeRate: null,
          currency: '₩',
        });
      const res3 = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: randomString(5),
          exchangeRate: 0.12345,
          currency: null,
        });

      expect(res1.statusCode).toBe(400);
      expect(res2.statusCode).toBe(400);
      expect(res3.statusCode).toBe(400);
    });
    it('정상값 전달 시, 성공적으로 나라 생성 201', async () => {
      const testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testEditor.account,
          password: testEditor.password,
        })
      ).body.data.accessToken;

      const res = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: randomString(5),
          exchangeRate: 0.12345,
          currency: '₩',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('exchange_rate');
      expect(res.body.data).toHaveProperty('currency');
    });
    it('중복된 나라이름으로 생성 시도 시, 403 에러 반환', async () => {
      const testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testEditor.account,
          password: testEditor.password,
        })
      ).body.data.accessToken;

      const countryName = randomString(5);
      const res1 = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: countryName,
          exchangeRate: 0.12345,
          currency: '₩',
        });
      const res2 = await request(app.getHttpServer())
        .post('/country')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: countryName,
          exchangeRate: 0.71234,
          currency: '$',
        });
      expect(res1.statusCode).toBe(201);
      expect(res2.statusCode).toBe(403);
    });
  });

  describe('전체 나라 조회', () => {
    it('성공적으로 모든 나라 데이터 조회 200', async () => {
      const testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
      const accessToken = (
        await request(app.getHttpServer()).post('/auth/login').send({
          accountId: testEditor.account,
          password: testEditor.password,
        })
      ).body.data.accessToken;

      const res1 = await request(app.getHttpServer())
        .get('/country')
        .set('Authorization', `Bearer ${accessToken}`);
      const addCountryCount = 5;
      await createTestCountry(addCountryCount);
      const res2 = await request(app.getHttpServer())
        .get('/country')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res1.statusCode).toBe(200);
      expect(res2.statusCode).toBe(200);
      expect(res1.body.data[0]).toHaveProperty('id');
      expect(res1.body.data[0]).toHaveProperty('name');
      expect(res1.body.data[0]).toHaveProperty('exchange_rate');
      expect(res1.body.data[0]).toHaveProperty('currency');
      expect(res2.body.data).toHaveLength(
        res1.body.data.length + addCountryCount,
      );
    });
  });
});
