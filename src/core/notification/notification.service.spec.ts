import { HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/common/utils';
import {
  CreateNotificationRequest,
  NotificationEvent,
} from '../models/notification.model';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let repository: Repository<Notification>;
  let eventEmitter: EventEmitter2;

  const notificationMock: Notification = {
    id: 1,
    title: 'string',
    body: 'string',
    is_read: false,
    customer: {
      id: 'string',
      name: 'string',
      contact: {
        id: 'string',
        phone: 'string',
        email: 'string',
        date_created: new Date(), // Add this line
        date_modified: new Date(),
      },
      password: 'string',
      orders: [],
      notifications: [],
      date_created: new Date(), // Add this line
      date_modified: new Date(),
    },
    technician: {
      id: 'string',
      name: 'string',
      date_of_birth: new Date(), // Add this line
      contact: {
        id: 'string',
        phone: 'string',
        email: 'string',
        date_created: new Date(), // Add this line
        date_modified: new Date(),
      },
      password: 'string',
      image_key: 'string',
      image_url: 'string',
      license_plate: 'string',
      orders: [],
      notifications: [],
      is_available: true,
      date_created: new Date(),
      date_modified: new Date(),
    },
    date_created: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
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
    it('should create a new notification for single recipient', async () => {
      const requestBody: CreateNotificationRequest = {
        title: 'Test Notification',
        body: 'This is a test notification',
      };
      const recipient = 'user1';
      const userType = Role.Customer;

      const savedNotification = {
        ...notificationMock,
        title: requestBody.title,
        body: requestBody.body,
        customer: {
          ...notificationMock.customer,
          id: recipient,
        } as Notification['customer'],
        technician: null,
      };
      jest.spyOn(repository, 'create').mockReturnValue(savedNotification);
      jest.spyOn(repository, 'save').mockResolvedValue(savedNotification);

      await service.create(recipient, requestBody, userType);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        NotificationEvent.NEW_NOTIFICATION,
        savedNotification,
      );
    });

    it('should create a new notification for multiple recipients', async () => {
      const requestBody: CreateNotificationRequest = {
        title: 'Test Notification',
        body: 'This is a test notification',
      };
      const recipients = ['user1', 'user2'];
      const userType = Role.Technician;

      // Mock data to be returned by create and save methods
      const createdNotifications = recipients.map((recipient) => ({
        id: Math.random(),
        title: requestBody.title,
        body: requestBody.body,
        is_read: false,
        technician: {
          id: recipient,
        },
        date_created: new Date(),
      }));

      const savedNotifications = createdNotifications.map((notif) => ({
        ...notif,
        id: Math.floor(Math.random() * 1000), // Assign random IDs to simulate saved notifications
      }));

      // Mock the create method to return our mock notifications
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(createdNotifications as any);
      // Mock the save method to return the saved notifications
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(savedNotifications as any);

      await service.create(recipients, requestBody, userType);

      expect(repository.create).toHaveBeenCalledWith(
        recipients.map((recipient) => ({
          body: requestBody.body,
          title: requestBody.title,
          is_read: false,
          technician: { id: recipient },
        })),
      );

      expect(repository.save).toHaveBeenCalledWith(createdNotifications);

      expect(eventEmitter.emit).toHaveBeenCalledTimes(recipients.length);
      savedNotifications.forEach((notification) => {
        expect(eventEmitter.emit).toHaveBeenCalledWith(
          NotificationEvent.NEW_NOTIFICATION,
          notification,
        );
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const userId = 'user1';
      const mockNotifications = [
        {
          id: 1,
          title: 'Notification 1',
          body: 'Body 1',
          is_read: false,
          customer: { id: userId },
        },
        {
          id: 2,
          title: 'Notification 2',
          body: 'Body 2',
          is_read: true,
          customer: { id: userId },
        },
      ];

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockNotifications as Notification[]);

      const result = await service.findAll(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: [{ customer: { id: userId } }, { technician: { id: userId } }],
        relations: {
          customer: true,
          technician: true,
        },
      });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Notification 1');
      expect(result[1].title).toBe('Notification 2');
    });
  });

  describe('findOne', () => {
    it('should return a single notification', async () => {
      const notificationId = 1;
      const mockNotification = {
        id: notificationId,
        title: 'Test Notification',
        body: 'Test Body',
        is_read: false,
        customer: { id: 'user1' },
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockNotification as Notification);

      const result = await service.findOne(notificationId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId },
        relations: {
          customer: true,
          technician: true,
        },
      });
      expect(result.id).toBe(notificationId);
      expect(result.title).toBe('Test Notification');
    });

    it('should throw an error if notification is not found', async () => {
      const notificationId = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(notificationId)).rejects.toThrow(
        new HttpException({ errors: 'Notification not found' }, 404),
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notificationId = 1;
      const mockNotification = {
        id: notificationId,
        title: 'Test Notification',
        body: 'Test Body',
        is_read: false,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockNotification as Notification);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockNotification,
        is_read: true,
      } as Notification);

      await service.markAsRead(notificationId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockNotification,
        is_read: true,
      });
    });

    it('should throw an error if notification is not found', async () => {
      const notificationId = 999;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.markAsRead(notificationId)).rejects.toThrow(
        new HttpException({ errors: 'Notification not found' }, 404),
      );
    });
  });
});
