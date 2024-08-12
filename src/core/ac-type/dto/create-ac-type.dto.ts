import { PartialType } from '@nestjs/mapped-types';
export class CreateAcTypeDto {}

export class UpdateAcTypeDto extends PartialType(CreateAcTypeDto) {}
