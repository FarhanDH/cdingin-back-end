import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ unique: true, name: 'no_hp' })
  noHp: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
