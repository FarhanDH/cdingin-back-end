import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import Redis from 'ioredis';
import { config } from '~/common/config';
import { Role } from '~/common/utils';
import { Customer } from '../customer/entities/customer.entity';
import { JwtPayload, LoginRequest } from '../models/auth.model';
import { CustomerResponse, toCustomerResponse } from '../models/customer.model';
import { Technician } from '../technicians/entities/technician.entity';
import {
  TechnicianResponse,
  toTechnicianResponse,
} from '../models/technician.model';

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
    const customerData = toCustomerResponse(customer);
    return {
      ...customerData,
      tokens: await this.generateTokens(Role.Customer, customer),
    };
  }

  /**
   * Validates a customer's credentials.
   * @param request - Login request.
   * @param customer - Customer entity.
   * @returns Validated customer or null if invalid.
   */
  async validateCustomerCredentials(
    request: LoginRequest,
    customer: Customer,
  ): Promise<Customer | null> {
    this.logger.debug(
      `AuthService.validateCustomerCredentials(\nrequest: ${JSON.stringify(request)}, \ncustomer: ${JSON.stringify(customer)}\n)`,
    );
    if (!(await compare(request.password, customer.password))) {
      return null;
    }
    return customer;
  }

  async generateTokens(
    role: Role,
    user: Customer | Technician,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      role: role,
    };

    // Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // access token expires in 15 minutes
        secret: config().jwtConstants.secretAccessToken,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d', // refresh token expires in 7 days
        secret: config().jwtConstants.secretRefreshToken,
      }),
    ]);

    const isRefreshTokenExistInRedis = await this.redis.get(
      this.refreshTokenKeyRedis(user.id),
    );

    if (isRefreshTokenExistInRedis) {
      await this.redis.del(this.refreshTokenKeyRedis(user.id));
    }

    // Store refresh token in Redis with 7-day TTL
    await this.redis.set(
      this.refreshTokenKeyRedis(user.id),
      refreshToken,
      'EX',
      7 * 24 * 60 * 60, // 7 days in seconds
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(
    user: Customer | Technician,
    refreshToken: string,
  ): Promise<CustomerResponse | TechnicianResponse | null> {
    this.logger.debug(`AuthService.refreshToken(${user.id}, ${refreshToken})`);

    const storedRefreshToken = await this.redis.get(
      this.refreshTokenKeyRedis(user.id),
    );

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return null;
    }

    if (user instanceof Customer) {
      return await this.generateJwtForCustomer(user);
    }
    return await this.generateJwtForTechnician(user);
  }

  async revokeRefreshTokenFromRedis(
    userPayload: JwtPayload,
  ): Promise<JwtPayload> {
    this.logger.debug(
      `AuthService.revokeRefreshTokenFromRedis(${userPayload.sub})`,
    );
    await this.redis.del(this.refreshTokenKeyRedis(userPayload.sub));
    return userPayload;
  }

  private refreshTokenKeyRedis(userId: string): string {
    return `user:${userId}:refreshToken`;
  }

  /**
   * Validates a technician's credentials.
   *
   * @param request - The login request containing the phone number and password.
   * @param technician - The technician entity to validate against.
   *
   * @returns A promise that resolves to the validated technician entity if the credentials are valid,
   *          or `null` if the credentials are invalid.
   *
   * @remarks This function compares the provided password with the hashed password stored in the technician entity.
   *          If the passwords match, the technician entity is returned. Otherwise, `null` is returned.
   */
  async validateTechnicianCredentials(
    request: LoginRequest,
    technician: Technician,
  ): Promise<Technician | null> {
    this.logger.debug(
      `AuthService.validateTechnicianCredentials(\nrequest: ${JSON.stringify(request)}, \ntechnician: ${JSON.stringify(technician)}\n)`,
    );
    if (!(await compare(request.password, technician.password))) {
      return null;
    }
    return technician;
  }

  async generateJwtForTechnician(
    technician: Technician,
  ): Promise<TechnicianResponse> {
    const technicianData = toTechnicianResponse(technician);
    return {
      ...technicianData,
      tokens: await this.generateTokens(Role.Technician, technician),
    };
  }
}
