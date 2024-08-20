import { configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../config';
import { DatabaseLogger } from '../logger/database.logger';

configDotenv();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.username,
  password: config().database.password,
  database: config().database.name,
  url: config().database.url,
  entities: ['dist/**/*.entity.js'],
  // entities: ['dist/core/entities/index.js'],
  migrations: [`dist/common/database/migrations/*.js`],
  logger: new DatabaseLogger(),
  // logging: true, // remove when production
  // synchronize: false, // remove when production use migrations instead of synchronize
  ssl: true, // remove when work on local
  extra: { ssl: { rejectUnauthorized: true, require: true } }, // remove when work on local
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
