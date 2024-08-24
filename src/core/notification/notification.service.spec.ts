import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { NotificationEvent } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
describe('NotificationService', () => {
  let service: NotificationService;
  let repository: Repository<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
        EventEmitter2,
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    repository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const userId = 'user123';
      const requestBody = {
        title: 'Hii Doe, your order is ready',
        body: 'Your order with ID 123 has been taken by technician Farhan, he will be at your place in 30 minutes. Click <a href="/order/details">here</a> to track your order.',
      };

      const createdNotification = new Notification();
      createdNotification.body = requestBody.body;
      createdNotification.title = requestBody.title;
      createdNotification.customer = { id: userId } as Customer;
      createdNotification.technician = { id: userId } as Technician;

      const savedNotification = new Notification();
      savedNotification.id = 1;
      savedNotification.body = requestBody.body;
      savedNotification.title = requestBody.title;
      savedNotification.customer = { id: userId } as Customer;
      savedNotification.technician = { id: userId } as Technician;

      jest.spyOn(repository, 'create').mockReturnValue(createdNotification);
      jest.spyOn(repository, 'save').mockResolvedValue(savedNotification);

      const result = await service.create(userId, requestBody);

      expect(repository.create).toHaveBeenCalledWith({
        body: requestBody.body,
        title: requestBody.title,
        customer: { id: userId },
        technician: { id: userId },
      });
      expect(repository.save).toHaveBeenCalledWith(createdNotification);
      expect(result).toEqual({
        id: savedNotification.id,
        body: savedNotification.body,
        title: savedNotification.title,
      });
    });

    it('should throw an HttpException if an error occurs', async () => {
      const userId = 'user123';
      const requestBody = {
        title: 'Hii Doe, your order is ready',
        body: 'Your order with ID 123 has been taken by technician Farhan, he will be at your place in 30 minutes. Click <a href="/order/details">here</a> to track your order.',
      };

      jest.spyOn(repository, 'create').mockImplementation(() => {
        throw new Error('Some error');
      });

      await expect(service.create(userId, requestBody)).rejects.toThrowError(
        'Error establishing SSE connection',
      );
    });
  });

  describe('findAll', () => {
    it('should find all notifications for a user', async () => {
      const userId = 'user123';
      const notifications = [
        {
          id: 1,
          body: 'Notification 1',
          title: 'Title 1',
        },
        {
          id: 2,
          body: 'Notification 2',
          title: 'Title 2',
        },
      ] as Notification[];

      jest.spyOn(repository, 'find').mockResolvedValue(notifications);

      const result = await service.findAll(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: [{ customer: { id: userId } }, { technician: { id: userId } }],
      });
      expect(result).toEqual(notifications);
    });
  });

  describe('findOne', () => {
    it('should find a notification by ID', async () => {
      const id = 1;
      const notification = {
        id: 1,
        body: 'Notification 1',
        title: 'Title 1',
      } as Notification;

      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(notification);
    });

    it('should throw an HttpException if the notification is not found', async () => {
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(id)).rejects.toThrowError(
        'Notification not found',
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const id = 1;
      const notification = new Notification();
      notification.id = id;
      notification.is_read = false;

      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);
      jest.spyOn(repository, 'save').mockResolvedValue(notification);

      await service.markAsRead(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.save).toHaveBeenCalledWith({
        ...notification,
        is_read: true,
      });
    });

    it('should throw an HttpException if the notification is not found', async () => {
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.markAsRead(id)).rejects.toThrowError(
        'Notification not found',
      );
    });
  });

  describe('sseEmitter', () => {
    it('should return an SSE emitter for the specified user', async () => {
      const userId = 'user123';
      const notification = {
        id: 1,
        body: 'Notification 1',
        title: 'Title 1',
        customer: { id: userId },
        technician: { id: userId },
      };

      jest.spyOn(service['eventEmitter'], 'fromEvent').mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          filter: jest.fn().mockReturnValue({
            map: jest.fn().mockReturnValue(notification),
          }),
        }),
      });

      const result = await service.sseEmitter(userId);

      expect(service['eventEmitter'].fromEvent).toHaveBeenCalledWith(
        NotificationEvent.NEW_NOTIFICATION,
      );
      expect(result).toEqual(notification);
    });

    it('should throw an HttpException if there is an error establishing the SSE connection', async () => {
      const userId = 'user123';

      jest
        .spyOn(service['eventEmitter'], 'fromEvent')
        .mockImplementation(() => {
          throw new Error('Some error');
        });

      await expect(service.sseEmitter(userId)).rejects.toThrowError(
        'Error establishing SSE connection',
      );
    });
  });
});
