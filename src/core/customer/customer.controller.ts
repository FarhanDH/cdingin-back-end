import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Register a new customer with the provided customer data.
   *
   * @method POST
   * @param {CreateCustomerDto} createCustomerDto - the data for creating a new customer
   * @return {Promise<ApiResponse<string>>} the API response indicating successful customer creation
   */
  @Post('register')
  async register(@Body() createCustomerDto: CreateCustomerDto) {
    await this.customerService.create(createCustomerDto);
    return {
      statusCode: 201,
      data: 'Customer created succesfully',
    };
  }
}
