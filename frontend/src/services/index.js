import apiClient from './apiClient';

/**
 * Authentication Service
 */
export const authService = {
  // Signup new user
  signup: async (name, email, password) => {
    const response = await apiClient.post('/auth/signup', {
      name,
      email,
      password,
    });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

/**
 * User Service
 */
export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Get team members
  getTeamMembers: async (projectId) => {
    const response = await apiClient.get(`/users/team/${projectId}`);
    return response.data;
  },
};

/**
 * Project Service
 */
export const projectService = {
  // Create project
  createProject: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  // Get all projects
  getAllProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Add team member
  addTeamMember: async (projectId, userId) => {
    const response = await apiClient.post(`/projects/${projectId}/add-member`, {
      userId,
    });
    return response.data;
  },

  // Remove team member
  removeTeamMember: async (projectId, memberId) => {
    const response = await apiClient.delete(`/projects/${projectId}/remove-member/${memberId}`);
    return response.data;
  },
};

/**
 * Task Service
 */
export const taskService = {
  // Create task
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks
  getAllTasks: async (filters = {}) => {
    const response = await apiClient.get('/tasks', { params: filters });
    return response.data;
  },

  // Get assigned tasks
  getMyTasks: async () => {
    const response = await apiClient.get('/tasks/user/assigned');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await apiClient.get('/tasks/stats/dashboard');
    return response.data;
  },

  // Get project statistics
  getProjectStats: async (projectId) => {
    const response = await apiClient.get(`/tasks/stats/project/${projectId}`);
    return response.data;
  },

  // Add comment to task
  addComment: async (taskId, commentData) => {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, commentData);
    return response.data;
  },
};
