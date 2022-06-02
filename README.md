# Acon Shop
### Short Description
판매자는 상품을 올릴 수 있고, 관리자는 상품을 승인 및 관리하며, 구매자는 승인된 상품을 구매할 수 있는 간단한 쇼핑몰 서버.
## Stack
#### Framework
- NestJS - Typescript
#### DB
- MySQL
#### ORM
- TypeORM
#### Testing Tool
- Jest
#### Deploy
- AWS Beanstalk / Docker
### API Docs
- Swagger UI
## DB Table ERD
![스크린샷 2022-06-02 오후 3 56 30](https://user-images.githubusercontent.com/69755603/171571230-8444d1e0-2d9d-46ba-85c8-5616e9dc3690.png)


## CI/CD Workflow
![스크린샷 2022-06-02 오후 3 54 16](https://user-images.githubusercontent.com/69755603/171570867-47b35702-f1f2-46a8-a55e-4d9ec3e55a61.png)


## Swagger Api Test Flow
#### Swagger Docs [[Link]](http://aconserver-env.eba-w8pietpr.ap-northeast-2.elasticbeanstalk.com:8000/docs/)
> ID: acon 
> PW: 1234

1. 회원가입 API 를 통해 유저 생성 -> 여기서 입력하는 Role 에 따라 접근가능한 API 가 결정됨
2. 로그인 API 에 계정 ID, Password 입력  -> AccessToken 발급
3. 발급된 AccessToken 을 우측 상단 Authorize 버튼을 클릭하여 Bearer Token 에 입력
4. 관리자 Case
   - 나라 추가 API 를 통해 나라 추가
   - 전체 나라 조회 API 를 통해 전체 국가 목록을 확인할 수 있음
   - 검토 대기 상품 조회 API 를 통해 작가가 제출한 검토 대기중인 상품을 조회할 수 있음
   - 상품 검토 및 수정 API 를 통해 상품의 정보를 수정할 수 있음
   - 타 국가 상품 추가 API 를 통해 한국 상품의 정보를 여러 국가의 상품으로 추가할 수 있음
5. 판매자(작가) Case
   - 상품 제출 API 를 통해 작품을 제출할 수 있음
6. 구매자 Case
   - 상품 구매 API 를 통해 검토가 완료된 상품을 구매할 수 있음
7. 모든 유저
   - 나라별 상품 조회 API 를 통해 검토가 완료된 작품 목록을 국가별로 확인할 수 있음

< 자세한 API Response 정보는 Example 옆 Schema 를 통해 확인할 수 있습니다. >