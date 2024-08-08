import { HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import {
  CreateTechnicianRequest,
  TechnicianResponse,
  toTechnicianResponse,
} from '../models/technician.model';
import { Technician } from './entities/technician.entity';
import { Contact } from '../contact/entities/contact.entity';
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly techniciansRepository: Repository<Technician>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger: Logger = new Logger(TechniciansService.name);

  async register(
    request: CreateTechnicianRequest,
  ): Promise<TechnicianResponse> {
    this.logger.debug(
      `TechniciansService.register(${JSON.stringify(request)})`,
    );

    try {
      const savedTechnician: Technician = await this.dataSource.transaction(
        async (entityManager) => {
          const contact = entityManager.create(Contact, {
            phone: request.phone,
            email: request.email,
          });
          await entityManager.save(contact);
          const technician = entityManager.create(Technician, {
            name: request.name,
            date_of_birth: request.dateOfBirth,
            password: hashSync(request.password, 10),
            contact,
          });
          return await entityManager.save(technician);
        },
      );

      this.logger.log(
        `TechnicianService.create(${JSON.stringify(request)}): success`,
      );
      return toTechnicianResponse(savedTechnician);
    } catch (error) {
      this.logger.error(
        `TechnicianService.create(${JSON.stringify(request)}): ${error.message}`,
      );
      throw new HttpException(error.message, 500);
    }
  }
}
