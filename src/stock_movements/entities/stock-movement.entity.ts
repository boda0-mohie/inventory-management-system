import { Product } from 'src/products/entities/product.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { MovementType } from 'utils/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true, nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // The user who recorded the movement
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Optional supplier for IN movements
  @ManyToOne(() => Supplier, { eager: true, nullable: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  previous_stock: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  new_stock: number;

  // Optional reference like a PO number or invoice ID
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  reference: string;

  // Any additional notes
  @Column({
    type: 'text',
    nullable: true,
  })
  remarks: string;

  @CreateDateColumn()
  created_at: Date;
}
