import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderRequest, toOrderResponse } from '../models/order.model';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [...TypeOrmTestingModule()],
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
      customerLatitude: 0.2134,
      customerLongitude: 0.1234,
      detailLocation: 'Jl. Anggur, Gg. Beo No. 11',
      problemTypeId: 1,
      acTypeId: 1,
      numberOfUnits: 2,
      buildingTypeId: 1,
      buildingFloorLocation: '1',
      dateService: new Date('2022-01-01'),
    };
    const customerId = '0191406f-093f-7224-84ad-3e0cecb415bd';

    const createdOrder: Order = {
      id: '0191406f-093f-7224-84ad-3e0cecb415bd',
      customer: {
        id: customerId,
        name: 'Joko Pirang',
        contact: {
          id: '0191406f-093f-7224-84ad-3e0cecb415bd',
          phone: '08123456789',
          email: 'qkX2e@example.com',
          date_created: new Date(), // Add this line
          date_modified: new Date(),
        },
        password: 'hashed123',
        orders: [],
        date_created: new Date(), // Add this line
        date_modified: new Date(),
      },
      technician: {
        id: '0191406f-093f-7224-84ad-3e0cecb415bd',
        name: 'Joko Pirang',
        date_of_birth: new Date(), // Add this line
        contact: {
          id: '0191406f-093f-7224-84ad-3e0cecb415bd',
          phone: '08123456789',
          email: 'qkX2e@example.com',
          date_created: new Date(), // Add this line
          date_modified: new Date(),
        },
        password: 'hashed123',
        orders: [],
        image_key: '', // Add this line
        image_url: '', // Add this line
        license_plate: '', // Add this line
        is_available: true, // Add this line
        date_created: new Date(), // Add this line
        date_modified: new Date(),
      },
      customer_latitude: requestBody.customerLatitude,
      customer_longitude: requestBody.customerLongitude,
      detail_location: requestBody.detailLocation,
      problem_type: {
        id: requestBody.problemTypeId,
        name: 'AC Tidak Dingin',
        description: 'AC tidak terasa dingin',
        date_created: new Date(),
        date_modified: new Date(),
        orders: [],
      },
      ac_type: {
        id: requestBody.acTypeId,
        name: 'AC Split',
        description: 'AC yang nempel di dinding',
        date_created: new Date(),
        date_modified: new Date(),
        orders: [],
      },
      number_of_units: requestBody.numberOfUnits,
      building_type: {
        id: requestBody.buildingTypeId,
        name: 'Rumah',
        date_created: new Date(),
        date_modified: new Date(),
        orders: [],
      },
      building_floor_location: requestBody.buildingFloorLocation,
      date_service: requestBody.dateService,
      status: OrderStatus.PENDING, // Add this line
      total_price: null, // Add this line
      date_created: new Date(), // Add this line
      date_modified: new Date(), // Add this line
    };
    jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder);
    jest.spyOn(service, 'getOneById').mockResolvedValue(createdOrder); // Updated to mock the correct response

    const result = await service.create(customerId, requestBody);
    expect(result).toEqual(toOrderResponse(createdOrder));
  });
});
