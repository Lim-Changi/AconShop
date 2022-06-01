import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Product } from '../product/Product.entity';
import { User } from '../user/User.entity';

@Entity()
export class Purchase extends BaseTimeEntity {
  @ManyToOne(() => User, (user: User) => user.ProductOwner, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  User: User[] | User | string;

  @ManyToOne(() => Product, (product: Product) => product.Purchase, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  Product: Product[] | Product | string;
}
