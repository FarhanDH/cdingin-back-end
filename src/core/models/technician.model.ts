import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Technician } from '../technicians/entities/technician.entity';
import { CreateContactRequest } from './contact.model';

export class CreateTechnicianRequest extends CreateContactRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/, {
    message: 'License plate number format is invalid',
  })
  licensePlate: string;

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
  license_plate: string;
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
    license_plate: technician.license_plate,
    date_created: technician.date_created,
    date_modified: technician.date_modified,
  };
};
