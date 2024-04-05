import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../config';
import { configDotenv } from 'dotenv';

configDotenv();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config().database.host,
  port: parseInt(config().database.port),
  username: config().database.username,
  password: config().database.password,
  database: config().database.name,
  url: config().database.url,
  entities: ['dist/**/*.entity.js'],
  migrations: [`dist/common/database/migrations/*.js`],
  logging: true, // remove when production
  synchronize: false, // remove when production use migrations instead of synchronize
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
