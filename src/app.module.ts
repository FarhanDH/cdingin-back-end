import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { AuthModule } from './core/auth/auth.module';
import { ContactModule } from './core/contact/contact.module';
import { CustomerModule } from './core/customer/customer.module';
import { TechniciansModule } from './core/technicians/technicians.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { config } from './common/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ProblemTypeModule } from './core/problem-type/problem-type.module';
import { ResponseInterceptor } from './common/response.interceptor';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],

  imports: [
    CommonModule,
    CustomerModule,
    TechniciansModule,
    ContactModule,
    AuthModule,
    RedisModule.forRoot({
      type: 'single',
      url: config().redis.url,
    }),
    ProblemTypeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
