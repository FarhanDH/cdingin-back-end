# Notifications API Specification

## Endpoints

### 1. Get All Notifications

**URL**: `/api/notifications`

**Method**: `GET`

**Description**: Retrieve all notifications for the authenticated user.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 200 OK

```json
{
  "message": "Notifications found",
  "data": [
    {
      "id": 1,
      "title": "Hii Doe, your order is ready",
      "body": "Your order with ID 123 has been taken by technician Farhan, he will be at your place in 30 minutes. Click <a href=\"/order/details\">here</a> to track your order.",
      "isRead": false,
      "customerId": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "technicianId": null,
      "dateCreated": "2024-08-11T07:55:05.161Z",
      "dateModified": "2024-08-11T07:55:05.161Z",
      "customer": {
        "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
        "name": "Furqon",
        "phone": "11111111"
      }
    }
  ]
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `403 Forbidden`: `If user is not authenticated`

### 2. Get Notification by ID

**URL**: `/api/notifications/:id`

**Method**: `GET`

**Description**: Retrieve a single notification by its ID.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 200 OK

```json
{
  "message": "Notification found",
  "data": {
    "id": 1,
    "title": "Hii Doe, your order is ready",
    "body": "Your order with ID 123 has been taken by technician Farhan, he will be at your place in 30 minutes. Click <a href=\"/order/details\">here</a> to track your order.",
    "isRead": false,
    "customerId": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technicianId": null,
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z",
    "customer": {
      "id": "0191406f-093f-7224-84ad-3e0cecb415bd",
      "name": "Furqon",
      "phone": "11111111"
    }
  }
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `403 Forbidden`: `If user is not authenticated`
> - `404 Not Found`: `If notification with the given ID is not found`

### 3. Mark Notification as Read

**URL**: `/api/notifications/:id/read`

**Method**: `PATCH`

**Description**: Mark a specific notification as read.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 204 No Content

```json
{
  "message": "Notification marked as read successfully"
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `403 Forbidden`: `If user is not authenticated`
> - `404 Not Found`: `If notification with the given ID is not found`

### 4. Server-Sent Events (SSE) for Notifications

**URL**: `/api/notifications/sse/stream`

**Method**: `GET`

**Description**: Establish a Server-Sent Events (SSE) connection to receive real-time notifications.

**Request Headers**:

- `Authorization`: `Bearer <token>`

**Response**:

- 200 OK (Stream of events)

```json
{
  "data": {
    "id": 1,
    "title": "New Notification",
    "body": "You have a new notification.",
    "isRead": false,
    "customerId": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "technicianId": "0191406f-093f-7224-84ad-3e0cecb415bd",
    "dateCreated": "2024-08-11T07:55:05.161Z",
    "dateModified": "2024-08-11T07:55:05.161Z"
  },
  "type": "new.notification"
}
```

> [!CAUTION]
>
> - `401 Unauthorized`: `If token is invalid`
> - `500 Internal Server Error`: `If an error occurs while establishing the SSE connection`
