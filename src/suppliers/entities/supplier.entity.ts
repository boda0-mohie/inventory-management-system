import { User } from 'src/users/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  // Name: This is the name of the supplier
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  // Contact Person: This is the name of the person who will be in touch with the supplier
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contact_person: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
