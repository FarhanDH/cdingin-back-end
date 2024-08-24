import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Notification } from '../notification/entities/notification.entity';

export class CreateNotificationRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}
export class NotificationResponse {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  date_created: Date;
  technician: User | null;
  customer: User | null;
}

type User = {
  id: string;
  name: string;
  phone: string;
  imageUrl?: string;
};

export const toNotificationResponse = (
  notification: Notification,
): NotificationResponse => {
  return {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    is_read: notification.is_read,
    date_created: notification.date_created,
    technician: notification.technician
      ? {
          id: notification.technician.id,
          name: notification.technician.name,
          phone: notification.technician.contact.phone,
          imageUrl: notification.technician.image_url,
        }
      : null,
    customer: notification.customer
      ? {
          id: notification.customer.id,
          name: notification.customer.name,
          phone: notification.customer.contact.phone,
        }
      : null,
  };
};

export enum NotificationEvent {
  NEW_NOTIFICATION = 'new.notification',
}
