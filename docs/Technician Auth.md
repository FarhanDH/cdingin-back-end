# Technician Auth API Spec

## Register Technician

Endpoint : POST /api/auth/technicians/register

Request Body :

```json
{
  "name": "Joko Sasongko",
  "phone": "62812345678",
  "dayOfBirth": "1979-01-01",
  "licensePlate": "A 123 BCD",
  "email": "jokosasongko@mail.com", // Optional
  "password": "secret"
}
```

Response Body (Success) :

```json
{
  "message": "Technican registered successfully",
  "data": {
    "name": "Joko Sasongko",
    "phone": "62812345678",
    "dayOfBirth": "1979-01-01",
    "licensePlate": "A 123 BCD",
    "email": "jokosasongko@mail.com", // can be null if empty
    "date_created": "2024-09-09",
    "date_modified": "2024-09-09"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "phone already registered"
}
```

## Login Technician

Endpoint : POST /api/auth/technicians/login

Request Body :

```json
{
  "phone": "6281234567",
  "password": "secret"
}
```

Response Body (Success) :

```json
{
  "message": "Technician logged in successfully",
  "data": {
    "name": "Joko Sasongko",
    "phone": "62812345678",
    "dayOfBirth": "1979-01-01",
    "licensePlate": "A 123 BCD",
    "email": "jokosasongko@mail.com", // can be null if empty
    "date_created": "2024-09-09",
    "date_modified": "2024-09-09",
    "token": {
      "access_token": "token_generated",
      "refresh_token": "token_generated"
    }
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "phone or password is wrong"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User

Endpoint : DELETE /api/auth/logout

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "message": "Technician logged out successfully"
  "data": true
}
```

## Refresh Token Technician

Endpoint : POST /api/auth/refresh

Headers :

- Authorization: Refresh Token

Response Body (Success) :

```json
{
  "message": "Customer token successfully refreshed",
  "data": {
    "name": "Joko Sasongko",
    "phone": "62812345678",
    "dayOfBirth": "1979-01-01",
    "licensePlate": "A 123 BCD",
    "email": "jokosasongko@mail.com", // can be null if empty
    "date_created": "2024-09-09",
    "date_modified": "2024-09-09",
    "token": {
      "access_token": "token_generated",
      "refresh_token": "token_generated"
    }
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Refresh token is invalid or expired"
}
```
