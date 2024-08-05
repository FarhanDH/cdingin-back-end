import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Customer } from '../customer/entities/customer.entity';
import { CreateContactRequest } from './contact.model';

export class CreateCustomerRequest extends CreateContactRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerRequest) {}

export class CustomerResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  date_created: Date;
  date_modified: Date;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}

export const toCustomerResponse = (customer: Customer): CustomerResponse => {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.contact.phone,
    email: customer.contact.email,
    date_created: customer.date_created,
    date_modified: customer.date_modified,
  };
};
