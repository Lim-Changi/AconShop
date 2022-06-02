import { app } from '@test/global-hook.spec';
import { randomString } from '@test/tools/randomString';
import request from 'supertest';

describe('Purchase API', () => {
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
    describe('상품 구매 API', () => {
      it.todo('');
    });
  });
});
