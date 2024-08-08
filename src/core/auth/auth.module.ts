import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ContactModule } from '../contact/contact.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
  imports: [
    CustomerModule,
    ContactModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenGuard],
})
export class AuthModule {}
