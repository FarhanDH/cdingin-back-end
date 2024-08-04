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
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { config } from '~/common/config';

/**
 * Service responsible for handling authentication.
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param jwtService - JWT service instance.
   * @param redis - Redis client instance.
   */
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * Logger instance for this service.
   */
  private readonly logger: Logger = new Logger(AuthService.name);

  /**
   * Generates a JWT for a customer and stores the refresh token in Redis.
   * @param customer - Customer entity.
   * @returns Customer response with JWT token.
   */
  async generateJwtForCustomer(customer: Customer): Promise<CustomerResponse> {
    const payload: JwtPayload = {
      id: customer.id,
      name: customer.name,
      role: 'customer',
    };

    const customerData = toCustomerResponse(customer);

    // Generate refresh token with 7-day expiration
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: config().jwtConstants.secretRefreshToken,
    });

    const isRefreshTokenExistInRedis = await this.redis.get(
      `user:${customer.id}:refreshToken`,
    );
    if (isRefreshTokenExistInRedis) {
      await this.redis.del(`user:${customer.id}:refreshToken`);
    }

    // Store refresh token in Redis with 7-day TTL
    await this.redis.set(
      `user:${customer.id}:refreshToken`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60, // 7 days in seconds
    );

    return {
      ...customerData,
      token: {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
          secret: config().jwtConstants.secretAccessToken,
        }),
        refresh_token: refreshToken,
      },
    };
  }

  /**
   * Validates a customer's credentials.
   * @param request - Login request.
   * @param customer - Customer entity.
   * @returns Validated customer or null if invalid.
   */
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
