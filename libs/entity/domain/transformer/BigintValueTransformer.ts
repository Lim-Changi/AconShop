import { ValueTransformer } from 'typeorm';

// TypeORM 에서 bigint 는 string 으로 처리됨
export class BigintValueTransformer implements ValueTransformer {
  to(entityValue: number): number {
    return entityValue;
  }

  from(databaseValue: string): number {
    return parseInt(databaseValue, 10);
  }
}
