import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            📋 Task Manager
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6">
            <Link
              to="/dashboard"
              className={`transition-colors ${
                isActive('/dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className={`transition-colors ${
                isActive('/projects')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Projects
            </Link>
             <Link
               to="/tasks"
               className={`transition-colors ${
                 isActive('/tasks')
                   ? 'text-blue-600 border-b-2 border-blue-600'
                   : 'text-gray-600 hover:text-blue-600'
               }`}
             >
               Tasks
             </Link>
             {isAdmin && (
               <Link
                 to="/users"
                 className={`transition-colors ${
                   isActive('/users')
                     ? 'text-blue-600 border-b-2 border-blue-600'
                     : 'text-gray-600 hover:text-blue-600'
                 }`}
               >
                 Users
               </Link>
             )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
