import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['*'],
  });
  app.setGlobalPrefix('api');
  const logger: Logger = new Logger('Info');
  await app
    .listen(config().serverPort)
    .then(() => logger.log(`server started 🚀 on port ${config().serverPort}`));
}
bootstrap();
