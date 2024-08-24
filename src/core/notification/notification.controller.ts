import {
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Request,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithUser } from '~/common/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger: Logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Retrieves all notifications for a specific user.
   *
   * @param request - The request object containing user information.
   * @returns An object containing a success message and the list of notifications.
   */
  @Get()
  @UseGuards(JwtGuard)
  async findAll(@Request() request: RequestWithUser) {
    this.logger.debug(`NotificationController.findAll(${request.user.sub})`);
    const notifications = await this.notificationService.findAll(
      request.user.sub,
    );
    this.logger.log(
      `NotificationController.findAll(${request.user.sub}): success`,
    );
    return {
      message: 'Notifications found',
      data: notifications,
    };
  }

  /**
   * Finds a notification by its ID.
   *
   * @param id - The ID of the notification.
   * @returns An object containing the message "Notification found" and the notification data.
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    this.logger.debug(`NotificationController.findOne(${id})`);

    const notificationId = parseInt(id, 10);
    if (isNaN(notificationId)) {
      this.logger.warn(`NotificationController.findOne(${id}): Invalid ID`);
      return {
        message: 'Invalid notification ID',
        error: 'The provided ID is not a valid number',
      };
    }

    const notification = await this.notificationService.findOne(notificationId);
    this.logger.log(`NotificationController.findOne(${id}): success`);

    return {
      message: 'Notification found',
      data: notification,
    };
  }

  /**
   * Server-Sent Events (SSE) endpoint for receiving real-time notifications.
   *
   * @param request - The request object containing user information.
   * @returns A promise that resolves to an Observable of MessageEvent.
   */
  @Sse('sse/stream')
  @UseGuards(JwtGuard)
  async sse(
    @Request() request: RequestWithUser,
  ): Promise<Observable<MessageEvent>> {
    return this.notificationService.createNotificationStream(request.user.sub);
  }

  /**
   * Marks a notification as read.
   *
   * @param id - The ID of the notification.
   * @returns An object containing the message "Notification marked as read".
   */
  @Patch(':id/read')
  @UseGuards(JwtGuard)
  async markAsRead(@Param('id') id: string) {
    this.logger.debug(`NotificationController.markAsRead(${id})`);

    await this.notificationService.markAsRead(+id);
    this.logger.log(`NotificationController.markAsRead(${id}): success`);

    return {
      message: 'Notification marked as read',
    };
  }
}
