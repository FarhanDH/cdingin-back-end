import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ac_types')
export class AcType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;
}
