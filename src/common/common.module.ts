import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { DatabaseModule } from './database/database.module';
import { AppLoggerMiddleware } from './logger/logger.middleware';
import { AuthController } from '~/core/auth/auth.controller';
import { CustomerController } from '~/core/customer/customer.controller';
import { TechniciansController } from '~/core/technicians/technicians.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './logger/response.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }), // env configuration
    DatabaseModule,
  ],
  exports: [ConfigModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes(AuthController, CustomerController, TechniciansController);
  }
}
