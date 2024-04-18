import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'technicians' })
export class Technician {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'first_name', type: 'text' })
  firstName: string;

  @Column({ name: 'last_name', type: 'text' })
  lastName: string;

  @Column({ name: 'full_name', type: 'text' })
  fullName: string;

  @Column({ unique: true, name: 'phone_number', type: 'text' })
  phoneNumber: string;

  @Column({ unique: true, name: 'email', type: 'text' })
  email: string;

  @Column({ name: 'password', type: 'text' })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'text' })
  createdAt: Date;
}
