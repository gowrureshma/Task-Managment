# Team Task Manager - Backend

Production-ready Node.js + Express backend for Team Task Manager application with MongoDB.

## Features

✅ JWT Authentication & Authorization
✅ Role-Based Access Control (Admin / Member)
✅ RESTful API Design
✅ MongoDB with Mongoose ODM
✅ Input Validation & Error Handling
✅ Password Hashing (bcrypt)
✅ CORS Support
✅ Environment Configuration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/team/:projectId` - Get team members

### Projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/add-member` - Add team member
- `DELETE /api/projects/:id/remove-member/:memberId` - Remove team member

### Tasks
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/user/assigned` - Get assigned tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/stats/dashboard` - Get user task statistics
- `GET /api/tasks/stats/project/:projectId` - Get project statistics

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'Admin' | 'Member',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (User),
  teamMembers: [ObjectId] (User),
  status: 'Active' | 'Inactive' | 'Completed',
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  projectId: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: 'Pending' | 'In Progress' | 'Completed',
  priority: 'Low' | 'Medium' | 'High',
  dueDate: Date,
  isOverdue: Boolean,
  comments: [{userId, text, createdAt}],
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── index.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   └── utils/
│       ├── validators.js
│       └── helpers.js
├── server.js
├── package.json
├── .env.example
└── .gitignore
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected routes with middleware
- Error handling without exposing sensitive information
- CORS configuration

## Testing with Postman

See the [Postman Collection](./postman-collection.json) for API testing examples.

## Development Notes

- All timestamps use UTC
- Passwords are never returned in API responses
- Database queries are optimized with proper indexing
- Error messages are descriptive but don't expose system details
- All endpoints return consistent JSON response format

## License

MIT
