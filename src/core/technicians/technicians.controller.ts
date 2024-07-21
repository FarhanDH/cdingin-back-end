import { Body, Controller, Post } from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { TechniciansService } from './technicians.service';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post('register')
  async create(@Body() createTechnicianDto: CreateTechnicianDto) {
    await this.techniciansService.register(createTechnicianDto);
    return {
      statusCode: 201,
      data: 'Technician created succesfully',
    };
  }
}
