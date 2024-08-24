import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '~/common/utils';

export class JwtPayload {
  sub: string;
  name: string;
  role: Role;
}

export class LoginRequest {
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
