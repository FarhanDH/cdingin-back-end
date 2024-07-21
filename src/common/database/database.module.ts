import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }), // env configuration
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
})
export class DatabaseModule {}
