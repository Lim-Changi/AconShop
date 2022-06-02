import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { app } from '@test/global-hook.spec';
import {
  createTestProduct,
  createTestUser,
} from '@test/tools/createNecessaries';
import request from 'supertest';

describe('Purchase API', () => {
  const koreaId = 1;
  let customerAccessToken;
  let authorAccessToken;
  let editorAccessToken;
  let testEditor;
  beforeAll(async () => {
    const testCustomer = (await createTestUser(1, UserRole.CUSTOMER))[0];
    const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
    testEditor = (await createTestUser(1, UserRole.EDITOR))[0];
    customerAccessToken = (
      await request(app.getHttpServer()).post('/auth/login').send({
        accountId: testCustomer.account,
        password: testCustomer.password,
      })
    ).body.data.accessToken;
    authorAccessToken = (
      await request(app.getHttpServer()).post('/auth/login').send({
        accountId: testAuthor.account,
        password: testAuthor.password,
      })
    ).body.data.accessToken;
    editorAccessToken = (
      await request(app.getHttpServer()).post('/auth/login').send({
        accountId: testEditor.account,
        password: testEditor.password,
      })
    ).body.data.accessToken;
  });
  it('토큰 인증 실패시, 401 에러 반환', async () => {
    const res = await request(app.getHttpServer())
      .post('/purchase')
      .set('Authorization', `Bearer ${null}`)
      .send({
        product_id: 6,
      });

    expect(res.statusCode).toBe(401);
  });
  describe('상품 구매 API', () => {
    it('고객 권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          fee: newFee,
          status: ProductStatus.Success,
        });

      const res1 = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
        });

      const res2 = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authorAccessToken}`)
        .send({
          product_id: testProduct.id,
        });

      expect(res1.statusCode).toBe(403);
      expect(res2.statusCode).toBe(403);
    });
    it('상품ID 누락 시, 400 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          fee: newFee,
          status: ProductStatus.Success,
        });
      const res = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          product_id: null,
        });

      expect(res.statusCode).toBe(400);
    });
    it('상품 ID로 조회가 안되는 경우, 403 에러 반환', async () => {
      const res = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          product_id: 0,
        });

      expect(res.statusCode).toBe(403);
    });
    it('상품의 검수가 완료되지 않은 경우, 403 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];

      const res = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          product_id: testProduct.id,
        });

      expect(res.statusCode).toBe(403);
    });
    it('정상적인 상품 ID 입력시, 구매 성공 201', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          fee: newFee,
          status: ProductStatus.Success,
        });
      const res = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          product_id: testProduct.id,
        });

      expect(res.statusCode).toBe(201);
    });
  });
});
