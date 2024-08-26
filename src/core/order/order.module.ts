import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NotificationModule } from '../notification/notification.module';
import { TechniciansModule } from '../technicians/technicians.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    NotificationModule,
    TechniciansModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
