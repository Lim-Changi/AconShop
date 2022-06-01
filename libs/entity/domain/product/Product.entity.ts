import { Entity, JoinColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Country } from '../country/Country.entity';
import { Purchase } from '../purchase/Purchase.entity';
import { BigintValueTransformer } from '../transformer/BigintValueTransformer';
import { User } from '../user/User.entity';
import { ProductStatus } from './ProductStatusType';

@Entity()
export class Product extends BaseTimeEntity {
  @ManyToOne(() => User, (user: User) => user.ProductOwner, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  Author: User[] | User | string;

  @ManyToOne(() => User, (user: User) => user.ProductInspect, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
  Editor: User[] | User | string;

  @ManyToOne(() => Country, (country: Country) => country.Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  Country: Country[] | Country | string;

  @Column({
    default: ProductStatus.Pending,
    nullable: false,
  })
  status: ProductStatus;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: new BigintValueTransformer(),
    nullable: false,
  })
  price: number;

  @Column('decimal', {
    precision: 3,
    scale: 2,
    nullable: true,
  })
  fee: number;

  @OneToMany(() => Purchase, (purchase: Purchase) => purchase.Product)
  Purchase: Purchase[];

  static submit(title: string, description: string, price: number): Product {
    const product = new Product();
    product.title = title;
    product.description = description;
    product.price = price;
    product.status = ProductStatus.Pending;
    return product;
  }

  static review(
    productId: number,
    title?: string,
    description?: string,
    price?: number,
    fee?: number,
    status?: ProductStatus,
  ): Product {
    const product = new Product();
    product.id = productId;
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (fee) product.fee = fee;
    if (status) product.status = status;

    return product;
  }

  static addForeign(
    productId: number,
    countryId: number,
    title: string,
    description: string,
  ): Product {
    const product = new Product();
    product.id = productId;
    product.Country = countryId.toString();
    product.title = title;
    product.description = description;
    return product;
  }
}
