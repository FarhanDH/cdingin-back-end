import { PartialType } from '@nestjs/mapped-types';
import { ProblemType } from '../problem-type/entities/problem-type.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProblemTypeRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;
}

export class UpdateProblemTypeRequest extends PartialType(
  CreateProblemTypeRequest,
) {}

export class ProblemTypeResponse {
  id: number;
  name: string;
  description: string;
  date_created: Date;
}

export const toProblemTypeResponse = (
  problemType: ProblemType,
): ProblemTypeResponse => {
  return {
    id: problemType.id,
    name: problemType.name,
    description: problemType.description,
    date_created: problemType.date_created,
  };
};
