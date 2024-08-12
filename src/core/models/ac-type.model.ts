import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AcType } from '../ac-type/entities/ac-type.entity';
export class CreateAcTypeRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;
}

export class UpdateAcTypeRequest extends PartialType(CreateAcTypeRequest) {}

export class AcTypeResponse {
  id: number;
  name: string;
  description: string;
  date_created: Date;
}

export const toAcTypeResponse = (acType: AcType) => {
  return {
    id: acType.id,
    name: acType.name,
    description: acType.description,
    date_created: acType.date_created,
  };
};
