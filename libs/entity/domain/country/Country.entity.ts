import { Column, Entity, OneToMany } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Product } from '../product/Product.entity';

@Entity()
export class Country extends BaseTimeEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column('decimal', { precision: 10, scale: 5, nullable: false })
  exchangeRate: number;

  @Column({
    nullable: false,
  })
  currency: string;

  @OneToMany(() => Product, (product: Product) => product.Country)
  Product: Product[];
}
