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
  Author: User[] | User | number;

  @ManyToOne(() => User, (user: User) => user.ProductInspect, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
  Editor: User[] | User | number;

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
  status: number;

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

  @Column({
    type: 'bigint',
    transformer: new BigintValueTransformer(),
    nullable: false,
  })
  price: number;

  @OneToMany(() => Purchase, (purchase: Purchase) => purchase.Product)
  Purchase: Purchase[];
}
