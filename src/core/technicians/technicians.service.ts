import { ConflictException, HttpException, Logger } from '@nestjs/common';
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

    const [checkEmail, checkPhone] = await Promise.all([
      this.isEmailExist(request.email),
      this.isPhoneExist(request.phone),
    ]);

    if (checkEmail) {
      this.logger.warn(`Email ${request.email} already exist`);
      throw new ConflictException('Email already exist');
    }
    if (checkPhone) {
      this.logger.warn(`Phone ${request.phone} already exist`);
      throw new ConflictException('Phone already exist');
    }

    try {
      const user = new Technician();
      user.name = request.name;
      user.email = request.email;
      user.phone = request.phone;
      user.password = await hashSync(request.password, 10);
      const savedTechnician = await this.techniciansRepository.save(user);
      return toTechnicianResponse(savedTechnician);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, 500);
    }
  }

  async isEmailExist(email: string): Promise<Technician | null> {
    this.logger.debug(`TechniciansService.isEmailExist(${email})`);
    const technician = await this.techniciansRepository.findOne({
      where: { email },
    });
    return technician;
  }

  async isPhoneExist(phone: string): Promise<Technician | null> {
    this.logger.debug(`TechniciansService.isPhoneExist(${phone})`);
    const technician = await this.techniciansRepository.findOne({
      where: { phone },
    });
    return technician;
  }
}
