import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppLoggerMiddleware } from './logger.middleware';
import { config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }), // env configuration
    DatabaseModule,
  ],
  exports: [ConfigModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
