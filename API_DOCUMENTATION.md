# 📚 API Documentation

Complete REST API documentation for Team Task Manager

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. User Signup

**Endpoint:** `POST /auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "name": "string (2-50 characters)",
  "email": "string (valid email)",
  "password": "string (min 6 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "mongodb_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Member",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "email": "Email already registered"
  }
}
```

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "mongodb_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Admin|Member"
    },
    "token": "jwt_token"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Access:** Protected (requires token)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "mongodb_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin|Member",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## User Endpoints

### 1. Get All Users

**Endpoint:** `GET /users`

**Access:** Admin Only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "mongodb_id",
      "name": "User 1",
      "email": "user1@example.com",
      "role": "Admin"
    }
  ]
}
```

---

### 2. Get User by ID

**Endpoint:** `GET /users/:id`

**Access:** Protected

**URL Parameters:**
- `id` - User MongoDB ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "mongodb_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "Member"
  }
}
```

---

### 3. Update User Profile

**Endpoint:** `PUT /users/:id`

**Access:** Protected (own profile or Admin)

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "mongodb_id",
    "name": "Updated Name",
    "email": "newemail@example.com"
  }
}
```

---

## Project Endpoints

### 1. Create Project

**Endpoint:** `POST /projects`

**Access:** Admin Only

**Request Body:**
```json
{
  "title": "string (3-100 characters, required)",
  "description": "string (optional, max 500 chars)",
  "dueDate": "date (optional, ISO format)",
  "teamMembers": ["user_id1", "user_id2"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "project_id",
    "title": "Project Name",
    "description": "Project description",
    "createdBy": {
      "_id": "user_id",
      "name": "Admin Name",
      "role": "Admin"
    },
    "teamMembers": [
      {
        "_id": "user_id",
        "name": "Team Member"
      }
    ],
    "status": "Active",
    "dueDate": "2024-02-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Get All Projects

**Endpoint:** `GET /projects`

**Access:** Protected

**Query Parameters:**
- None (filtered by user role)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "_id": "project_id",
      "title": "Project 1",
      "description": "Description",
      "status": "Active",
      "teamMembers": []
    }
  ]
}
```

---

### 3. Get Project by ID

**Endpoint:** `GET /projects/:id`

**Access:** Protected

**URL Parameters:**
- `id` - Project MongoDB ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "_id": "project_id",
    "title": "Project Name",
    "description": "Description",
    "createdBy": {},
    "teamMembers": []
  }
}
```

---

### 4. Update Project

**Endpoint:** `PUT /projects/:id`

**Access:** Project creator or Admin

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "Active|Inactive|Completed|Archived (optional)",
  "dueDate": "date (optional)",
  "teamMembers": ["user_id1", "user_id2"] (optional)
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {}
}
```

---

### 5. Delete Project

**Endpoint:** `DELETE /projects/:id`

**Access:** Project creator or Admin

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": null
}
```

---

### 6. Add Team Member

**Endpoint:** `POST /projects/:id/add-member`

**Access:** Project creator or Admin

**Request Body:**
```json
{
  "userId": "string (user MongoDB ID, required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Team member added successfully",
  "data": {}
}
```

---

### 7. Remove Team Member

**Endpoint:** `DELETE /projects/:id/remove-member/:memberId`

**Access:** Project creator or Admin

**URL Parameters:**
- `id` - Project MongoDB ID
- `memberId` - User MongoDB ID to remove

**Success Response (200):**
```json
{
  "success": true,
  "message": "Team member removed successfully",
  "data": {}
}
```

---

## Task Endpoints

### 1. Create Task

**Endpoint:** `POST /tasks`

**Access:** Admin Only

**Request Body:**
```json
{
  "title": "string (3-100 characters, required)",
  "description": "string (optional, max 1000 chars)",
  "projectId": "string (MongoDB ID, required)",
  "assignedTo": "string (MongoDB ID, required)",
  "priority": "Low|Medium|High (default: Medium)",
  "dueDate": "date (optional, ISO format)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "task_id",
    "title": "Task Name",
    "description": "Task description",
    "projectId": {
      "_id": "project_id",
      "title": "Project Name"
    },
    "assignedTo": {
      "_id": "user_id",
      "name": "User Name"
    },
    "createdBy": {},
    "status": "Pending",
    "priority": "High",
    "dueDate": "2024-01-15T00:00:00Z",
    "isOverdue": false
  }
}
```

---

### 2. Get All Tasks

**Endpoint:** `GET /tasks`

**Access:** Protected

**Query Parameters:**
- `projectId` (optional) - Filter by project
- `status` (optional) - Pending|In Progress|Completed
- `assignedTo` (optional) - Filter by assigned user

**Example:**
```
GET /tasks?status=Pending&projectId=project_id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "_id": "task_id",
      "title": "Task 1",
      "status": "Pending",
      "priority": "High",
      "dueDate": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

### 3. Get My Tasks

**Endpoint:** `GET /tasks/user/assigned`

**Access:** Protected

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your tasks retrieved successfully",
  "data": [
    {
      "_id": "task_id",
      "title": "My Task",
      "status": "In Progress"
    }
  ]
}
```

---

### 4. Get Task by ID

**Endpoint:** `GET /tasks/:id`

**Access:** Protected

**URL Parameters:**
- `id` - Task MongoDB ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "_id": "task_id",
    "title": "Task Name",
    "description": "Task description",
    "projectId": {},
    "assignedTo": {},
    "status": "Pending",
    "priority": "High"
  }
}
```

---

### 5. Update Task

**Endpoint:** `PUT /tasks/:id`

**Access:** Admin only (Members can use /status endpoint)

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "Low|Medium|High (optional)",
  "dueDate": "date (optional)",
  "status": "Pending|In Progress|Completed (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {}
}
```

---

### 6. Update Task Status

**Endpoint:** `PATCH /tasks/:id/status`

**Access:** Task assignee or Admin

**Request Body:**
```json
{
  "status": "Pending|In Progress|Completed (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "_id": "task_id",
    "title": "Task Name",
    "status": "Completed"
  }
}
```

---

### 7. Delete Task

**Endpoint:** `DELETE /tasks/:id`

**Access:** Task creator or Admin

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

---

## Statistics Endpoints

### 1. Get Task Dashboard Statistics

**Endpoint:** `GET /tasks/stats/dashboard`

**Access:** Protected

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task statistics retrieved successfully",
  "data": {
    "totalTasks": 10,
    "completedTasks": 5,
    "pendingTasks": 3,
    "inProgressTasks": 2,
    "overdueTasks": 1,
    "completionPercentage": 50
  }
}
```

---

### 2. Get Project Statistics

**Endpoint:** `GET /tasks/stats/project/:projectId`

**Access:** Protected

**URL Parameters:**
- `projectId` - Project MongoDB ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project statistics retrieved successfully",
  "data": {
    "totalTasks": 10,
    "completedTasks": 5,
    "pendingTasks": 3,
    "inProgressTasks": 2,
    "overdueTasks": 0,
    "completionPercentage": 50
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently not implemented. Production deployments should include rate limiting.

---

## Pagination

Not yet implemented. Large datasets should be paginated in production.

---

## Best Practices

1. **Always include authentication token** in protected endpoints
2. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE, PATCH)
3. **Validate request data** on client side before sending
4. **Handle errors gracefully** in your client application
5. **Store tokens securely** (HttpOnly cookies, secure storage)
6. **Refresh tokens** when they expire

---

## Testing

Use the Postman collection (`postman-collection.json`) for testing all endpoints.

---

## Support

For issues or questions about the API, refer to the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
