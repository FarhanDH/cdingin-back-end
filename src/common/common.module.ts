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
        CustomerController,
        TechniciansController,
        ProblemTypeController,
      );
  }
}
