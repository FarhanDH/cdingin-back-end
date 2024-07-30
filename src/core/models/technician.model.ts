import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Technician } from '../technicians/entities/technician.entity';

export class CreateTechnicianRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateTechnicianRequest extends PartialType(
  CreateTechnicianRequest,
) {}

export class TechnicianResponse {
  id: string;
  name: string;
  date_created: Date;
  date_modified: Date;
}

export const toTechnicianResponse = (
  technician: Technician,
): TechnicianResponse => {
  return {
    id: technician.id,
    name: technician.name,
    date_created: technician.date_created,
    date_modified: technician.date_modified,
  };
};
