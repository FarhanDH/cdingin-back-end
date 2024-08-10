import { PartialType } from '@nestjs/mapped-types';

export class CreateProblemTypeRequest {}

export class UpdateProblemTypeRequest extends PartialType(
  CreateProblemTypeRequest,
) {}
