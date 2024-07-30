import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerModule } from '../customer/customer.module';
import { ContactModule } from '../contact/contact.module';

@Module({
  imports: [CustomerModule, ContactModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
