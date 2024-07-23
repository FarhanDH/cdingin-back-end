import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';
import { Technician } from '../technicians/entities/technician.entity';

export class CreateTechnicianRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  phone: string;

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
  email: string;
  phone: string;
  date_created: Date;
  date_modified: Date;
}

export const toTechnicianResponse = (
  technician: Technician,
): TechnicianResponse => {
  return {
    id: technician.id,
    name: technician.name,
    email: technician.email,
    phone: technician.phone,
    date_created: technician.date_created,
    date_modified: technician.date_modified,
  };
};
