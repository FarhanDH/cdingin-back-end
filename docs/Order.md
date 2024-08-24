# CDingin API Specification

## Endpoints

### 1. Create Order

**URL**: `/api/orders`

**Method**: `POST`

**Description**: Create new order.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Request Body**:

```json
{
  "customerLatitude": "0.2134",
  "customerLongitude": "0.1234",
  "detailLocation": "Jl. Anggur, Gg. Beo No. 11",
  "problemTypeId": 1,
  "acTypeId": 1,
  "numberOfUnits": 2,
  "buildingTypeId": 1,
  "buildingFloorLocation": "1",
  "dateService": "2024-05-06"
}
```

**Response**:

- 201 Created

```json
{
  "requestId": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Order created successfully",
  "data": {
    "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technician": null,
    "customer": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "Customer 1",
      "phone": "6281234567"
    },
    "location": {
      "latitude": "0.2134",
      "longitude": "0.1234",
      "detail": "Jl. Anggur, Gg. Beo No. 11"
    },
    "problemType": {
      "id": 1,
      "name": "AC Netes",
      "description": "Netes di dalam ruangan"
    },
    "acType": {
      "id": 1,
      "name": "AC Split",
      "description": "AC yang nempel di dinding"
    },
    "numberOfUnits": 2,
    "buildingType": {
      "id": 1,
      "name": "Rumah",
      "floorLocation": "1"
    },
    "dateService": "2024-05-06",
    "status": "pending",
    "totalAmount": null,
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z"
  }
}
```

> [!CAUTION]
>
> - `400 Bad Request`: `If request body is invalid`
> - `401 Unauthorized`: `If token is invalid`
> - `403 Forbidden`: `If user is not customer`
> - `404 Not Found`: `If ac, building, and problem type not found`

### 2. Technician Take Order

**URL**: `/api/orders/:orderId/take`

**Method**: `PATCH`

**Description**: Technician take new order.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 201 Created

```json
{
  "requestId": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Order created successfully",
  "data": {
    "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technician": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "John Doe",
      "phone": "6281234567",
      "image_url": "https://example.com/image.jpg",
      "license_plate": "B 1 A",
      "isAvailable": true
    },
    "customer": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "Customer 1",
      "phone": "6281234567"
    },
    "location": {
      "latitude": "0.2134",
      "longitude": "0.1234",
      "detail": "Jl. Anggur, Gg. Beo No. 11"
    },
    "problemType": {
      "id": 1,
      "name": "AC Netes",
      "description": "Netes di dalam ruangan"
    },
    "acType": {
      "id": 1,
      "name": "AC Split",
      "description": "AC yang nempel di dinding"
    },
    "numberOfUnits": 2,
    "buildingType": {
      "id": 1,
      "name": "Rumah",
      "floorLocation": "1"
    },
    "dateService": "2024-05-06",
    "status": "taken",
    "totalAmount": null,
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z"
  }
}
```

**❌ Response Failed**

- `❌400 Bad Request`: `If Technician still have 3 orders that not yet completed with the same date service or order already taken`
- `❌401 Unauthorized`: `If token is invalid or user is not technician`
- `❌404 Not Found`: `If order not found`

### 3. Get Order By Id

**URL**: `/api/orders/:id`

**Method**: `GET`

**Description**: Get order by id.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 200 Ok

```json
{
  "requestId": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Order retrieved successfully",
  "data": {
    "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technician": null | {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "John Doe",
      "phone": "6281234567",
      "image_url": "https://example.com/image.jpg",
      "license_plate": "B 1 A",
      "isAvailable": true
    },
    "customer": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "Customer 1",
      "phone": "6281234567"
    },
    "location": {
      "latitude": "0.2134",
      "longitude": "0.1234",
      "detail": "Jl. Anggur, Gg. Beo No. 11"
    }
    "problemType": {
      "id": 1,
      "name": "AC Netes",
      "description": "Netes di dalam ruangan"
    },
    "acType": {
      "id": 1,
      "name": "AC Split",
      "description": "AC yang nempel di dinding"
    },
    "numberOfUnits": 2,
    "buildingType": {
      "id": 1,
      "name": "Rumah",
      "floorLocation": "1"
    },
    "dateService": "2024-05-06",
    "status": "pending",
    "totalAmount": null,
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z"
  }
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `404 Not Found`: `If ac, building, and problem type not found`

### 4. Update Order Status

**URL**: `/api/orders/:id/take`

**Method**: `PATCH`

**Description**: Update order status.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 200 Ok

```json
{
  "requestId": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Order status updated successfully",
  "data": {
    "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technician": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "John Doe",
      "phone": "6281234567",
      "image_url": "https://example.com/image.jpg",
      "license_plate": "B 1 A",
      "isAvailable": true
    },
    "customer": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "Customer 1",
      "phone": "6281234567"
    },
    "location": {
      "latitude": "0.2134",
      "longitude": "0.1234",
      "detail": "Jl. Anggur, Gg. Beo No. 11"
    }
    "problemType": {
      "id": 1,
      "name": "AC Netes",
      "description": "Netes di dalam ruangan"
    },
    "acType": {
      "id": 1,
      "name": "AC Split",
      "description": "AC yang nempel di dinding"
    },
    "numberOfUnits": 2,
    "buildingType": {
      "id": 1,
      "name": "Rumah",
      "floorLocation": "1"
    },
    "dateService": "2024-05-06",
    "status": "pending",
    "totalAmount": null,
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z"
  }
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `403 Forbidden`: `If technician is not available`
> - `403 Forbidden`: `If user is not technician`

### 5. List Orders

**URL**: `/api/orders`

**Method**: `GET`

**Description**: List orders based on query parameters.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Query Parameters**:

- `status: string (optional)` - `Filter orders by status.`
- `customer_id: uuid (optional)` - `Filter orders by customer ID.`
- `technician_id: uuid (optional)` - `Filter orders by technician ID.`
- `limit: number (optional)` - `Limit on the number of orders returned.`
- `offset: number (optional)` - `The initial position of the data taken.`

**Response**:

- 200 Ok

```json
{
  "requestId": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "technician": {
        "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
        "name": "John Doe",
        "phone": "6281234567",
        "image_url": "https://example.com/image.jpg",
        "license_plate": "B 1 A",
        "isAvailable": true
      },
      "customer": {
        "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
        "name": "Customer 1",
        "phone": "6281234567"
      },
      "location": {
        "latitude": "0.2134",
        "longitude": "0.1234",
        "detail": "Jl. Anggur, Gg. Beo No. 11"
      },
      "problemType": {
        "id": 1,
        "name": "AC Netes",
        "description": "Netes di dalam ruangan"
      },
      "acType": {
        "id": 1,
        "name": "AC Split",
        "description": "AC yang nempel di dinding"
      },
      "numberOfUnits": 2,
      "buildingType": {
        "id": 1,
        "name": "Rumah",
        "floorLocation": "1"
      },
      "dateService": "2024-05-06",
      "status": "pending",
      "totalAmount": null,
      "dateCreated": "2024-08-11T07:55:05.161Z"
    }
  ]
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
