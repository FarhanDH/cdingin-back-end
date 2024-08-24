import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Contact } from '~/core/contact/entities/contact.entity';
import { Order } from '~/core/order/entities/order.entity';
import { Notification } from '~/core/notification/entities/notification.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToOne(() => Contact, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Relation<Order>[];

  @OneToMany(() => Notification, (notification) => notification.customer)
  notifications: Relation<Notification>[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_modified: Date;
}
