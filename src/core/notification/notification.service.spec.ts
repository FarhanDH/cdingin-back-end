import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import {
  CreateNotificationRequest,
  NotificationEvent,
} from '../models/notification.model';
import { HttpException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let repository: Repository<Notification>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    repository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const userId = 'user123';
      const requestBody: CreateNotificationRequest = {
        title: 'Test Notification',
        body: 'This is a test notification',
      };
      const createdNotification = new Notification();
      createdNotification.id = 1;
      createdNotification.title = requestBody.title;
      createdNotification.body = requestBody.body;

      jest.spyOn(repository, 'create').mockReturnValue(createdNotification);
      jest.spyOn(repository, 'save').mockResolvedValue(createdNotification);

      const result = await service.create(userId, requestBody);

      expect(repository.create).toHaveBeenCalledWith({
        body: requestBody.body,
        title: requestBody.title,
        customer: { id: userId },
        technician: { id: userId },
      });
      expect(repository.save).toHaveBeenCalledWith(createdNotification);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        NotificationEvent.NEW_NOTIFICATION,
        createdNotification,
      );
      expect(result).toEqual({
        id: createdNotification.id,
        title: createdNotification.title,
        body: createdNotification.body,
        is_read: false,
        date_created: expect.any(Date),
      });
    });

    it('should throw HttpException on error', async () => {
      const userId = 'user123';
      const requestBody: CreateNotificationRequest = {
        title: 'Test Notification',
        body: 'This is a test notification',
      };

      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.create(userId, requestBody)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all notifications for a user', async () => {
      const userId = 'user123';
      const notifications = [
        {
          id: 1,
          title: 'Notification 1',
          body: 'Body 1',
          is_read: false,
          date_created: new Date(),
        },
        {
          id: 2,
          title: 'Notification 2',
          body: 'Body 2',
          is_read: true,
          date_created: new Date(),
        },
      ] as Notification[];

      jest.spyOn(repository, 'find').mockResolvedValue(notifications);

      const result = await service.findAll(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: [{ customer: { id: userId } }, { technician: { id: userId } }],
        relations: {
          customer: true,
          technician: true,
        },
      });
      expect(result).toEqual(notifications);
    });
  });

  describe('findOne', () => {
    it('should return a notification by id', async () => {
      const notificationId = 1;
      const notification = new Notification();
      notification.id = notificationId;
      notification.title = 'Test Notification';
      notification.body = 'Test Body';
      notification.is_read = false;
      notification.date_created = new Date();

      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);

      const result = await service.findOne(notificationId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId },
        relations: {
          customer: true,
          technician: true,
        },
      });
      expect(result).toEqual({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        is_read: notification.is_read,
        date_created: notification.date_created,
      });
    });

    it('should throw HttpException when notification is not found', async () => {
      const notificationId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(notificationId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = 1;
      const notification = new Notification();
      notification.id = notificationId;
      notification.is_read = false;

      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...notification, is_read: true });

      await service.markAsRead(notificationId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...notification,
        is_read: true,
      });
    });

    it('should throw HttpException when notification is not found', async () => {
      const notificationId = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.markAsRead(notificationId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('sseEmitter', () => {
    it('should return an Observable for SSE', async () => {
      const userId = 'user123';
      const observable = await service.sseEmitter(userId);

      expect(observable).toBeDefined();
      expect(typeof observable.subscribe).toBe('function');
    });
  });
});
