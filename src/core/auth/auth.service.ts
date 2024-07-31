import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from '../models/auth.model';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../customer/entities/customer.entity';
import {
  CustomerResponse,
  LoginCustomerRequest,
  toCustomerResponse,
} from '../models/customer.model';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  private readonly logger: Logger = new Logger(AuthService.name);
  async generateJwtForCustomer(customer: Customer): Promise<CustomerResponse> {
    const payload: JwtPayload = {
      id: customer.id,
      name: customer.name,
      role: 'customer',
    };

    const customerData = toCustomerResponse(customer);
    return {
      ...customerData,
      token: {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '5h',
        }),
        expires_in: 5 * 3600,
      },
    };
  }

  async validateCustomer(
    request: LoginCustomerRequest,
    customer: Customer,
  ): Promise<Customer | null> {
    this.logger.debug(
      `AuthService.validateCustomer(\nrequest: ${JSON.stringify(request)}, \ncustomer: ${JSON.stringify(customer)}\n)`,
    );
    if (!(await compare(request.password, customer.password))) {
      return null;
    }
    return customer;
  }
}
