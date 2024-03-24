import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { config } from '../config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.dbHost,
  port: Number(config.dbPort),
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  // url: config.dbUrl,
  // entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  // migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  //   autoLoadEntities: true,
  // options,
  synchronize: true, // remove when production
  migrationsRun: true,
  logging: true, // remove when production
  ssl: true,
  extra: { ssl: { rejectUnauthorized: false } },
});
