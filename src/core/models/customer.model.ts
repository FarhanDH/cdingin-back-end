import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';
import { Customer } from '../customer/entities/customer.entity';

export class CreateCustomerRequest {
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

export class UpdateCustomerDto extends PartialType(CreateCustomerRequest) {}

export class CustomerResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_created: Date;
  date_modified: Date;
}

export const toCustomerResponse = (customer: Customer): CustomerResponse => {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    date_created: customer.date_created,
    date_modified: customer.date_modified,
  };
};
