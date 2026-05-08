# Team Task Manager - Frontend

Modern React.js frontend for Team Task Manager application with Tailwind CSS.

## Features

✅ User Authentication (Login/Signup)
✅ Dashboard with Analytics
✅ Project Management
✅ Task Management
✅ Status Updates
✅ Role-Based UI
✅ Responsive Design
✅ Error Handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Navigate to frontend folder:
```bash
cd frontend
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
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Running the Application

Development mode:
```bash
npm start
```

Build for production:
```bash
npm run build
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Common.js          # Reusable UI components
│   │   ├── Navbar.js          # Navigation bar
│   │   └── ProtectedRoute.js  # Protected route wrapper
│   ├── pages/
│   │   ├── LoginPage.js       # Login page
│   │   ├── SignupPage.js      # Signup page
│   │   ├── DashboardPage.js   # Dashboard
│   │   ├── ProjectsPage.js    # Projects management
│   │   └── TasksPage.js       # Tasks management
│   ├── services/
│   │   ├── apiClient.js       # Axios configuration
│   │   └── index.js           # API service functions
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── utils/
│   │   └── helpers.js         # Utility functions
│   ├── App.js                 # Main app component
│   ├── index.js               # React entry point
│   └── index.css              # Global styles
├── package.json
├── .env.example
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## Available Pages

### Authentication
- `/login` - User login
- `/signup` - User registration

### Protected Pages
- `/dashboard` - Dashboard with task statistics
- `/projects` - Project management
- `/tasks` - Task management

## Features

### Dashboard
- Task statistics (total, completed, pending, in progress, overdue)
- Progress bar
- Recent tasks list
- Quick overview

### Projects
- View all projects (filtered by role)
- Create new project (Admin only)
- Delete project (Admin only)
- Team member management

### Tasks
- View all tasks with filters
- Create new task (Admin only)
- Update task status
- Delete task
- Filter by project and status
- Task priority levels
- Due date tracking

## Components

### Reusable Components (Common.js)
- `Alert` - Alert messages
- `Loading` - Loading spinner
- `Button` - Styled button
- `Card` - Container card
- `Badge` - Label badges
- `FormInput` - Text input field
- `FormTextarea` - Text area input
- `FormSelect` - Select dropdown
- `Modal` - Modal dialog
- `Table` - Data table

## Styling

- **Tailwind CSS** - Utility-first CSS
- **Custom CSS** - Global styles and components
- **Responsive Design** - Mobile-first approach

## API Integration

All API calls are made through the `services` folder:
- `authService` - Authentication endpoints
- `userService` - User management
- `projectService` - Project management
- `taskService` - Task management

## Authentication

- JWT token stored in `localStorage`
- Automatic token injection in API requests
- Automatic logout on token expiration
- User context for role-based UI rendering

## Error Handling

- Global error handling in API client
- User-friendly error messages
- Form validation
- Network error handling

## Development Notes

- All API endpoints are prefixed with `/api`
- Token is stored in `localStorage` with key `token`
- User data is stored in `localStorage` with key `user`
- Automatic redirect to login on 401 response

## Deployment

For production deployment:

1. Build the application:
```bash
npm run build
```

2. Update API URL in `.env.production`:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

3. Rebuild and deploy the build folder to your hosting service

## Troubleshooting

- **API Connection Error**: Check if backend is running on correct port
- **CORS Error**: Verify backend CORS configuration
- **Authentication Issues**: Check localStorage for token
- **Styling Issues**: Ensure Tailwind CSS is properly configured

## License

MIT
