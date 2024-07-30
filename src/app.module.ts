import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { CustomerModule } from './core/customer/customer.module';
import { TechniciansModule } from './core/technicians/technicians.module';
import { ContactModule } from './core/contact/contact.module';

@Module({
  imports: [CommonModule, CustomerModule, TechniciansModule, ContactModule],
  controllers: [AppController],
})
export class AppModule {}
