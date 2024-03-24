import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CustomerModule } from './core/customer/customer.module';

@Module({
  imports: [CommonModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
