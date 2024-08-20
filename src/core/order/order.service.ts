import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  CreateOrderRequest,
  OrderResponse,
  toOrderResponse,
} from '../models/order.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  private readonly logger: Logger = new Logger(OrderService.name);
  async create(
    customerId: string,
    requestBody: CreateOrderRequest,
  ): Promise<OrderResponse> {
    this.logger.debug(`OrderService.create(${JSON.stringify(requestBody)})`);
    try {
      const createdOrder: Order = this.orderRepository.create({
        id: undefined,
        customer: {
          id: customerId,
        },
        technician: undefined,
        customer_latitude: requestBody.customerLatitude,
        customer_longitude: requestBody.customerLongitude,
        detail_location: requestBody.detailLocation,
        problem_type: {
          id: requestBody.problemTypeId,
        },
        ac_type: {
          id: requestBody.acTypeId,
        },
        number_of_units: requestBody.numberOfUnits,
        building_type: {
          id: requestBody.buildingTypeId,
        },
        building_floor_location: requestBody.buildingFloorLocation,
        date_service: requestBody.dateService,
      });
      const savedOrder: Order = await this.orderRepository.save(createdOrder);
      const result: Order | null = await this.getOneById(savedOrder.id);
      if (!result) {
        throw new HttpException({ errors: 'Order Not Found' }, 404);
      }
      this.logger.log(
        `OrderService.create(${JSON.stringify(requestBody)}): success`,
      );
      console.log(result);
      return toOrderResponse(result);
    } catch (error) {
      this.logger.error(
        `OrderService.create(${JSON.stringify(requestBody)}): ${error.message}`,
      );
      throw new HttpException({ errors: error.message }, 500);
    }
  }

  async getOneById(id: string): Promise<Order | null> {
    this.logger.debug(`OrderService.getOneById(${id})`);
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        technician: true,
        ac_type: true,
        problem_type: true,
        building_type: true,
      },
    });
    if (!order) return null;
    return order;
  }
}
