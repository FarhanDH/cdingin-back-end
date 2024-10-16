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
import { Role } from '~/common/utils';

/**
 * NotificationService class handles the management of notifications.
 */
@Injectable()
export class NotificationService {
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
    private readonly notificationRepository: Repository<Notification>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create new notifications for one or more recipients.
   * @param recipients - A single recipient ID or an array of recipient IDs.
   * @param requestBody - The request body containing notification details.
   * @param userType - The role of the recipients (Customer or Technician).
   * @example
   * const recipients = ['user1', 'user2'];
   * const requestBody: CreateNotificationRequest = {
   *   title: 'Hi Doe, your order is ready',
   *   body: 'Your order with ID 123 has been taken by technician Farhan. He will be at your place in 30 minutes. Click <a href="/order/details">here</a> to track your order.',
   * };
   * const userType = Role.Customer;
   * await notificationService.create(recipients, requestBody, userType);
   * @description This method creates new notifications for the specified recipients. It can be used to notify users about their order status, payment status, etc.
   * @returns A promise that resolves when the notifications have been created and saved.
   * @throws HttpException if an error occurs during the creation process.
   */
  async create(
    recipients: string | string[],
    requestBody: CreateNotificationRequest,
    userType: Role,
  ): Promise<void> {
    this.logger.debug(
      `NotificationService.create(\nrecipients: ${recipients}, \nuserType: ${userType}, \nrequestBody: ${JSON.stringify(
        requestBody,
      )}\n)`,
    );
    try {
      // validate if recipient is more than 1 or array of string
      if (Array.isArray(recipients)) {
        const newNotifications: Notification[] =
          this.notificationRepository.create(
            recipients.map((recipient) => ({
              body: requestBody.body,
              title: requestBody.title,
              is_read: false,
              [userType === Role.Customer ? 'customer' : 'technician']: {
                id: recipient,
              },
            })),
          );

        const savedNotifications: Notification[] =
          await this.notificationRepository.save(newNotifications);

        if (savedNotifications.length === 0) {
          throw new HttpException(
            { errors: 'Failed to create notifications' },
            500,
          );
        }

        savedNotifications.forEach((notification) => {
          this.eventEmitter.emit(
            NotificationEvent.NEW_NOTIFICATION,
            notification,
          );
        });
      } else {
        const newNotification = this.notificationRepository.create({
          body: requestBody.body,
          title: requestBody.title,
          is_read: false,
          [userType === Role.Customer ? 'customer' : 'technician']: {
            id: recipients,
          },
        });
        const savedNotification =
          await this.notificationRepository.save(newNotification);
        this.eventEmitter.emit(
          NotificationEvent.NEW_NOTIFICATION,
          savedNotification,
        );
      }

      this.logger.log(
        `NotificationService.create: success for ${recipients.length} recipients`,
      );
    } catch (error) {
      this.logger.error(
        `NotificationService.create: ${error.response?.errors}`,
      );
      this.logger.error(`Error details: ${JSON.stringify(error)}`);
      throw new HttpException(
        {
          errors:
            error.response?.errors ||
            'An error occurred while creating notifications',
        },
        error.status || 500,
      );
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
            data.customer?.id === userId || data.technician?.id === userId,
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
