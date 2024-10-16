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
import { RequestWithUser, Role } from '~/common/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Response } from '../models/api-response.model';
import { CreateOrderRequest, OrderResponse } from '../models/order.model';
import { OrderService } from './order.service';
import { NotificationService } from '../notification/notification.service';
import { TechniciansService } from '../technicians/technicians.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly orderService: OrderService,
    private readonly technicianService: TechniciansService,
  ) {}
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
    const [orderResult, availableTechniciansIds] = await Promise.all([
      this.orderService.create(request.user.sub, requestBody),
      this.technicianService.getAvailableTechnicianIds(),
    ]);

    // Prepare notification request
    const notificationRequest = {
      title: 'Ada order baru',
      body: `Ada order baru dari ${orderResult.customer.name}.`,
    };
    // Push notification to available technicians
    await this.notificationService.create(
      availableTechniciansIds,
      notificationRequest,
      Role.Technician,
    );

    this.logger.log(
      `OrderController.create(${JSON.stringify(requestBody)}): success`,
    );
    return {
      message: 'Order created successfully',
      data: orderResult,
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
