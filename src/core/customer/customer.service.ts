import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import {
  CreateCustomerRequest,
  CustomerResponse,
  toCustomerResponse,
} from '../models/customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
  private readonly logger: Logger = new Logger(CustomerService.name);

  /** MARK: Register new customer.
   */
  async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    this.logger.debug(`CustomerService.create(${JSON.stringify(request)})`);

    // check email and phone already exist
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
      const user = new Customer();
      user.name = request.name;
      user.email = request.email;
      user.phone = request.phone;
      user.password = hashSync(request.password, 10);
      const savedUser = await this.customerRepository.save(user);
      return toCustomerResponse(savedUser);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  // MARK: check is email exist
  async isEmailExist(email: string): Promise<Customer | null> {
    const user = await this.customerRepository.findOne({ where: { email } });
    return user;
  }

  // MARK: check is phone exist
  async isPhoneExist(phone: string): Promise<Customer | null> {
    const user = await this.customerRepository.findOne({ where: { phone } });
    return user;
  }
}
