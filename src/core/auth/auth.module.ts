import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ContactModule } from '../contact/contact.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TechniciansModule } from '../technicians/technicians.module';

@Module({
  imports: [
    CustomerModule,
    ContactModule,
    JwtModule.register({
      global: true,
    }),
    TechniciansModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenGuard],
})
export class AuthModule {}
