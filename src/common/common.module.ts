import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '~/core/auth/auth.controller';
import { CustomerController } from '~/core/customer/customer.controller';
import { ProblemTypeController } from '~/core/problem-type/problem-type.controller';
import { TechniciansController } from '~/core/technicians/technicians.controller';
import { config } from './config';
import { DatabaseModule } from './database/database.module';
import { AppLoggerMiddleware } from './logger/logger.middleware';
import { AcTypeController } from '~/core/ac-type/ac-type.controller';
import { BuildingTypeController } from '~/core/building-type/building-type.controller';
import { OrderController } from '~/core/order/order.controller';
import { NotificationController } from '~/core/notification/notification.controller';

@Module({
  providers: [],
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
      .forRoutes(
        AcTypeController,
        AuthController,
        BuildingTypeController,
        CustomerController,
        NotificationController,
        OrderController,
        TechniciansController,
        ProblemTypeController,
      );
  }
}
