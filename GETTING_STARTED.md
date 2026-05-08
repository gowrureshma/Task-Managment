# 🎯 Getting Started Checklist

Complete this checklist to get your Team Task Manager application running!

## ✅ Prerequisites Check

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed locally or MongoDB Atlas account
- [ ] Git installed
- [ ] VS Code or preferred code editor
- [ ] Postman installed (optional, for API testing)

## ✅ Initial Setup

### 1. MongoDB Setup
- [ ] Start MongoDB locally:
  ```bash
  # macOS
  brew services start mongodb-community
  
  # Windows
  net start MongoDB
  
  # Linux
  sudo systemctl start mongod
  ```
- [ ] OR Create MongoDB Atlas account for cloud database
- [ ] Verify MongoDB is running (port 27017)

### 2. Clone/Setup Project
- [ ] Navigate to project directory
- [ ] Create .env files
- [ ] Update database URI if needed

## ✅ Backend Installation

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Update MongoDB URI if using Atlas
- [ ] Keep JWT_SECRET as default (change in production)

### Step 4: Seed Database (First Time Only)
```bash
npm run seed
```
- [ ] Verify demo data created
- [ ] Check for success message

### Step 5: Start Backend Server
```bash
npm run dev
```
- [ ] Verify server started on http://localhost:5000
- [ ] Check for MongoDB connection message
- [ ] Keep terminal open

## ✅ Frontend Installation

### Step 1: Open New Terminal
- [ ] Keep backend running in first terminal
- [ ] Open new terminal window/tab

### Step 2: Navigate to Frontend
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Verify API URL is `http://localhost:5000/api`

### Step 5: Start Frontend Server
```bash
npm start
```
- [ ] Browser should open automatically
- [ ] Verify you see login page
- [ ] Check console for any errors

## ✅ Testing the Application

### Login Check
- [ ] Go to http://localhost:3000
- [ ] See login page
- [ ] Try demo credentials:
  - Email: `admin@example.com`
  - Password: `password123`
- [ ] Click "Sign In"
- [ ] Should redirect to Dashboard

### Dashboard Check
- [ ] See task statistics
- [ ] See recent tasks
- [ ] See navigation menu

### Features Check
- [ ] Navigate to Projects page
- [ ] Navigate to Tasks page
- [ ] Check Profile (if implemented)

### Full Workflow Test
- [ ] [ ] Create new project (Admin only)
- [ ] [ ] View projects list
- [ ] [ ] Create new task (Admin only)
- [ ] [ ] View tasks list
- [ ] [ ] Update task status
- [ ] [ ] Logout successfully
- [ ] [ ] Try signup with new account
- [ ] [ ] Login with new account

## ✅ API Testing with Postman

### Setup Postman
- [ ] Download Postman (getpostman.com)
- [ ] Open Postman
- [ ] Go to File → Import
- [ ] Select `postman-collection.json` from project root
- [ ] Create new environment or use default

### Configure Environment
- [ ] Set variable `baseUrl` = `http://localhost:5000/api`
- [ ] Save environment

### Test Auth Endpoints
- [ ] Run "Auth" → "Signup" endpoint
- [ ] Run "Auth" → "Login" endpoint
- [ ] Check token auto-populated
- [ ] Use token for other endpoints

### Test Other Endpoints
- [ ] GET /users
- [ ] GET /projects
- [ ] GET /tasks
- [ ] POST /tasks (create)
- [ ] PATCH /tasks/:id/status (update)

## ✅ Verification Checklist

### Backend Working?
- [ ] `npm run dev` runs without errors
- [ ] MongoDB connection message appears
- [ ] Server shows port 5000
- [ ] Can hit http://localhost:5000/api/health

### Frontend Working?
- [ ] `npm start` runs without errors
- [ ] Browser opens to http://localhost:3000
- [ ] Login page displays
- [ ] Can login with demo credentials
- [ ] Dashboard loads with data

### Database Working?
- [ ] MongoDB running on port 27017
- [ ] Database created: `team-task-manager`
- [ ] Collections created: Users, Projects, Tasks
- [ ] Seed data visible in database

### API Working?
- [ ] All endpoints accessible via Postman
- [ ] JWT tokens working
- [ ] Authentication required for protected endpoints
- [ ] Proper error responses

## ✅ Code Overview

### Backend Structure
```
backend/src/
├── config/         ← Database config
├── models/         ← Schemas
├── controllers/    ← Business logic
├── routes/         ← Endpoints
├── middleware/     ← Auth, errors
└── utils/          ← Helpers
```

### Frontend Structure
```
frontend/src/
├── pages/          ← Full pages
├── components/     ← Reusable UI
├── services/       ← API calls
├── context/        ← Auth state
└── utils/          ← Helpers
```

## ✅ Common Troubleshooting

### Dependencies not installed?
```bash
npm install
```

### MongoDB not running?
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

### Port 5000 in use?
```bash
# Find process on port 5000
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>
```

### API not connecting?
- [ ] Check backend is running
- [ ] Check .env API URL
- [ ] Check CORS configuration
- [ ] Check browser console for errors

### Database errors?
- [ ] Check MongoDB is running
- [ ] Check MongoDB URI in .env
- [ ] Check database user/password
- [ ] Check network connectivity (for cloud)

## ✅ Next Steps After Setup

1. **Explore the UI**
   - [ ] Try all pages
   - [ ] Create some test projects
   - [ ] Create some test tasks

2. **Read Documentation**
   - [ ] Read SETUP_GUIDE.md
   - [ ] Read API_DOCUMENTATION.md
   - [ ] Read backend/README.md
   - [ ] Read frontend/README.md

3. **Understand Code**
   - [ ] Study backend models
   - [ ] Study controllers
   - [ ] Study React pages
   - [ ] Study services

4. **Customize (Optional)**
   - [ ] Change UI colors
   - [ ] Add new fields to tasks
   - [ ] Add new pages
   - [ ] Add new API endpoints

5. **Deploy (Optional)**
   - [ ] Deploy backend to Heroku/Railway
   - [ ] Deploy frontend to Vercel/Netlify
   - [ ] Setup production database

## ✅ Useful Commands

### Backend
```bash
npm run dev       # Start development server with auto-reload
npm run start     # Start production server
npm run seed      # Populate database with demo data
npm test          # Run tests
```

### Frontend
```bash
npm start         # Start development server
npm run build     # Create production build
npm test          # Run tests
npm run eject     # Eject from create-react-app (irreversible)
```

## ✅ Demo Credentials

Keep these handy for testing:

**Admin Account**
- Email: `admin@example.com`
- Password: `password123`

**Member Account**
- Email: `member@example.com`
- Password: `password123`

## ✅ Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- MongoDB (local): mongodb://localhost:27017

## ✅ Key Files to Know

- `backend/server.js` - Backend entry point
- `frontend/src/App.js` - Frontend entry point
- `backend/seed.js` - Database seeding
- `postman-collection.json` - API testing
- `SETUP_GUIDE.md` - Complete setup
- `API_DOCUMENTATION.md` - API reference
- `QUICK_REFERENCE.md` - Quick lookups

## ✅ Completion Checklist

- [ ] All prerequisites installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database seeded with demo data
- [ ] Can login with demo credentials
- [ ] Dashboard displays correctly
- [ ] Can view/create projects
- [ ] Can view/create tasks
- [ ] API tested with Postman
- [ ] All documentation read

---

## 🎉 You're Ready!

Once all checkboxes are marked, your application is fully set up and ready to use/develop!

**Congratulations! 🚀**
