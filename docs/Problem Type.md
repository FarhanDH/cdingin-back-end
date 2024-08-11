# Problem Type API Spec

## Create Problem Type

Endpoint : POST /api/problem-type

Request Body :

```json
{
  "name": "AC Netes",
  "description": "Netes di dalam ruangan"
}
```

Response Body (Success) :

```json
{
  "request_id": "0191406e-84e5-7224-84ad-30045fce22a2",
  "message": "Problem type created successfully",
  "data": {
    "id": 12345,
    "name": "AC Netes",
    "description": "Netes di dalam ruangan",
    "date_created": "2024-08-11T07:54:31.385Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Problem type name already exist",
  "path": "/api/problem-type",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Get All Problem Types

Endpoint : GET /api/problem-type

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Problem types retrieved successfully",
  "data": [
    {
      "id": 12345,
      "name": "AC Berisik",
      "description": "Netes di dalam ruangan",
      "date_created": "2024-08-11T06:37:02.527Z"
    }
  ]
}
```

## Get Problem Type By Id

Endpoint : GET /api/problem-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Problem type retrieved successfully",
  "data": {
    "id": 12345,
    "name": "AC Berisik",
    "description": "Netes di dalam ruangan",
    "date_created": "2024-08-11T06:37:02.527Z"
  }
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Problem type not found",
  "path": "/api/problem-type/09090",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```

## Delete Problem Type By Id

Endpoint : DELETE /api/problem-type/:id

Response Body (Success) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "message": "Problem type with id 12345 deleted successfully"
}
```

Response Body (Failed) :

```json
{
  "request_id": "0191406f-093f-7224-84ad-3e0cecb415bd",
  "errors": "Problem type not found",
  "path": "/api/problem-type/90909",
  "timestamp": "2024-08-11T07:55:05.161Z"
}
```
