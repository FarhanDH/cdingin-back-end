import { Module } from '@nestjs/common';
import { BuildingTypeService } from './building-type.service';
import { BuildingTypeController } from './building-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingType } from './entities/building-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BuildingType])],
  controllers: [BuildingTypeController],
  providers: [BuildingTypeService],
})
export class BuildingTypeModule {}
