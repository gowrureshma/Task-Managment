/**
 * Utility function to format date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Utility function to format date for HTML date input (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Utility function to format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if task is overdue
 */
export const isOverdue = (dueDate, status) => {
  if (status === 'Completed' || !dueDate) return false;
  return new Date(dueDate) < new Date();
};

/**
 * Get status badge styling
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'badge-completed';
    case 'In Progress':
      return 'badge-in-progress';
    case 'Pending':
      return 'badge-pending';
    default:
      return 'badge-primary';
  }
};

/**
 * Get priority badge styling
 */
export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'High':
      return 'badge-danger';
    case 'Medium':
      return 'badge-warning';
    case 'Low':
      return 'badge-primary';
    default:
      return 'badge-primary';
  }
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Format error message
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An error occurred';
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
