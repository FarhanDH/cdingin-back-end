import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactRequest {
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
