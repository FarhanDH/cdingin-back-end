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

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger: Logger = new Logger(CustomerService.name);

  /** MARK: Register new customer.
   */
  async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    this.logger.debug(`CustomerService.create(${JSON.stringify(request)})`);

    try {
      // Transaction save customer and contact data
      const savedCustomer: Customer = await this.dataSource.transaction(
        async (entityManager) => {
          const contact = await entityManager.create(Contact, {
            phone: request.phone,
            email: request.email,
          });
          await entityManager.save(contact);
          const customer = await entityManager.create(Customer, {
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
}
