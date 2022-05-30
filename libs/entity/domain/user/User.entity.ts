import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Product } from '../product/Product.entity';
import { Purchase } from '../purchase/Purchase.entity';

@Entity()
export class User extends BaseTimeEntity {
  @Column({
    unique: true,
    nullable: false,
  })
  account: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    nullable: false,
  })
  role: string;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  loggedAt: Date | null;

  @OneToMany(() => Product, (product: Product) => product.Author)
  ProductOwner: Product[];

  @OneToMany(() => Product, (product: Product) => product.Editor)
  ProductInspect: Product[];

  @OneToMany(() => Purchase, (purchase: Purchase) => purchase.User)
  Purchase: Purchase[];
}
