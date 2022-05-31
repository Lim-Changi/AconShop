import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Product } from '../product/Product.entity';
import { Purchase } from '../purchase/Purchase.entity';
import { genSalt, hash } from 'bcrypt';

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
  role: number;

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

  static async signup(
    accountId: string,
    password: string,
    role: number,
  ): Promise<User> {
    const salt = await genSalt();
    const user = new User();
    user.account = accountId;
    user.password = await hash(password, salt);
    user.role = role;
    return user;
  }

  static login(accountId: string, password: string): User {
    const user = new User();
    user.account = accountId;
    user.password = password;
    user.loggedAt = new Date();
    return user;
  }
}
