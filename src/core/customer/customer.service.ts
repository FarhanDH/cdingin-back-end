import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerRequest } from '../models/customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /** MARK: Register new customer.
   */
  async create(request: CreateCustomerRequest): Promise<Customer> {
    if (await this.isEmailExist(request.email)) {
      throw new ConflictException('email is already exists');
    }
    if (await this.isPhoneExist(request.phone)) {
      throw new ConflictException('phone number is already exists');
    }
    try {
      const user = new Customer();
      user.name = request.name;
      user.email = request.email;
      user.phone = request.phone;
      user.password = hashSync(request.password, 10);
      return await this.customerRepository.save(user).then((user) => {
        delete user.password;
        return user;
      });
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  // MARK: check is email exist
  async isEmailExist(email: string): Promise<Customer> {
    const user = await this.customerRepository.findOne({ where: { email } });
    return user;
  }

  // MARK: check is phone exist
  async isPhoneExist(phone: string): Promise<Customer> {
    const user = await this.customerRepository.findOne({ where: { phone } });
    return user;
  }
}
