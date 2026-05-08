# 🚀 Quick Reference Card

## Start the Application

### Backend
```bash
cd backend
npm install
npm run seed      # First time only
npm run dev       # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start         # Runs on http://localhost:3000
```

---

## Demo Credentials

```
Admin User:
  Email: admin@example.com
  Password: password123

Regular Member:
  Email: member@example.com
  Password: password123
```

---

## Important Commands

### Backend
```bash
npm run seed    # Create demo database data
npm run dev     # Start development server
npm start       # Start production server
npm test        # Run tests
```

### Frontend
```bash
npm start       # Development mode
npm run build   # Production build
npm test        # Run tests
```

---

## Key Files

### Backend
- `server.js` - Main server entry
- `src/models/` - Database schemas
- `src/routes/` - API endpoints
- `src/controllers/` - Business logic
- `src/middleware/` - Auth & errors

### Frontend
- `src/App.js` - Main app
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/` - API calls
- `src/context/` - Auth state

---

## API Base URL
```
http://localhost:5000/api
```

---

## Common URLs

| Page | URL |
|------|-----|
| Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Projects | http://localhost:3000/projects |
| Tasks | http://localhost:3000/tasks |

---

## Using Postman

1. Import: `postman-collection.json`
2. Set `baseUrl` variable: `http://localhost:5000/api`
3. Run "Login" endpoint to get token
4. Token auto-saved for other endpoints

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## User Roles

### Admin
- Create/Delete projects
- Create/Assign tasks
- Delete tasks
- View all users
- Manage team members

### Member
- View assigned tasks
- Update task status only
- View projects (assigned ones)
- Update own profile

---

## Task Status Flow

```
Pending → In Progress → Completed
         ↓
      (Can update at any time)
```

---

## Project Status Options

```
Active → Inactive → Completed
```

---

## Task Priority Levels

- High (🔴 Red)
- Medium (🟡 Yellow)
- Low (🟢 Green)

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Make sure MongoDB is running |
| Port 5000 in use | Change PORT in .env or kill process |
| API connection error | Check backend is running |
| CORS error | Check API URL in frontend .env |
| Login fails | Check credentials in database |

---

## File Counts

| Category | Count |
|----------|-------|
| Backend Controllers | 4 |
| Backend Models | 3 |
| Backend Routes | 5 |
| Frontend Pages | 5 |
| Frontend Components | 2 |
| API Endpoints | 23 |
| Documentation Files | 6 |

---

## Feature Checklist

- ✅ User Authentication (Signup/Login)
- ✅ JWT Authorization
- ✅ Project Management
- ✅ Task Management
- ✅ Role-Based Access
- ✅ Dashboard Analytics
- ✅ Task Statistics
- ✅ Form Validation
- ✅ Error Handling
- ✅ Responsive UI
- ✅ Database Seeding
- ✅ API Documentation
- ✅ Postman Collection

---

## Documentation Files

- `README.md` - Overview
- `SETUP_GUIDE.md` - Installation
- `API_DOCUMENTATION.md` - API Reference
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `QUICK_REFERENCE.md` - This file
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details

---

## Testing Workflow

1. Signup/Login with credentials
2. Create a project
3. Add team members
4. Create tasks
5. Assign tasks
6. Update task status
7. View dashboard statistics

---

## Deployment Checklist

- [ ] Update JWT_SECRET (unique & strong)
- [ ] Use production MongoDB URI
- [ ] Set NODE_ENV=production
- [ ] Update API_URL to production
- [ ] Configure HTTPS
- [ ] Set up CORS for production domain
- [ ] Enable rate limiting
- [ ] Setup logging
- [ ] Backup database
- [ ] Test all endpoints

---

## Useful Links

- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Tailwind Docs](https://tailwindcss.com/)

---

## Notes

- All passwords are hashed with bcrypt
- Tokens expire after 7 days
- Member can only update their own tasks
- Admin can do everything
- All timestamps are in UTC
- Database uses MongoDB ObjectIds

---

**Last Updated: 2024**
