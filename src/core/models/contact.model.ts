import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactRequest {
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
