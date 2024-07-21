import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerRequest,
  CustomerResponse,
} from '../models/customer.model';
import { Response } from '../models/api-response.model';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  async register(
    @Body() request: CreateCustomerRequest,
  ): Promise<Response<CustomerResponse>> {
    const result = await this.customerService.create(request);
    return {
      message: 'Customer registered successfully',
      data: result,
    };
  }
}
