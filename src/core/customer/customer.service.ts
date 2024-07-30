import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import {
  CreateCustomerRequest,
  CustomerResponse,
  toCustomerResponse,
} from '../models/customer.model';
import { Customer } from './entities/customer.entity';

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

    try {
      const user = new Customer();
      user.name = request.name;
      user.password = hashSync(request.password, 10);
      const savedUser = await this.customerRepository.save(user);
      return toCustomerResponse(savedUser);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
