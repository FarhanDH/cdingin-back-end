import { IsNumberString, Max } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { AcType } from '~/core/ac-type/entities/ac-type.entity';
import { BuildingType } from '~/core/building-type/entities/building-type.entity';
import { Customer } from '~/core/customer/entities/customer.entity';
import { ProblemType } from '~/core/problem-type/entities/problem-type.entity';
import { Technician } from '~/core/technicians/entities/technician.entity';

export enum OrderStatus {
  PENDING = 'pending',
  TAKEN = 'taken',
  TO_LOCATION = 'to_location',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Relation<Customer>;

  @ManyToOne(() => Technician, (technician) => technician.orders, {
    nullable: true,
  })
  technician: Relation<Technician> | null;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  customer_latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  customer_longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detail_location: string;

  @ManyToOne(() => ProblemType, (problemType) => problemType.orders)
  problem_type: Relation<ProblemType>;

  @ManyToOne(() => AcType, (acType) => acType.orders)
  ac_type: Relation<AcType>;

  @Column({ type: 'int', width: 5 })
  @Max(5)
  number_of_units: number;

  @ManyToOne(() => BuildingType, (buildingType) => buildingType.orders)
  building_type: Relation<BuildingType>;

  @Column({ type: 'varchar', length: 2 })
  @IsNumberString()
  building_floor_location: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'date' })
  date_service: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  total_price: number | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  date_created: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_modified: Date;
}
