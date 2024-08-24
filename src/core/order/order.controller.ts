import {
  Body,
  Controller,
  HttpException,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest, OrderResponse } from '../models/order.model';
import { Response } from '../models/api-response.model';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser, Role } from '~/common/utils';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  private readonly logger: Logger = new Logger(OrderController.name);

  @UseGuards(JwtGuard)
  @Post('create')
  async create(
    @Request() request: RequestWithUser,
    @Body() requestBody: CreateOrderRequest,
  ): Promise<Response<OrderResponse>> {
    this.logger.debug(
      `OrderController.create(\nuser: ${JSON.stringify(request.user)}, \nrequestBody: ${JSON.stringify(requestBody)}\n)`,
    );
    if (request.user.role === Role.Technician) {
      throw new HttpException({ errors: 'User role invalid' }, 403);
    }
    const order = await this.orderService.create(request.user.sub, requestBody);
    this.logger.log(
      `OrderController.create(${JSON.stringify(requestBody)}): success`,
    );
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  @UseGuards(JwtGuard)
  @Patch(':id/take')
  async take(
    @Request() request: RequestWithUser,
    @Param('id') orderId: string,
  ): Promise<Response<OrderResponse>> {
    this.logger.debug(
      `OrderController.take(\nuser: ${JSON.stringify(request.user)}, \norderId: ${orderId}\n)`,
    );
    const order = await this.orderService.take(orderId, request.user);
    this.logger.log(`OrderController.take(${orderId}): success`);
    return {
      message: ` Order successfully taken by ${order.technician?.name}`,
      data: order,
    };
  }
}
