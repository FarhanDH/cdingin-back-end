import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';

@Module({
  imports: [
    // database config
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.dbHost,
      port: Number(config.dbPort),
      username: config.dbUsername,
      password: config.dbPassword,
      database: config.dbName,
      url: config.dbUrl,
      // entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      // migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
      autoLoadEntities: true,
      // options,
      synchronize: true, // remove when production
      migrationsRun: true,
      logging: true, // remove when production
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false, require: true } },
    }),
  ],
})
export class DatabaseModule {}
