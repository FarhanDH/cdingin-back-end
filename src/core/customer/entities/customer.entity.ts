import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contact } from '~/core/contact/entities/contact.entity';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToOne(() => Contact, {
    cascade: true,
  })
  @JoinColumn()
  contact: Contact;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_modified: Date;
}
