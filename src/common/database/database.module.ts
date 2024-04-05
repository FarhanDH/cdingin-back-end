import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }), // env configuration
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: config().database.host,
    //   port: parseInt(config().database.port),
    //   username: config().database.username,
    //   password: config().database.password,
    //   database: config().database.name,
    //   url: config().database.url,
    // entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    // entities: ['dist/**/*.entity.js'],
    //   migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
    //   autoLoadEntities: true,
    //   migrationsRun: true,
    //   synchronize: true, // remove when production
    //   logging: true, // remove when production
    //   ssl: true,
    //   extra: { ssl: { rejectUnauthorized: false, require: true } },
    // }),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
})
export class DatabaseModule {}
