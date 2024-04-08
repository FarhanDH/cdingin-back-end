import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /** MARK: Register new customer.
   * Register a new customer with the provided customer data.
   *
   * @param {CreateCustomerDto} createCustomerDto - the data for creating a new customer
   * @return {Promise<Customer>} the newly created customer if user registration is successful
   * @throws {ConflictException} if the email or phone number is already registered
   */
  async register(createCustomerDto: CreateCustomerDto) {
    try {
      const user = new Customer();
      user.firstName = createCustomerDto.firstName;
      user.lastName = createCustomerDto.lastName;
      user.fullName = `${createCustomerDto.firstName} ${createCustomerDto.lastName}`;
      user.email = createCustomerDto.email;
      user.phoneNumber = createCustomerDto.phoneNumber;
      user.password = await hashSync(createCustomerDto.password, 10);
      return await this.customerRepository.save(user);
    } catch (e) {
      throw new ConflictException('email or phone number is already exists');
    }
  }
}
