import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import {
  CreateCustomerRequest,
  CustomerResponse,
  toCustomerResponse,
} from '../models/customer.model';
import { Customer } from './entities/customer.entity';
import { Contact } from '../contact/entities/contact.entity';

/**
 * Customer Service
 *
 * Provides methods for creating and managing customers.
 */
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger: Logger = new Logger(CustomerService.name);

  /**
   * Register a new customer.
   *
   * @param request - The customer creation request.
   * @returns The created customer response.
   *
   * @example
   * const request: CreateCustomerRequest = {
   *   name: 'John Doe',
   *   email: 'john.doe@example.com',
   *   phone: '1234567890',
   *   password: 'password123',
   * };
   * const customerResponse: CustomerResponse = await customerService.create(request);
   */
  async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    this.logger.debug(`CustomerService.create(${JSON.stringify(request)})`);

    try {
      // Transaction save customer and contact data
      const savedCustomer: Customer = await this.dataSource.transaction(
        async (entityManager) => {
          const contact = entityManager.create(Contact, {
            phone: request.phone,
            email: request.email,
          });
          await entityManager.save(contact);
          const customer = entityManager.create(Customer, {
            name: request.name,
            password: hashSync(request.password, 10),
            contact,
          });
          return await entityManager.save(customer);
        },
      );

      this.logger.log(
        `CustomerService.create(${JSON.stringify(request)}): success`,
      );
      return toCustomerResponse(savedCustomer);
    } catch (error) {
      this.logger.error(
        `CustomerService.create(${JSON.stringify(request)}): ${error}`,
      );
      throw new HttpException({ errors: error.message }, 500);
    }
  }

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    this.logger.debug(`CustomerService.getCustomerByPhone(${phone})`);
    return await this.customerRepository.findOne({
      where: { contact: { phone } },
      relations: {
        contact: true,
      },
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    this.logger.debug(`CustomerService.getCustomerById(${id})`);
    return await this.customerRepository.findOne({
      where: { id },
      relations: {
        contact: true,
      },
    });
  }
}
