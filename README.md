# SomJobs API

SomJobs API is a RESTful API that allows you to access the SomJobs database. It is built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.getpostman.com/) (optional)

### Installation

1. Clone the repo

```sh
git clone https://github.com/aaqyaar/som_jobs_api.git
```

2. Install NPM packages

- yarn preferred

```sh
yarn install
```

3. Environment variables

```sh
cp .env.example .env
```

- Edit the `.env` file and add your MongoDB URI and JWT secret key

4. Run the app

```sh
yarn dev # Development

yarn start # Production
```

## Usage

### Authentication

#### Register

```http
POST /api/auth/register
```

##### Request

```json
{
  "email": "abdizame@gmail.com",
  "password": "123456",
  "phone": "+252618977241",
  "name": "Abdi Zamed Mohamed"
}
```

##### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
  }
}
```

#### Login

```http
POST /api/auth/login
```

##### Request (Default Account)

```json
{
  "username": "abdizamed@gmail.com",
  "password": "123456"
}
```

##### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
  }
}
```

### Other Endpoints

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | /api/users                 | Get all users              |
| GET    | /api/users/:id             | Get a single user          |
| POST   | /api/auth/forgot-password  | Forgot password            |
| POST   | /api/auth/reset-password   | Reset password             |
| POST   | /api/auth/refresh-token    | Refresh token              |
| POST   | /api/auth/logout           | Logout                     |
| POST   | /api/auth/roles            | Create a role              |
| GET    | /api/auth/roles            | Get all roles              |
| GET    | /api/auth/roles/:id        | Get a single role          |
| POST   | /api/auth/permissions      | Create a permisson         |
| POST   | /api/auth/permissions/bulk | Create multiple permissons |
| GET    | /api/auth/permissions      | Get all permissions        |

## License

Licensed under the MIT License. See `LICENSE` for more information.

## Contact

Abdi Zamed Mohamed - Software Engineer

Thanks for reading!
