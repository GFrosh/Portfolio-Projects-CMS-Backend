# CMS Backend

A Content Management System backend built with Node.js, Express, and TypeScript. Provides REST APIs for user authentication, project management, and user administration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Other**: CORS, Cookie Parser

## Project Structure

```
src/
├── config/
│   ├── db.ts          # Database connection and table initialization
│   └── env.ts         # Environment variables configuration
├── controllers/
│   ├── addProjects.ts         # Create new project
│   ├── deleteProject.ts       # Delete project
│   ├── getProjects.ts         # Get all projects
│   ├── getUsers.ts            # Get all users
│   ├── login.ts               # User login
│   ├── logout.ts              # User logout
│   ├── signup.ts              # User registration
│   └── updateProject.ts       # Update project
├── middlewares/
│   └── authenticateToken.ts   # JWT authentication middleware
├── routes/
│   ├── login.ts               # Login routes
│   ├── logout.ts              # Logout routes
│   ├── projects.ts            # Project management routes
│   ├── signup.ts              # Signup routes
│   └── users.ts               # User management routes
├── types/
│   ├── Auth.ts                # Authentication types
│   ├── Project.ts             # Project interface
│   └── Response.ts            # API response types
├── utils/
│   ├── formatDate.ts          # Date formatting utility
│   └── logger.ts              # Logging utility
└── index.ts                   # Application entry point
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
)
```

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  github_url VARCHAR(255) NOT NULL,
  demo_url VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Base URL
- Development: `http://localhost:3000`
- Production: Configured via environment variables

### Authentication Endpoints

#### Sign Up
- **Route**: `POST /api/auth/signup`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully!",
    "data": {
      "id": 1,
      "name": "string",
      "email": "string",
      "createdAt": "date"
    }
  }
  ```

#### Sign Up Check
- **Route**: `GET /api/auth/register`
- **Description**: Check if signup endpoint is working
- **Response**:
  ```json
  {
    "message": "Signup endpoint is working"
  }
  ```

#### Login
- **Route**: `POST /api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "data": {
      "token": "jwt_token_string",
      "user": {
        "id": 1,
        "name": "string",
        "email": "string",
        "createdAt": "date"
      }
    }
  }
  ```

#### Logout
- **Route**: `POST /api/auth/logout`
- **Description**: End user session (can invalidate token on client)
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful!"
  }
  ```

### User Management Endpoints

#### Get All Users
- **Route**: `GET /api/auth/users`
- **Description**: Retrieve all registered users
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Found X users",
    "data": [
      {
        "id": 1,
        "name": "string",
        "email": "string",
        "created_at": "date",
        "last_login_at": "date | null"
      }
    ]
  }
  ```

### Project Management Endpoints

#### Get All Projects
- **Route**: `GET /api/projects/`
- **Description**: Retrieve all projects
- **Response**:
  ```json
  {
    "success": true,
    "message": "Found X projects",
    "data": [
      {
        "id": 1,
        "title": "string",
        "description": "string",
        "longDescription": "string",
        "tags": ["string"],
        "githubUrl": "string",
        "demoUrl": "string",
        "imageUrl": "string",
        "status": "draft | published | archived",
        "featured": false,
        "createdAt": "date",
        "updatedAt": "date"
      }
    ]
  }
  ```

#### Create Project
- **Route**: `POST /api/projects/new`
- **Description**: Create a new project
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string (required)",
    "longDescription": "string",
    "tags": ["string"],
    "githubUrl": "string",
    "demoUrl": "string",
    "imageUrl": "string",
    "status": "draft | published | archived (default: draft)",
    "featured": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project created successfully!",
    "data": {
      "id": 1,
      "title": "string",
      "description": "string",
      "longDescription": "string",
      "tags": ["string"],
      "githubUrl": "string",
      "demoUrl": "string",
      "imageUrl": "string",
      "status": "draft",
      "featured": false,
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

#### Update Project
- **Route**: `PUT /api/projects/edit/:id`
- **Description**: Update an existing project
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **URL Parameters**:
  - `id` (number): Project ID
- **Request Body**:
  ```json
  {
    "title": "string (required)",
    "description": "string (required)",
    "longDescription": "string",
    "tags": ["string"],
    "githubUrl": "string",
    "demoUrl": "string",
    "imageUrl": "string",
    "status": "draft | published | archived",
    "featured": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project updated successfully!",
    "data": {
      "id": 1,
      "title": "string",
      "description": "string",
      "longDescription": "string",
      "tags": ["string"],
      "githubUrl": "string",
      "demoUrl": "string",
      "imageUrl": "string",
      "status": "draft",
      "featured": false,
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

#### Delete Project
- **Route**: `DELETE /api/projects/delete/:id`
- **Description**: Delete a project
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **URL Parameters**:
  - `id` (number): Project ID
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project deleted successfully!"
  }
  ```

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory:
```env
DB_URL=postgresql://user:password@localhost:5432/cms_db
PORT=3000
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173,https://example.com
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CMS\ Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build TypeScript**
   ```bash
   npm run build
   ```

4. **Start the server**
   - Development:
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

## Authentication

- **Type**: JWT (JSON Web Token)
- **Location**: `Authorization` header
- **Format**: `Bearer <token>`
- **Secret**: Set via `JWT_SECRET` environment variable
- **Protected Routes**: Project CRUD operations require valid JWT token

## CORS Configuration

The API supports CORS with the following allowed origins:
- `http://localhost:5173` (local development)
- `https://portfolio-projects-cms.vercel.app` (production)
- Additional origins from `CLIENT_URL` environment variable

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Project Status Values

- `draft`: Project is in draft state
- `published`: Project is published and visible
- `archived`: Project is archived

## Logging

The application includes a logger utility for debugging:
- Logs are output to console
- Log levels: `info`, `error`, `warn`
- Each operation logs relevant information for debugging

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (not yet implemented)

## License

ISC

## Version

1.0.0
