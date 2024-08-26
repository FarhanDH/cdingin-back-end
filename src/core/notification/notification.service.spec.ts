import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationRequest } from '../models/notification.model';
import { Role } from '~/common/utils';

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
    it('should create a new notification', async () => {
      const createNotificationRequest: CreateNotificationRequest = {
        title: 'Test Notification',
        body: 'This is a test notification',
      };
      const recipient = 'user1';
      const userType = Role.Customer;

      const savedNotification = {
        id: 1,
        title: createNotificationRequest.title,
        body: createNotificationRequest.body,
        is_read: false,
        customer: { id: recipient },
      } as Notification;

      jest.spyOn(repository, 'create').mockReturnValue(savedNotification);
      jest.spyOn(repository, 'save').mockResolvedValue(savedNotification);

      await service.create(recipient, createNotificationRequest, userType);

      expect(repository.create).toHaveBeenCalledWith([
        {
          body: createNotificationRequest.body,
          title: createNotificationRequest.title,
          is_read: false,
          customer: { id: recipient },
        },
      ]);
      expect(repository.save).toHaveBeenCalledWith([savedNotification]);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'new.notification',
        savedNotification,
      );
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
        'Notification not found',
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
        'Notification not found',
      );
    });
  });
});
