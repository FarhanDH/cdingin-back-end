import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BuildingType } from '../building-type/entities/building-type.entity';

export class CreateBuildingTypeRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}

export class UpdateBuildingTypeRequest extends PartialType(
  CreateBuildingTypeRequest,
) {}

export class BuildingTypeResponse {
  id: number;
  name: string;
  date_created: Date;
  date_modified: Date;
}

export const toBuildingTypeResponse = (buildingType: BuildingType) => {
  return {
    id: buildingType.id,
    name: buildingType.name,
    date_created: buildingType.date_created,
    date_modified: buildingType.date_modified,
  };
};
