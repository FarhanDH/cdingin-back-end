import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Order } from '~/core/order/entities/order.entity';

@Entity('problem_types')
export class ProblemType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @OneToMany(() => Order, (order) => order.problem_type)
  orders: Relation<Order>[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_modified: Date;
}
