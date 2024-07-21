import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

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

export class CustomerResponse {
  name: string;
  email: string;
  phone: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerRequest) {}
