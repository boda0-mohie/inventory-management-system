import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { PurchaseStatus } from 'utils/enum';
import { PurchaseItem } from './purchase-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, { nullable: false, eager: true })
  supplier: Supplier;

  @Column({ enum: PurchaseStatus, nullable: false, default: PurchaseStatus.PENDING })
  status: PurchaseStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_price: number;

  @ManyToOne(() => User, { nullable: false, eager: true })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true, eager: true })
  items: PurchaseItem[];
}
