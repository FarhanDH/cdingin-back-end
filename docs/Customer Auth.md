# Customer Auth API Spec

## Register Customer

Endpoint : POST /api/auth/customers/register

Request Body :

```json
{
  "name": "Joko Sasongko",
  "phone": "62812345678",
  "email": "jokosasongko@mail.com", // Optional
  "password": "secret"
}
```

Response Body (Success) :

```json
{
  "message": "Customer registered successfully",
  "data": {
    "name": "Joko Sasongko",
    "phone": "62812345678",
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

## Login Customer

Endpoint : POST /api/auth/customers/login

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
  "message": "Customer logged in successfully",
  "data": {
    "name": "Joko Sasongko",
    "phone": "62812345678",
    "email": "jokosasongko@mail.com", // can be null if empty
    "date_created": "2024-09-09",
    "date_modified": "2024-09-09",
    "token": {
      "access_token": "jwt_generated",
      "expires_in": "123453"
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
  "message": "Customer logged out successfully"
  "data": true
}
```
