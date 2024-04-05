import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { CustomerModule } from './core/customer/customer.module';

@Module({
  imports: [CommonModule, CustomerModule],
  controllers: [AppController],
})
export class AppModule {}
