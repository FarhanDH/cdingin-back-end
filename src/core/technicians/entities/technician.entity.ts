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

@Entity('technicians')
export class Technician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @OneToOne(() => Contact, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE', // Ensures that the contact is deleted when the technician is deleted
  })
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image_key: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  image_url: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  license_plate: string;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @OneToMany(() => Order, (order) => order.technician)
  orders: Relation<Order>[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_modified: Date;
}
