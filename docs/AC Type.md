# AC Type API Spec

## Create AC Type

Endpoint : POST /api/ac-type

Request Body :

```json
{
  "name": "AC Split",
  "description": "AC yang nempel di dinding"
}
```

Response Body (Success) :

```json
{
  "request_id": "0191406e-84e5-7224-84ad-30045fce22a2",
  "message": "AC type created successfully",
  "data": {
    "id": 12345,
    "name": "AC Split",
    "description": "AC yang nempel di dinding",
    "date_created": "2024-08-11T07:54:31.385Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "AC type name already exist",
  "path": "/api/ac-type",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Get All AC Types

Endpoint : GET /api/ac-type

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "AC types retrieved successfully",
  "data": [
    {
      "id": 12345,
      "name": "AC Split",
      "description": "AC yang nempel di dinding",
      "date_created": "2024-08-11T06:37:02.527Z"
    }
  ]
}
```

## Get AC Type By Id

Endpoint : GET /api/ac-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "AC type retrieved successfully",
  "data": {
    "id": 12345,
    "name": "AC Split",
    "description": "AC yang nempel di dinding",
    "date_created": "2024-08-11T06:37:02.527Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "AC type not found",
  "path": "/api/ac-type/09090",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Delete AC Type By Id

Endpoint : DELETE /api/ac-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "AC type with id 12345 deleted successfully"
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "AC type not found",
  "path": "/api/ac-type/90909",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```
