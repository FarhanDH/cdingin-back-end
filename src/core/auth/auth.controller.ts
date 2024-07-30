import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateCustomerRequest,
  CustomerResponse,
} from '../models/customer.model';
import { CustomerService } from '../customer/customer.service';
import { Response } from '../models/api-response.model';
import { ContactService } from '../contact/contact.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly contactService: ContactService,
  ) {}
  private readonly logger: Logger = new Logger(AuthController.name);

  @Post('customers/register')
  async registerCustomer(
    @Body() request: CreateCustomerRequest,
  ): Promise<Response<CustomerResponse>> {
    // is phone and email already registered
    const [isPhoneAlreadyRegistered, isEmailAlreadyRegistered] =
      await Promise.all([
        this.contactService.getContactByPhone(request.phone),
        this.contactService.getContactByEmail(request.email),
      ]);

    if (isPhoneAlreadyRegistered) {
      this.logger.warn('Phone already registered');
      throw new HttpException({ errors: 'Phone already registered' }, 409);
    }

    if (isEmailAlreadyRegistered) {
      this.logger.warn('Email already registered');
      throw new HttpException({ errors: 'Email already registered' }, 409);
    }

    const result = await this.customerService.create(request);
    return {
      message: 'Customer registered successfully',
      data: result,
    };
  }
}
