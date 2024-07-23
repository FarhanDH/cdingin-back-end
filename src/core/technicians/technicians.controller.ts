import { Body, Controller, Post } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import {
  CreateTechnicianRequest,
  TechnicianResponse,
} from '../models/technician.model';
import { Response } from '../models/api-response.model';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Post('register')
  async create(
    @Body() request: CreateTechnicianRequest,
  ): Promise<Response<TechnicianResponse>> {
    const result = await this.techniciansService.register(request);
    return {
      message: 'Technician registered successfully',
      data: result,
    };
  }
}
