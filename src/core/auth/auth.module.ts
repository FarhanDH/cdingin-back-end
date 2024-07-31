import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '~/common/config';
import { ContactModule } from '../contact/contact.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CustomerModule,
    ContactModule,
    JwtModule.register({
      global: true,
      secret: config().secret.secretTokenKey,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
