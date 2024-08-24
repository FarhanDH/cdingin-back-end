import { HttpException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import {
  CreateNotificationRequest,
  NotificationEvent,
  NotificationResponse,
  toNotificationResponse,
} from '../models/notification.model';
import { Notification } from './entities/notification.entity';

/**
 * NotificationService class handles the management of notifications.
 */
@Injectable()
export class NotificationService {
  /**
   * The repository for managing notifications.
   */
  private readonly notificationRepository: Repository<Notification>;

  /**
   * The logger instance for the NotificationService class.
   */
  private readonly logger: Logger = new Logger(NotificationService.name);

  /**
   * Constructs a new instance of the NotificationService class.
   * @param notificationRepository - The repository for managing notifications.
   */
  constructor(
    @InjectRepository(Notification)
    notificationRepository: Repository<Notification>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.notificationRepository = notificationRepository;
  }

  /**
   * Create a new notification.
   * @param userId - The ID of the user.
   * @param requestBody - The request body containing notification details.
   * @example
   * const requestBody: CreateNotificationRequest = {
   * title: 'Hii Doe, your order is ready',
   * body: 'Your order with ID 123 has been taken by technician Farhan, he will be at your place in 30 minutes. Click <a href="/order/details">here</a> to track your order.',
   * };
   * @description This method used to create a new notification, you can use this method to notify the user about their order status, payment status, etc.
   * @returns A promise that resolves to the created notification.
   * @throws HttpException if an error occurs.
   */
  async create(
    userId: string,
    requestBody: CreateNotificationRequest,
  ): Promise<NotificationResponse> {
    this.logger.debug(
      `NotificationService.create(\nuserId: ${userId}, \nrequestBody: ${JSON.stringify(
        requestBody,
      )}\n)`,
    );
    try {
      const createdNotification: Notification =
        this.notificationRepository.create({
          body: requestBody.body,
          title: requestBody.title,
          customer: { id: userId },
          technician: { id: userId },
        });

      const savedNotification =
        await this.notificationRepository.save(createdNotification);

      // Emit an event for new notification
      // This event will be used to send a real-time notification to the user
      this.eventEmitter.emit(
        NotificationEvent.NEW_NOTIFICATION,
        savedNotification,
      );

      this.logger.log(
        `NotificationService.create(${JSON.stringify(requestBody)}): success`,
      );
      return toNotificationResponse(savedNotification);
    } catch (error) {
      this.logger.error(
        `NotificationService.create(${JSON.stringify(requestBody)}): ${error.response?.errors}`,
      );
      this.logger.error(`Error details: ${error}`);
      throw new HttpException({ errors: error.response?.errors }, error.status);
    }
  }

  /**
   * Find all notifications for a user.
   * @param userId - The ID of the user.
   * @description This method used to find all notifications for a user.
   * @returns A promise that resolves to an array of notifications.
   */
  async findAll(userId: string) {
    this.logger.debug(`NotificationService.findAll(${userId})`);
    const notifications = await this.notificationRepository.find({
      where: [{ customer: { id: userId } }, { technician: { id: userId } }],
      relations: {
        customer: true,
        technician: true,
      },
    });

    const response = notifications.map((notification) =>
      toNotificationResponse(notification),
    );

    return response;
  }

  /**
   * Find a notification by ID.
   * @param id - The ID of the notification.
   * @description This method used to find a notification by ID.
   * @returns A promise that resolves to the notification, or null if not found.
   */
  async findOne(id: number): Promise<NotificationResponse> {
    this.logger.debug(`NotificationService.findOne(${id})`);
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
        relations: {
          customer: true,
          technician: true,
        },
      });
      if (!notification) {
        throw new HttpException({ errors: 'Notification not found' }, 404);
      }
      return toNotificationResponse(notification);
    } catch (error) {
      this.logger.error(
        `NotificationService.findOne(${id}): ${error.response?.errors}`,
      );
      this.logger.error(`Error details: ${error}`);
      throw new HttpException({ errors: error.response?.errors }, error.status);
    }
  }

  /**
   * Mark a notification as read.
   * @param id - The ID of the notification.
   * @description This method used to mark a notification as read.
   * @returns A promise that resolves to the updated notification.
   * @throws HttpException if an error occurs.
   */
  async markAsRead(id: number): Promise<void> {
    this.logger.debug(`NotificationService.markAsRead(${id})`);

    try {
      const notification = await this.notificationRepository.findOne({
        where: { id },
      });
      if (!notification) {
        throw new HttpException({ errors: 'Notification not found' }, 404);
      }
      notification.is_read = true;
      await this.notificationRepository.save(notification);
    } catch (error) {
      this.logger.error(
        `NotificationService.markAsRead(${id}): ${error.response?.errors}`,
      );
      this.logger.error(`Error details: ${error}`);
      throw new HttpException({ errors: error.response?.errors }, error.status);
    }
  }

  /**
   * Returns an SSE (Server-Sent Events) emitter for the specified user.
   *
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an Observable of MessageEvent representing the SSE stream.
   * @throws {HttpException} If there is an error establishing the SSE connection.
   */
  async createNotificationStream(
    userId: string,
  ): Promise<Observable<MessageEvent>> {
    this.logger.debug(`NotificationService.sseEmitter(${userId})`);
    try {
      return fromEvent(
        this.eventEmitter,
        NotificationEvent.NEW_NOTIFICATION,
      ).pipe(
        filter(
          (data: Notification) =>
            (data.customer.id || data.technician.id) === userId,
        ), // Hanya kirim notifikasi yang relevan
        map((data: Notification) => {
          const notificationResponse = toNotificationResponse(data);
          return {
            data: notificationResponse,
            type: NotificationEvent.NEW_NOTIFICATION,
          } as MessageEvent;
        }),
      );
    } catch (error) {
      this.logger.error(`Error during SSE connection: ${error.message}`);
      throw new HttpException('Error establishing SSE connection', 500);
    }
  }
}
