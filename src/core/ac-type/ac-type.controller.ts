import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcTypeService } from './ac-type.service';
import { CreateAcTypeDto } from './dto/create-ac-type.dto';
import { UpdateAcTypeDto } from './dto/update-ac-type.dto';

@Controller('ac-type')
export class AcTypeController {
  constructor(private readonly acTypeService: AcTypeService) {}

  @Post()
  create(@Body() createAcTypeDto: CreateAcTypeDto) {
    return this.acTypeService.create(createAcTypeDto);
  }

  @Get()
  findAll() {
    return this.acTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcTypeDto: UpdateAcTypeDto) {
    return this.acTypeService.update(+id, updateAcTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acTypeService.remove(+id);
  }
}
