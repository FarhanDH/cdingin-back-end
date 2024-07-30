import { HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import {
  CreateTechnicianRequest,
  TechnicianResponse,
  toTechnicianResponse,
} from '../models/technician.model';
import { Technician } from './entities/technician.entity';
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly techniciansRepository: Repository<Technician>,
  ) {}
  private readonly logger: Logger = new Logger(TechniciansService.name);

  async register(
    request: CreateTechnicianRequest,
  ): Promise<TechnicianResponse> {
    this.logger.debug(
      `TechniciansService.register(${JSON.stringify(request)})`,
    );

    try {
      const user = new Technician();
      user.name = request.name;
      user.password = hashSync(request.password, 10);
      const savedTechnician = await this.techniciansRepository.save(user);
      return toTechnicianResponse(savedTechnician);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, 500);
    }
  }
}
