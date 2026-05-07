# API Reference Guide

Quick reference for all API endpoints and their usage.

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/auth/register` | Check signup endpoint | ❌ |
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/logout` | User logout | ✅ |
| GET | `/api/auth/users` | Get all users | ✅ |
| GET | `/api/projects/` | Get all projects | ❌ |
| POST | `/api/projects/new` | Create project | ✅ |
| PUT | `/api/projects/edit/:id` | Update project | ✅ |
| DELETE | `/api/projects/delete/:id` | Delete project | ✅ |

## Request/Response Types

### Project Interface
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Interface
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  last_login_at?: Date;
}
```

### Response Object
```typescript
interface ResponseObject {
  success: boolean;
  message: string;
  data?: any;
}
```

## Common Examples

### Example: Create a Project

**Request**:
```bash
curl -X POST http://localhost:3000/api/projects/new \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Portfolio Project",
    "description": "A brief description",
    "longDescription": "A detailed description of the project",
    "tags": ["typescript", "react", "nodejs"],
    "githubUrl": "https://github.com/user/project",
    "demoUrl": "https://demo.example.com",
    "imageUrl": "https://example.com/image.jpg",
    "status": "published",
    "featured": true
  }'
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Project created successfully!",
  "data": {
    "id": 42,
    "title": "My Portfolio Project",
    "description": "A brief description",
    "longDescription": "A detailed description of the project",
    "tags": ["typescript", "react", "nodejs"],
    "githubUrl": "https://github.com/user/project",
    "demoUrl": "https://demo.example.com",
    "imageUrl": "https://example.com/image.jpg",
    "status": "published",
    "featured": true,
    "createdAt": "2026-05-07T10:30:00Z",
    "updatedAt": "2026-05-07T10:30:00Z"
  }
}
```

### Example: User Registration

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-07T10:15:00Z"
  }
}
```

### Example: User Login

**Request**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2026-05-07T10:15:00Z"
    }
  }
}
```

### Example: Update Project

**Request**:
```bash
curl -X PUT http://localhost:3000/api/projects/edit/42 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Project Title",
    "description": "Updated description",
    "status": "archived"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Project updated successfully!",
  "data": {
    "id": 42,
    "title": "Updated Project Title",
    "description": "Updated description",
    "longDescription": "A detailed description of the project",
    "tags": ["typescript", "react", "nodejs"],
    "githubUrl": "https://github.com/user/project",
    "demoUrl": "https://demo.example.com",
    "imageUrl": "https://example.com/image.jpg",
    "status": "archived",
    "featured": true,
    "createdAt": "2026-05-07T10:30:00Z",
    "updatedAt": "2026-05-07T11:45:00Z"
  }
}
```

### Example: Delete Project

**Request**:
```bash
curl -X DELETE http://localhost:3000/api/projects/delete/42 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Project deleted successfully!"
}
```

## Error Responses

### Missing Required Fields

**Status**: 400 Bad Request

```json
{
  "success": false,
  "message": "Title and description are required!"
}
```

### Unauthorized Access

**Status**: 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Resource Not Found

**Status**: 404 Not Found

```json
{
  "success": false,
  "message": "Project not found!"
}
```

### Server Error

**Status**: 500 Internal Server Error

```json
{
  "success": false,
  "message": "Error creating project!"
}
```

## Authentication Flow

1. **Sign Up**: Create new account with `POST /api/auth/signup`
2. **Login**: Authenticate with `POST /api/auth/login`, receive JWT token
3. **Use Token**: Include `Authorization: Bearer <token>` in protected endpoints
4. **Token Expiry**: Handle token refresh as needed (implementation required)
5. **Logout**: Call `POST /api/auth/logout` to end session

## Tags Management

Tags are stored as PostgreSQL text arrays:
- Accept as JSON array in request: `["tag1", "tag2", "tag3"]`
- Automatically normalized to Postgres TEXT[] format
- Can contain duplicate entries (handled by frontend if needed)
- No validation on tag format (alphanumeric recommended)

## Pagination

Currently not implemented. All endpoints return full result sets. Pagination should be added for:
- Get all projects
- Get all users

## Rate Limiting

Not currently implemented. Should be added for security in production.

## Validation Rules

| Field | Rules |
|-------|-------|
| Email | Must be unique, valid format |
| Password | Stored as bcrypt hash (minimum recommended: 8 chars) |
| Title | Required, max 255 chars |
| Description | Required, unlimited length |
| Tags | Array of strings |
| URL fields | Should be valid URLs |
| Status | Only: 'draft', 'published', 'archived' |
| Featured | Boolean (default: false) |

