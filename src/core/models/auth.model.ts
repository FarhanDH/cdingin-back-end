import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class JwtPayload {
  sub: string;
  name: string;
  role: string;
}

export class LoginCustomerRequest {
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
