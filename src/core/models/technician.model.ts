import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Technician } from '../technicians/entities/technician.entity';
import { CreateContactRequest } from './contact.model';

export class CreateTechnicianRequest extends CreateContactRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

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
  date_of_birth: Date;
  phone: string;
  email: string;
  date_created: Date;
  date_modified: Date;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}

export const toTechnicianResponse = (
  technician: Technician,
): TechnicianResponse => {
  return {
    id: technician.id,
    name: technician.name,
    date_of_birth: technician.date_of_birth,
    phone: technician.contact.phone,
    email: technician.contact.email,
    date_created: technician.date_created,
    date_modified: technician.date_modified,
  };
};
