import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Max,
  MaxLength,
  MinDate,
} from 'class-validator';
import { Order, OrderStatus } from '../order/entities/order.entity';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsDecimal()
  customerLatitude: number;

  @IsNotEmpty()
  @IsDecimal()
  customerLongitude: number;

  @IsString()
  @MaxLength(255)
  detailLocation: string;

  @IsNotEmpty()
  @IsInt()
  problemTypeId: number;

  @IsNotEmpty()
  @IsInt()
  acTypeId: number;

  @IsNotEmpty()
  @IsInt()
  @Max(5)
  numberOfUnits: number;

  @IsNotEmpty()
  @IsInt()
  buildingTypeId: number;

  @IsNumberString()
  @MaxLength(2)
  buildingFloorLocation: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  dateService: Date;
}

export class UpdateOrderRequest extends PartialType(CreateOrderRequest) {}

export class OrderResponse {
  id: string;
  technician: {
    id: string;
    name: string;
    phone: string;
    imageUrl: string;
    licensePlate: string;
    isAvailable: boolean;
  } | null;
  customer: {
    id: string;
    name: string;
    phone: string;
  };

  location: {
    latitude: number;
    longitude: number;
    detail: string;
  };

  problemType: {
    id: number;
    name: string;
    description: string;
  };

  acType: {
    id: number;
    name: string;
    description: string;
  };

  numberOfUnits: number;
  buildingType: {
    id: number;
    name: string;
    floorLocation: string;
  };
  dateService: Date;
  status: OrderStatus;
  totalPrice: number | null;
  dateCreated: Date;
  dateModified: Date;
}

export const toOrderResponse = (order: Order): OrderResponse => {
  return {
    id: order.id,
    technician: order.technician
      ? {
          id: order.technician.id,
          name: order.technician.name,
          phone: order.technician.contact.phone,
          imageUrl: order.technician.image_url,
          licensePlate: order.technician.license_plate,
          isAvailable: order.technician.is_available,
        }
      : null,
    customer: {
      id: order.customer.id,
      name: order.customer.name,
      phone: order.customer.contact.phone,
    },
    location: {
      latitude: order.customer_latitude,
      longitude: order.customer_longitude,
      detail: order.detail_location,
    },
    problemType: {
      id: order.problem_type.id,
      name: order.problem_type.name,
      description: order.problem_type.description,
    },
    acType: {
      id: order.ac_type.id,
      name: order.ac_type.name,
      description: order.ac_type.description,
    },
    numberOfUnits: order.number_of_units,
    buildingType: {
      id: order.building_type.id,
      name: order.building_type.name,
      floorLocation: order.building_floor_location,
    },
    dateService: order.date_service,
    status: order.status,
    totalPrice: order.total_price,
    dateCreated: order.date_created,
    dateModified: order.date_modified,
  };
};
