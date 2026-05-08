import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService, userService } from '../services';
import {
  Alert,
  Button,
  Card,
  Loading,
  Modal,
  FormInput,
  FormTextarea,
  FormSelect,
  Table,
  Badge,
} from '../components/Common';
import { formatDate, formatDateTime, getStatusBadgeClass, getPriorityBadgeClass, formatErrorMessage, formatDateForInput } from '../utils/helpers';

const TasksPage = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filters
  const [filters, setFilters] = useState({ projectId: '', status: '' });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });
  const [newComment, setNewComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [filters, isAdmin]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(filters);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setAllUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.projectId || !formData.assignedTo) {
      setError('Title, project, and assigned user are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await taskService.createTask(formData);
      setSuccess('Task created successfully');
      resetForm();
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await taskService.updateTask(editingTask._id, editFormData);
      setSuccess('Task updated successfully');
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setSuccess('Task updated successfully');
      fetchTasks();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setSuccess('Task deleted successfully');
        fetchTasks();
      } catch (err) {
        setError(formatErrorMessage(err));
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await taskService.addComment(selectedTask._id, { text: newComment });
      setSelectedTask(response.data.data);
      setNewComment('');
      fetchTasks(); // Refresh table to show updated task with comment
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId?._id || '',
      assignedTo: task.assignedTo?._id || '',
      priority: task.priority,
      dueDate: task.dueDate ? formatDateForInput(task.dueDate) : '',
      status: task.status,
    });
    setShowEditModal(true);
    setError(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedTask(null);
    setNewComment('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: '',
      assignedTo: '',
      priority: 'Medium',
      dueDate: '',
      status: 'Pending',
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'projectId',
      label: 'Project',
      render: (project) => project?.title || 'N/A',
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (user) => user?.name || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        // Allow inline status update for assigned user or admin
        if (row.assignedTo._id === user._id || isAdmin) {
          return (
            <select
              value={value}
              onChange={(e) => handleUpdateTaskStatus(row._id, e.target.value)}
              className="form-select form-select-sm"
              style={{ width: '130px' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          );
        }
        return <Badge variant={getStatusBadgeClass(value)}>{value}</Badge>;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => (
        <Badge variant={getPriorityBadgeClass(value)}>{value}</Badge>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value) => formatDate(value) || 'N/A',
    },
  ];

  const actions = (row) => {
    const taskActions = [];

    // Edit button (admin or creator)
    if (isAdmin || row.createdBy._id === user._id) {
      taskActions.push({
        label: 'Edit',
        onClick: () => openEditModal(row),
        className: 'btn-primary',
      });
    }

    // Delete button (admin or creator)
    if (isAdmin || row.createdBy._id === user._id) {
      taskActions.push({
        label: 'Delete',
        onClick: () => handleDeleteTask(row._id),
        className: 'btn-danger',
      });
    }

    return taskActions;
  };

  if (loading) return <Loading />;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        {isAdmin && (
          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            ➕ New Task
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Filter by Project"
            value={filters.projectId}
            onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((p) => ({ value: p._id, label: p.title })),
            ]}
          />

          <FormSelect
            label="Filter by Status"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </div>
      </Card>

      {/* Tasks Table */}
      {tasks.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {isAdmin ? 'No tasks yet. Create one to get started!' : 'No tasks available'}
          </p>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={tasks} actions={actions} />
        </Card>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Create New Task"
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <FormInput
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            disabled={isSubmitting}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Task description with detailed instructions"
            disabled={isSubmitting}
          />

          <FormSelect
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleInputChange}
            options={projects.map((p) => ({ value: p._id, label: p.title }))}
          />

          <FormSelect
            label="Assign To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            options={
              allUsers.map((u) => ({
                value: u._id,
                label: `${u.name} (${u.role})`,
              })) || []
            }
          />

          <FormSelect
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />

          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        title="Edit Task"
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingTask(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateTask} className="space-y-4">
          <FormInput
            label="Task Title"
            name="title"
            value={editFormData.title}
            onChange={handleEditInputChange}
            placeholder="Enter task title"
            disabled={isSubmitting}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Task description"
            disabled={isSubmitting}
          />

          <FormSelect
            label="Project"
            name="projectId"
            value={editFormData.projectId}
            onChange={handleEditInputChange}
            options={projects.map((p) => ({ value: p._id, label: p.title }))}
            disabled={!isAdmin}
          />

          <FormSelect
            label="Assign To"
            name="assignedTo"
            value={editFormData.assignedTo}
            onChange={handleEditInputChange}
            options={
              allUsers.map((u) => ({
                value: u._id,
                label: `${u.name} (${u.role})`,
              })) || []
            }
            disabled={!isAdmin}
          />

          <FormSelect
            label="Priority"
            name="priority"
            value={editFormData.priority}
            onChange={handleEditInputChange}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />

          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={editFormData.dueDate}
            onChange={handleEditInputChange}
            disabled={isSubmitting}
          />

          <FormSelect
            label="Status"
            name="status"
            value={editFormData.status}
            onChange={handleEditInputChange}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
            ]}
          />
        </form>
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        title="Task Details"
        onClose={closeDetailModal}
        footer={
          selectedTask && isAdmin && (
            <Button
              variant="outline"
              onClick={() => {
                closeDetailModal();
                openEditModal(selectedTask);
              }}
            >
              Edit Task
            </Button>
          )
        }
      >
        {selectedTask && (
          <div className="space-y-4">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-800">{selectedTask.title}</h3>
                <Badge variant={getStatusBadgeClass(selectedTask.status)}>
                  {selectedTask.status}
                </Badge>
                <Badge variant={getPriorityBadgeClass(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>
              <p className="text-gray-600">
                {selectedTask.description || 'No description provided'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Project</p>
                <p className="font-semibold">{selectedTask.projectId?.title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Assigned To</p>
                <p className="font-semibold">{selectedTask.assignedTo?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="font-semibold">{selectedTask.createdBy?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className={`font-semibold ${selectedTask.isOverdue ? 'text-red-600' : ''}`}>
                  {formatDate(selectedTask.dueDate) || 'No due date'}
                  {selectedTask.isOverdue && ' (Overdue)'}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Comments</h4>

              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                <div className="space-y-3">
                  {selectedTask.comments.map((comment, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">
                          {comment.userId?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet</p>
              )}

              {/* Add Comment Form */}
              {(selectedTask.assignedTo?._id === user?._id ||
                selectedTask.createdBy?._id === user?._id ||
                isAdmin) && (
                <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="form-input flex-1"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!newComment.trim()}
                  >
                    Add
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TasksPage;
