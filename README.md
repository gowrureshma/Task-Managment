# 📋 Team Task Manager

A production-ready full-stack web application for efficient project and task management with clean architecture, secure coding practices, and scalable design.

## 🎯 Features

✅ **User Management**
- User registration and authentication
- JWT-based token authentication
- Role-based access control (Admin/Member)
- Password hashing with bcrypt

✅ **Project Management**
- Create and manage projects
- Add team members to projects
- Project status tracking
- Admin-only deletion

✅ **Task Management**
- Create and assign tasks
- Update task status and priority
- Track due dates and overdue tasks
- Task filtering and sorting
- Dashboard statistics

✅ **Dashboard Analytics**
- Task statistics (completed, pending, in progress, overdue)
- Progress tracking
- Overall completion percentage
- Recent tasks list

✅ **User Interface**
- Responsive design for all devices
- Intuitive navigation
- Real-time error handling
- Loading states
- Form validation

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the project**
```bash
cd project
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

3. **Setup Frontend** (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📚 Documentation

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)
- [Complete Setup Guide](./SETUP_GUIDE.md)
- [API Collection (Postman)](./postman-collection.json)

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/signup         - User registration
POST   /api/auth/login          - User login
GET    /api/auth/me             - Get current user
```

### Projects
```
POST   /api/projects            - Create project
GET    /api/projects            - Get all projects
GET    /api/projects/:id        - Get project details
PUT    /api/projects/:id        - Update project
DELETE /api/projects/:id        - Delete project
```

### Tasks
```
POST   /api/tasks               - Create task
GET    /api/tasks               - Get all tasks
GET    /api/tasks/user/assigned - Get assigned tasks
PATCH  /api/tasks/:id/status    - Update task status
GET    /api/tasks/stats/dashboard - Get statistics
```

## 🏗️ Project Structure

```
project/
├── backend/              # Node.js + Express backend
├── frontend/             # React.js frontend
├── postman-collection.json  # API testing collection
├── SETUP_GUIDE.md       # Detailed setup instructions
└── README.md            # This file
```

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected API endpoints
- CORS configuration
- Error handling without exposing internals

## 🎨 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React.js with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

## 📊 Database Schema

### Users
- Profile information
- Authentication credentials
- Role assignment

### Projects
- Project details
- Team member assignments
- Status and due dates

### Tasks
- Task details
- Assignments
- Status tracking
- Priority levels
- Due dates

## 🧪 Testing

Use the included Postman collection:
1. Import `postman-collection.json` in Postman
2. Set environment variables
3. Test all endpoints

## 📝 Demo Credentials

**Admin:**
- Email: admin@example.com
- Password: password123

**Member:**
- Email: member@example.com
- Password: password123

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy from root directory
```

### Frontend (Vercel/Netlify)
```bash
# Build production version
npm run build

# Deploy build folder
```

## 📞 Support

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📄 License

MIT License

---

**Happy Task Managing! 🎯**
