import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProblemTypeService } from './problem-type.service';
import {
  CreateProblemTypeRequest,
  UpdateProblemTypeRequest,
} from '../models/problem-type.model';
@Controller('problem-type')
export class ProblemTypeController {
  constructor(private readonly problemTypeService: ProblemTypeService) {}

  @Post()
  create(@Body() request: CreateProblemTypeRequest) {
    return this.problemTypeService.create(request);
  }

  @Get()
  findAll() {
    return this.problemTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() requestBody: UpdateProblemTypeRequest,
  ) {
    return this.problemTypeService.update(+id, requestBody);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemTypeService.remove(+id);
  }
}
