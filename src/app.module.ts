import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './core/auth/auth.module';
import { ContactModule } from './core/contact/contact.module';
import { CustomerModule } from './core/customer/customer.module';
import { TechniciansModule } from './core/technicians/technicians.module';

@Module({
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
  ],
  imports: [
    CommonModule,
    CustomerModule,
    TechniciansModule,
    ContactModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
