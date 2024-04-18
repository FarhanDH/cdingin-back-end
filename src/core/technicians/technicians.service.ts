import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { Technician } from './entities/technician.entity';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private readonly techniciansRepository: Repository<Technician>,
  ) {}

  async register(createTechnicianDto: CreateTechnicianDto) {
    try {
      const user = new Technician();
      user.firstName = createTechnicianDto.firstName;
      user.lastName = createTechnicianDto.lastName;
      user.fullName = `${createTechnicianDto.firstName} ${createTechnicianDto.lastName}`;
      user.email = createTechnicianDto.email;
      user.phoneNumber = createTechnicianDto.phoneNumber;
      user.password = await hashSync(createTechnicianDto.password, 10);
      return await this.techniciansRepository.save(user);
    } catch (e) {
      throw new ConflictException('email or phone number is already exists');
    }
  }
}
