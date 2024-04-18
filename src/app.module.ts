import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { CustomerModule } from './core/customer/customer.module';
import { TechniciansModule } from './core/technicians/technicians.module';

@Module({
  imports: [CommonModule, CustomerModule, TechniciansModule],
  controllers: [AppController],
})
export class AppModule {}
