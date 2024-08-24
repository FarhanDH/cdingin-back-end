import {
  Controller,
  Get,
  Logger,
  Param,
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

    const notification = await this.notificationService.findOne(+id);
    this.logger.log(`NotificationController.findOne(${id}): success`);

    return {
      message: 'Notification found',
      data: notification,
    };
  }

  @Sse('sse')
  @UseGuards(JwtGuard)
  /**
   * Server-Sent Events (SSE) endpoint for receiving real-time notifications.
   *
   * @param request - The request object containing user information.
   * @returns A promise that resolves to an Observable of MessageEvent.
   */
  async sse(
    @Request() request: RequestWithUser,
  ): Promise<Observable<MessageEvent>> {
    return this.notificationService.sseEmitter(request.user.sub);
  }
}
