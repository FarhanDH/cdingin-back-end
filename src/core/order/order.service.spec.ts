import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderRequest, OrderResponse } from '../models/order.model';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderService } from './order.service';
import { HttpException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let orderRepository: Repository<Order>;

  const orderMock: Order = {
    id: 'string',
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
      orders: [],
      image_key: 'string',
      image_url: 'string',
      license_plate: 'string',
      is_available: true,
      date_created: new Date(),
      date_modified: new Date(),
    },
    customer_latitude: 0.12345,
    customer_longitude: 0.12345,
    detail_location: 'string',
    problem_type: {
      id: 1,
      name: 'string',
      description: 'string',
      date_created: new Date(),
      date_modified: new Date(),
      orders: [],
    },
    ac_type: {
      id: 1,
      name: 'string',
      description: 'string',
      date_created: new Date(),
      date_modified: new Date(),
      orders: [],
    },
    number_of_units: 1,
    building_type: {
      id: 1,
      name: 'string',
      date_created: new Date(),
      date_modified: new Date(),
      orders: [],
    },
    building_floor_location: '1',
    date_service: new Date('2024-01-01'),
    status: OrderStatus.PENDING,
    total_price: null,
    date_created: new Date(),
    date_modified: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            getOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('orderRepository should be defined', () => {
    expect(orderRepository).toBeDefined();
  });

  it('Should create a new order successfully', async () => {
    const requestBody: CreateOrderRequest = {
      customerLatitude: 0.12345,
      customerLongitude: 0.12345,
      detailLocation: 'string',
      problemTypeId: 1,
      acTypeId: 1,
      numberOfUnits: 1,
      buildingTypeId: 1,
      buildingFloorLocation: 'string',
      dateService: new Date('2024-01-01'),
    };
    const customerId = '0191406f-093f-7224-84ad-3e0cecb415bd';

    const createdOrderMock: OrderResponse = {
      id: 'string',
      customer: {
        id: 'string',
        name: 'string',
        phone: 'string',
      },
      technician: {
        id: 'string',
        name: 'string',
        phone: 'string',
        imageUrl: 'string',
        licensePlate: 'string',
        isAvailable: true,
      },
      location: {
        latitude: 0.12345,
        longitude: 0.12345,
        detail: 'string',
      },
      problemType: {
        id: 1,
        name: 'string',
        description: 'string',
      },
      acType: {
        id: 1,
        name: 'string',
        description: 'string',
      },
      numberOfUnits: 1,
      buildingType: {
        id: 1,
        name: 'string',
        floorLocation: '1',
      },
      dateService: new Date('2024-01-01'),
      status: OrderStatus.PENDING,
      totalPrice: null,
      dateCreated: orderMock.date_created,
      dateModified: orderMock.date_modified,
    };
    jest.spyOn(service, 'getOneByCustomerId').mockResolvedValue(null);
    jest.spyOn(orderRepository, 'create').mockReturnValue(orderMock);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(orderMock);
    jest.spyOn(service, 'getOneById').mockResolvedValue(orderMock); // Updated to mock the correct response

    const result = await service.create(customerId, requestBody);
    expect(result).toEqual(createdOrderMock);
  });

  it('Should throw exception if customer create new order but customer still have order that not yet completed', async () => {
    const customerId = '0191406f-093f-7224-84ad-3e0cecb415bd';
    const requestBody: CreateOrderRequest = {
      customerLatitude: 0.12345,
      customerLongitude: 0.12345,
      detailLocation: 'string',
      problemTypeId: 1,
      acTypeId: 1,
      numberOfUnits: 1,
      buildingTypeId: 1,
      buildingFloorLocation: 'string',
      dateService: new Date('2024-01-01'),
    };

    // const orderMock: Order = {
    //   id: 'string',
    //   customer: {
    //     id: customerId,
    //     name: 'string',
    //     contact: {
    //       id: 'string',
    //       phone: 'string',
    //       email: 'string',
    //       date_created: new Date(),
    //       date_modified: new Date(),
    //     },
    //     password: 'string',
    //     orders: [],
    //     date_created: new Date(),
    //     date_modified: new Date(),
    //   },
    //   technician: null,
    //   location: {
    //     latitude: 0.12345,
    //     longitude: 0.12345,
    //     detail: 'string',
    //   },
    //   problemType: {
    //     id: 1,
    //     name: 'string',
    //     description: 'string',
    //     date_created: new Date(),
    //     date_modified: new Date(),
    //     orders: [],
    //   },
    //   acType: {
    //     id: 1,
    //     name: 'string',
    //     description: 'string',
    //     date_created: new Date(),
    //     date_modified: new Date(),
    //     orders: [],
    //   },
    //   numberOfUnits: 1,
    //   buildingType: {
    //     id: 1,
    //     name: 'string',
    //     floorLocation: '1',
    //     date_created: new Date(),
    //     date_modified: new Date(),
    //     orders: [],
    //   },
    //   dateService: new Date('2024-01-01'),
    //   status: OrderStatus.PENDING,
    //   totalPrice: null,
    //   dateCreated: orderMock.date_created,
    //   dateModified: orderMock.date_modified,
    // };

    jest.spyOn(service, 'getOneByCustomerId').mockResolvedValue(orderMock);
    jest.spyOn(orderRepository, 'create').mockReturnValue(orderMock);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(orderMock);
    // jest.spyOn(orderRepository, 'find').mockResolvedValue([orderMock]);

    await expect(service.create(customerId, requestBody)).rejects.toThrow(
      new HttpException(
        { errors: 'Customer still have order that not yet completed' },
        400,
      ),
    );
  });
});
