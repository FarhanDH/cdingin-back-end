import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  CreateOrderRequest,
  OrderResponse,
  toOrderResponse,
} from '../models/order.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Not, Repository } from 'typeorm';
import { JwtPayload } from '../models/auth.model';
import { Role } from '~/common/utils';
import { NotificationService } from '../notification/notification.service';

/**
 * OrderService is a service class that handles order related operations.
 */
@Injectable()
export class OrderService {
  /**
   * The repository for Order entity.
   */
  private readonly orderRepository: Repository<Order>;

  /**
   * The logger for OrderService.
   */
  private readonly logger: Logger = new Logger(OrderService.name);

  /**
   * OrderService constructor.
   * @param orderRepository The repository for Order entity.
   */
  constructor(
    @InjectRepository(Order)
    orderRepository: Repository<Order>,
    private readonly notificationService: NotificationService,
  ) {
    this.orderRepository = orderRepository;
  }

  /**
   * Create a new order.
   * @param customerId The ID of the customer.
   * @param requestBody The request body containing order details.
   * @returns A promise that resolves to the created order.
   * @throws HttpException if order is not found.
   */
  async create(
    customerId: string,
    requestBody: CreateOrderRequest,
  ): Promise<OrderResponse> {
    this.logger.debug(`OrderService.create(${JSON.stringify(requestBody)})`);
    try {
      // throw exception if customer still have order that not yet completed
      const order = await this.getOneByCustomerId(customerId);
      if (order && order.status !== OrderStatus.COMPLETED) {
        this.logger.warn(`Customer still have order that not yet completed`);
        throw new HttpException(
          { errors: 'Customer still have order that not yet completed' },
          400,
        );
      }

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

      // Prepare notification request
      const notificationRequest = {
        title: 'Your order is complete',
        body: `Your order with ID ${result.id} has been completed successfully.`,
      };
      // Push notification to customer
      await this.notificationService.create(
        customerId,
        notificationRequest,
        'customer',
      );

      this.logger.log(
        `OrderService.create(${JSON.stringify(requestBody)}): success`,
      );
      return toOrderResponse(result);
    } catch (error) {
      this.logger.error(
        `OrderService.create(${JSON.stringify(requestBody)}): ${error.response?.errors}`,
      );
      throw new HttpException({ errors: error.response?.errors }, error.status);
    }
  }

  /**
   * Take an order by a technician.
   *
   * @param orderId The ID of the order to be taken.
   * @param user The user taking the order.
   * @returns A promise that resolves to the taken order by technician.
   * @throws HttpException if the user is not authorized to take the order.
   * @throws HttpException if the order is not found.
   * @throws HttpException if the order is already taken.
   */
  async take(orderId: string, user: JwtPayload): Promise<OrderResponse> {
    this.logger.debug(`OrderService.take(${orderId})`);

    // Validate that the user is a technician
    if (user.role !== Role.Technician) {
      this.logger.warn(
        `OrderService.take(${orderId}): User not authorized to take order`,
      );
      throw new HttpException(
        {
          // The user is not authorized to take the order.
          errors: 'User not authorized to take order',
        },
        // Unauthorized HTTP status code.
        401,
      );
    }

    // Retrieve the order by ID.
    const order = await this.getOneById(orderId);
    if (!order) {
      this.logger.warn(`OrderService.take(${orderId}): Order not found`);
      throw new HttpException(
        {
          // The order is not found.
          errors: 'Order not found',
        },
        // Not found HTTP status code.
        404,
      );
    }

    // Check if the order is already taken.
    if (order.technician) {
      this.logger.warn(`OrderService.take(${orderId}): Order already taken`);
      throw new HttpException(
        {
          // The order is already taken.
          errors: 'Order already taken',
        },
        // Bad request HTTP status code.
        400,
      );
    }

    // Validate if that technician still have 3 orders that not yet completed with the same date service
    const ordersByTechnicianWithSameDateServiceOfOrder =
      await this.orderRepository.find({
        where: {
          // Get all orders that belong to the technician
          technician: {
            id: user.sub,
          },

          // And the status of the order is not completed
          status: Not(OrderStatus.COMPLETED),

          // And the date_service of the order is the same as the date_service of the order we are trying to take
          date_service: order.date_service,
        },
      });
    if (ordersByTechnicianWithSameDateServiceOfOrder.length >= 3) {
      this.logger.warn(
        `OrderService.take(${orderId}): Technician still have 3 orders that not yet completed with the same date service`,
      );
      throw new HttpException(
        {
          // The order is already taken.
          errors:
            'Technician still have 3 orders that not yet completed with the same date service',
        },
        // Bad request HTTP status code.
        400,
      );
    }

    const updatedOrder = await this.orderRepository.save({
      ...order, // Spread the order object
      status: OrderStatus.TAKEN, // Set the status of the order to TAKEN
      technician: {
        id: user.sub, // Set the technician of the order to the current user
      },
    });
    const result: Order | null = await this.getOneById(updatedOrder.id);
    if (!result) {
      this.logger.warn(
        `OrderService.take(${orderId}): Order Not Found, after update`,
      );
      throw new HttpException({ errors: 'Order Not Found' }, 404);
    }
    this.logger.log(`OrderService.take(${orderId}): success`);
    return toOrderResponse(result);
  }

  /**
   * Retrieve an order by ID.
   * @param id The ID of the order.
   * @returns A promise that resolves to the order, or null if not found.
   */
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

  async getOneByCustomerId(customerId: string): Promise<Order | null> {
    this.logger.debug(`OrderService.getOneByIdCustomer(${customerId})`);
    const order = await this.orderRepository.findOne({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: {
        customer: true,
        ac_type: true,
        problem_type: true,
        building_type: true,
      },
    });
    if (!order) return null;
    return order;
  }

  /**
   * Retrieves all orders associated with a specific technician.
   *
   * @param {string} technicianId - The ID of the technician.
   * @returns {Promise<Order[] | null>} A promise that resolves to an array of orders, or null if no orders are found.
   */
  async getAllByTechnicianId(technicianId: string): Promise<Order[] | null> {
    this.logger.debug(`OrderService.getAllByTechnicianId(${technicianId})`);
    const orders = await this.orderRepository.find({
      where: {
        technician: {
          id: technicianId,
        },
      },
    });
    if (!orders) return null;
    return orders;
  }
}
