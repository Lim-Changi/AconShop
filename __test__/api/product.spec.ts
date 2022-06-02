import { ProductStatus } from '@app/entity/domain/product/ProductStatusType';
import { UserRole } from '@app/entity/domain/user/dao/UserRole';
import { app } from '@test/global-hook.spec';
import { compareDecimal } from '@test/tools/compareDecimal';
import {
  createTestCountry,
  createTestProduct,
  createTestUser,
} from '@test/tools/createNecessaries';
import { randomString } from '@test/tools/randomString';
import { ProductDataRes } from 'src/Product/dto/ProductDataRes';
import request from 'supertest';

describe('Product API', () => {
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
      const res = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({
          title: randomString(10),
          description: randomString(20),
          price: 100000,
        });

      expect(res.statusCode).toBe(403);
    });
    it('필수 값 누락 시, 400 에러 반환', async () => {
      const res1 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${authorAccessToken}`)
        .send({
          title: null,
          description: randomString(20),
          price: 100000,
        });
      const res2 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${authorAccessToken}`)
        .send({
          title: randomString(10),
          description: null,
          price: 100000,
        });
      const res3 = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${authorAccessToken}`)
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
      const res = await request(app.getHttpServer())
        .post('/product/submit')
        .set('Authorization', `Bearer ${authorAccessToken}`)
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
      const res = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(res.statusCode).toBe(403);
    });
    it('관리자 검토 대기 상품 확인 성공 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${editorAccessToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
  describe('상품 검토 및 수정', () => {
    it('권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
      const res = await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(res.statusCode).toBe(403);
    });
    it('상품 ID 미입력시, 400 에러반환', async () => {
      const newTitle = randomString(5);
      const newDescription = randomString(10);
      const newPrice = Math.floor(Math.random() * 10000);
      const newFee = Number(Math.random().toFixed(2));

      const res = await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: null,
          title: newTitle,
          description: newDescription,
          price: newPrice,
          fee: newFee,
          status: ProductStatus.Success,
        });
      expect(res.statusCode).toBe(400);
    });
    it('정상적으로 수정값 입력시, 상품 정보 업데이트 성공 200', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const pendingProducts = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${editorAccessToken}`);
      const insertedProduct = pendingProducts.body.data.filter((data) => {
        return data.id === testProduct.id;
      })[0] as ProductDataRes;
      expect(insertedProduct).not.toBeUndefined();
      expect(insertedProduct.title).toBe(testProduct.title);
      expect(insertedProduct.description).toBe(testProduct.description);
      expect(Math.floor(insertedProduct.price)).toBe(testProduct.price);

      const newTitle = randomString(5);
      const newDescription = randomString(10);
      const newPrice = Math.floor(Math.random() * 10000);
      const newFee = Number(Math.random().toFixed(2));

      const res = await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: insertedProduct.id,
          title: newTitle,
          description: newDescription,
          price: newPrice,
          fee: newFee,
          status: ProductStatus.Success,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe(newTitle);
      expect(res.body.data.description).toBe(newDescription);
      expect(Math.floor(res.body.data.price)).toBe(newPrice);
      expect(res.body.data.fee).toBe(newFee.toString());
      expect(res.body.data.status).toBe(ProductStatus.Success);
    });
    it('상품 검토 상태를 성공으로 수정시, 수수료를 입력하지 않으면 400 에러반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const pendingProducts = await request(app.getHttpServer())
        .get('/product/pending')
        .set('Authorization', `Bearer ${editorAccessToken}`);
      const insertedProduct = pendingProducts.body.data.filter((data) => {
        return data.id === testProduct.id;
      })[0] as ProductDataRes;
      expect(insertedProduct).not.toBeUndefined();
      expect(insertedProduct.title).toBe(testProduct.title);
      expect(insertedProduct.description).toBe(testProduct.description);
      expect(Math.floor(insertedProduct.price)).toBe(testProduct.price);

      const newTitle = randomString(5);
      const newDescription = randomString(10);
      const newPrice = Math.floor(Math.random() * 10000);

      const res = await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: insertedProduct.id,
          title: newTitle,
          description: newDescription,
          price: newPrice,
          status: ProductStatus.Success,
        });
      expect(res.statusCode).toBe(400);
    });
  });
  describe('기존 상품의 타 국가 정보 추가', () => {
    it('권한이 없는 유저로 접근 시, 403 에러 반환', async () => {
      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(res.statusCode).toBe(403);
    });
    it('필수 값 누락 시, 400 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const testCountry = (await createTestCountry(1))[0];
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          status: ProductStatus.Success,
          fee: newFee,
        });

      const res1 = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: null,
          country_id: testCountry.id,
          title: 'Title',
          description: 'Description',
        });
      const res2 = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: null,
          title: 'Title',
          description: 'Description',
        });
      const res3 = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: testCountry.id,
          title: null,
          description: 'Description',
        });
      const res4 = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: testCountry.id,
          title: 'Title',
          description: null,
        });

      expect(res1.statusCode).toBe(400);
      expect(res2.statusCode).toBe(400);
      expect(res3.statusCode).toBe(400);
      expect(res4.statusCode).toBe(400);
    });
    it('존재하지 않는 상품ID 입력시, 400 에러 반환', async () => {
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
          status: ProductStatus.Success,
          fee: newFee,
        });

      const testCountry = (await createTestCountry(1))[0];

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: 0,
          country_id: testCountry.id,
          title: 'Title',
          description: 'Description',
        });
      console.log(res.body);
      expect(res.statusCode).toBe(400);
    });
    it('검토가 끝나지 않은 상품ID 입력시, 400 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      const testCountry = (await createTestCountry(1))[0];

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: testCountry.id,
          title: 'Title',
          description: 'Description',
        });
      expect(res.statusCode).toBe(400);
    });
    it('대한민국 상품이 아닌 경우, 400 에러 반환', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testCountry = (await createTestCountry(1))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, testCountry.id)
      )[0];
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          status: ProductStatus.Success,
          fee: newFee,
        });

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testAuthor.id,
          country_id: testCountry.id,
          title: 'Title',
          description: 'Description',
        });
      console.log(res.body);
      expect(res.statusCode).toBe(400);
    });
    it('존재하지 않는 국가ID을 입력한 경우, 400 에러 반환', async () => {
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
          status: ProductStatus.Success,
          fee: newFee,
        });

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: 0,
          title: 'Title',
          description: 'Description',
        });
      expect(res.statusCode).toBe(400);
    });
    it('다국어 정보 입력 대상의 나라ID 가 대한민국인 경우, 400 에러 반환', async () => {
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
          status: ProductStatus.Success,
          fee: newFee,
        });

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: koreaId,
          title: 'Title',
          description: 'Description',
        });
      expect(res.statusCode).toBe(400);
    });
    it('정상적으로 모든 값 입력시, 상품의 다국어 정보 추가 성공 201', async () => {
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
          status: ProductStatus.Success,
          fee: newFee,
        });

      const testCountry = (await createTestCountry(1))[0];
      const newTitle = randomString(5);
      const newDescription = randomString(10);

      const res = await request(app.getHttpServer())
        .post('/product/foreign')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          country_id: testCountry.id,
          title: newTitle,
          description: newDescription,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe(newTitle);
      expect(res.body.data.description).toBe(newDescription);
      expect(res.body.data.status).toBe(ProductStatus.Success);
      expect(res.body.data.author_id).toBe(testAuthor.id);
      expect(res.body.data.editor_id).toBe(testEditor.id);
      expect(Math.floor(res.body.data.price / 10)).toBe(
        Math.floor((testProduct.price * testCountry.exchangeRate) / 10),
      );
      expect(compareDecimal(res.body.data.fee, newFee)).toBe(true);
      expect(res.body.data.country_id).toBe(testCountry.id);
    });
  });
  describe('나라별 상품 조회', () => {
    it('나라 ID Parameter 누락시, 404 에러 반환', async () => {
      const res = await request(app.getHttpServer())
        .get('/product/')
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(res.statusCode).toBe(404);
    });
    it('나라 ID Parameter 정상적으로 입력시, 국가별 상품정보 조회 성공 200', async () => {
      const testAuthor = (await createTestUser(1, UserRole.AUTHOR))[0];
      const testProduct = (
        await createTestProduct(1, testAuthor.id, koreaId)
      )[0];
      console.log(editorAccessToken);
      const newFee = Number(Math.random().toFixed(2));

      await request(app.getHttpServer())
        .put('/product/review')
        .set('Authorization', `Bearer ${editorAccessToken}`)
        .send({
          product_id: testProduct.id,
          status: ProductStatus.Success,
          fee: newFee,
        });

      const testCountry = (await createTestCountry(1))[0];
      const newTitle = randomString(5);
      const newDescription = randomString(10);

      const addCount = 10;

      for (let i = 0; i < addCount; i++) {
        await request(app.getHttpServer())
          .post('/product/foreign')
          .set('Authorization', `Bearer ${editorAccessToken}`)
          .send({
            product_id: testProduct.id,
            country_id: testCountry.id,
            title: newTitle,
            description: newDescription,
          });
      }

      const res = await request(app.getHttpServer())
        .get(`/product/${testCountry.id}`)
        .set('Authorization', `Bearer ${editorAccessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(addCount);
    });
  });
});
