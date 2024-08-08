import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from '~/common/utils';
import { ContactService } from '../contact/contact.service';
import { CustomerService } from '../customer/customer.service';
import { Response } from '../models/api-response.model';
import { LoginCustomerRequest } from '../models/auth.model';
import {
  CreateCustomerRequest,
  CustomerResponse,
} from '../models/customer.model';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly contactService: ContactService,
    private readonly refreshTokenGuard: RefreshTokenGuard,
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

  @HttpCode(HttpStatus.OK)
  @Post('customers/login')
  async loginCustomer(
    @Body() request: LoginCustomerRequest,
  ): Promise<Response<CustomerResponse>> {
    this.logger.debug(
      `AuthController.loginCustomer(\nrequest: ${JSON.stringify(request)}\n)`,
    );
    const customer = await this.customerService.getCustomerByPhone(
      request.phone,
    );
    if (!customer) {
      this.logger.error('Customer not found');
      throw new HttpException({ errors: 'Customer not found' }, 404);
    }
    const isCustomerValid = await this.authService.validateCustomerCredentials(
      request,
      customer,
    );
    if (!isCustomerValid) {
      this.logger.error('Phone or password is wrong');
      throw new HttpException({ errors: 'Phone or password is wrong' }, 401);
    }

    const result =
      await this.authService.generateJwtForCustomer(isCustomerValid);
    this.logger.log(
      `AuthController.loginCustomer(\nrequest: ${JSON.stringify(request)}\n): success`,
    );
    return {
      message: 'Customer logged in successfully',
      data: result,
    };
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('logout')
  async logout(
    @Request() request: RequestWithUser,
  ): Promise<Response<boolean>> {
    console.log(request.user);
    this.logger.debug(
      `AuthController.logout(\nrequest: ${JSON.stringify(request.user)}\n)`,
    );
    try {
      await this.authService.revokeRefreshTokenFromRedis(request.user);
      this.logger.log(
        `AuthController.logout(\nrequest: ${JSON.stringify(request.user)}\n): Success`,
      );
      return {
        message: 'User logged out successfully',
        data: true,
      };
    } catch (error) {
      this.logger.error(
        `AuthController.logout(\nrequest: ${JSON.stringify(request.user)}\n): ${error.message}`,
      );
      throw new HttpException({ errors: error.message }, 500);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshTokenCustomer(
    @Request() request: RequestWithUser,
  ): Promise<Response<CustomerResponse> | undefined> {
    this.logger.debug(
      `AuthController.refreshTokenCustomer(\nrequest: ${JSON.stringify(request.user)}\n)`,
    );

    const customerData = await this.customerService.getCustomerById(
      request.user.sub,
    );
    if (!customerData) {
      throw new NotFoundException('Customer not found');
    }
    const refreshToken =
      this.refreshTokenGuard.extractRefreshTokenFromHeader(request);
    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }
    const result = await this.authService.refreshTokenCustomer(
      customerData,
      refreshToken,
    );
    if (!result) {
      this.logger.error('Refresh token is invalid or expired');
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    this.logger.log(
      `AuthController.refreshTokenCustomer(\nrequest: ${JSON.stringify(request.user)}\n): Success`,
    );
    return {
      message: 'Customer refreshed token successfully',
      data: result,
    };
  }
}
