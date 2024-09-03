import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Customer } from '~/core/customer/entities/customer.entity';
import { Technician } from '~/core/technicians/entities/technician.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @ManyToOne(() => Customer, (customer) => customer.notifications, {
    nullable: true,
  })
  customer: Relation<Customer> | null;

  @ManyToOne(() => Technician, (technician) => technician.notifications, {
    nullable: true,
  })
  technician: Relation<Technician> | null;
}
