# 📋 Team Task Manager - Complete Setup Guide

A production-ready full-stack web application with clean architecture, secure coding practices, and scalable design.

## 🎯 Project Overview

Team Task Manager is a comprehensive task and project management system that enables teams to:
- Create and manage projects
- Assign tasks to team members
- Track task progress
- Manage roles and permissions
- View detailed analytics and dashboards

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas))
- Git
- Postman (for API testing - [Download](https://www.postman.com/downloads/))
- VS Code or any code editor

### Installation

#### 1. Clone/Setup Project
```bash
# Navigate to project directory
cd project
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Update `.backend/.env`:**
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=10
```

**Start Backend Server:**
```bash
npm run dev
```

Expected output:
```
✓ MongoDB Connected: localhost
╔════════════════════════════════════════════════════════════╗
║       🚀 Team Task Manager Backend Server Started 🚀      ║
╠════════════════════════════════════════════════════════════╣
║  Server:    http://localhost:5000                          ║
║  API Docs:  http://localhost:5000/api/health              ║
║  Database:  mongodb://localhost:27017/team-task-manager   ║
║  Environment: development                                 ║
╚════════════════════════════════════════════════════════════╝
```

#### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Update `frontend/.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**Start Frontend Server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📝 Demo Credentials

### Login with these credentials:

**Admin User:**
- Email: `admin@example.com`
- Password: `password123`

**Member User:**
- Email: `member@example.com`
- Password: `password123`

> 💡 **First Time?** Click "Sign Up" to create your own account

## 🔗 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
POST   /auth/signup      - Register new user
POST   /auth/login       - Login user
GET    /auth/me          - Get current user (requires token)
```

### Projects
```
POST   /projects                    - Create project (Admin)
GET    /projects                    - Get all projects
GET    /projects/:id                - Get project details
PUT    /projects/:id                - Update project
DELETE /projects/:id                - Delete project (Admin)
POST   /projects/:id/add-member     - Add team member
DELETE /projects/:id/remove-member  - Remove team member
```

### Tasks
```
POST   /tasks                       - Create task (Admin)
GET    /tasks                       - Get all tasks
GET    /tasks/user/assigned         - Get assigned tasks
GET    /tasks/:id                   - Get task details
PUT    /tasks/:id                   - Update task
PATCH  /tasks/:id/status            - Update task status
DELETE /tasks/:id                   - Delete task (Admin)
GET    /tasks/stats/dashboard       - Get task statistics
```

### Users
```
GET    /users                       - Get all users (Admin)
GET    /users/:id                   - Get user details
PUT    /users/:id                   - Update user profile
GET    /users/team/:projectId       - Get team members
```

## 🧪 Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import" → Select `postman-collection.json`

2. **Set Environment Variables:**
   - In Postman, create new Environment or use default
   - Set `baseUrl`: `http://localhost:5000/api`

3. **Test Workflow:**
   - Run "Auth" → "Login" (or "Signup")
   - Token will be automatically set
   - Test other endpoints

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: 'Admin' | 'Member',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection
```javascript
{
  _id: ObjectId,
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

### Task Collection
```javascript
{
  _id: ObjectId,
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

## 🎨 Feature Walkthrough

### 1. Dashboard
- View task statistics
- See task completion progress
- Quick access to recent tasks
- Overview of all metrics

### 2. Projects
- Create new projects (Admin)
- View all projects
- Manage team members
- Delete projects (Admin)

### 3. Tasks
- Create tasks (Admin)
- Filter by project/status
- Update task status
- Track priorities and due dates
- View assigned tasks

### 4. User Management
- View profile
- Update profile
- Role-based access control
- Team member visibility

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT-based token authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Protected API endpoints

✅ **Input Validation**
- Frontend form validation
- Backend input sanitization
- Email format validation
- Password strength requirements

✅ **Error Handling**
- Global error handler
- User-friendly error messages
- Secure error responses
- Detailed logging

✅ **Best Practices**
- HTTPS-ready structure
- CORS configuration
- Environment variable management
- Sensitive data protection

## 📁 Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   ├── tailwind.config.js
│   └── README.md
│
├── postman-collection.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs
- **API Style**: RESTful

### Frontend
- **Library**: React.js (Hooks)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Custom CSS
- **HTTP Client**: Axios
- **State Management**: Context API

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway)

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build optimized version
npm run build

# Deploy build folder
# Update REACT_APP_API_URL to production backend URL
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
# macOS: brew services start mongodb-community
# Windows: net start MongoDB
# Linux: sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Change PORT in .env or kill process on port 5000
lsof -i :5000  # Find process
kill -9 <PID>   # Kill process
```

### Frontend Issues

**API Connection Error**
- Check backend is running
- Verify REACT_APP_API_URL in .env
- Check browser console for errors

**CORS Error**
- Ensure backend CORS is configured correctly
- Check API_URL matches exactly

### Authentication Issues

**Token Expired**
- Logout and login again
- Check JWT_EXPIRE in backend .env

**Cannot Login**
- Verify user exists in database
- Check password is correct
- See backend logs for errors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 💡 Tips & Best Practices

1. **Development**
   - Always use `.env` files for secrets
   - Run backend and frontend in separate terminals
   - Check browser console and terminal for errors

2. **Testing**
   - Use Postman for API testing
   - Test all user roles (Admin/Member)
   - Verify error handling

3. **Security**
   - Change JWT_SECRET in production
   - Use strong MongoDB passwords
   - Enable HTTPS in production
   - Regularly update dependencies

4. **Performance**
   - Implement pagination for large datasets
   - Add caching where appropriate
   - Optimize database queries
   - Use CDN for static assets

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend/frontend README.md files
3. Check browser console and server logs
4. Verify API connectivity

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Task Managing! 🚀**
