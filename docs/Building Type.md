# Building Type API Spec

## Create Building Type

Endpoint : POST /api/building-type

Request Body :

```json
{
  "name": "Rumah"
}
```

Response Body (Success) :

```json
{
  "request_id": "0191406e-84e5-7224-84ad-30045fce22a2",
  "message": "Building type created successfully",
  "data": {
    "id": 12345,
    "name": "Rumah",
    "date_created": "2024-08-11T07:54:31.385Z",
    "date_modified": "2024-08-11T07:54:31.385Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Building type already exist",
  "path": "/api/building-type",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Get All Building Types

Endpoint : GET /api/building-type

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Building types retrieved successfully",
  "data": [
    {
      "id": 12345,
      "name": "Rumah",
      "date_created": "2024-08-11T06:37:02.527Z",
      "date_modified": "2024-08-11T06:37:02.527Z"
    }
  ]
}
```

## Get Building Type By Id

Endpoint : GET /api/building-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Building type retrieved successfully",
  "data": {
    "id": 12345,
    "name": "Rumah",
    "date_created": "2024-08-11T06:37:02.527Z",
    "date_modified": "2024-08-11T06:37:02.527Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Building type not found",
  "path": "/api/building-type/09090",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Delete Building Type By Id

Endpoint : DELETE /api/building-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Building type deleted successfully"
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Building type not found",
  "path": "/api/building-type/90909",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```
