import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectService, userService } from '../services';
import {
  Alert,
  Button,
  Card,
  Loading,
  Modal,
  FormInput,
  FormTextarea,
  FormSelect,
} from '../components/Common';
import { formatDate, formatErrorMessage, formatDateForInput } from '../utils/helpers';

const ProjectsPage = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchProjectUsers = async (projectId) => {
    try {
      const response = await userService.getTeamMembers(projectId);
      setProjectUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch project users:', err);
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

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await projectService.createProject(formData);
      setSuccess('Project created successfully');
      setFormData({ title: '', description: '', dueDate: '' });
      setShowCreateModal(false);
      fetchProjects();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await projectService.updateProject(editingProject._id, editFormData);
      setSuccess('Project updated successfully');
      setShowEditModal(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        setSuccess('Project deleted successfully');
        fetchProjects();
      } catch (err) {
        setError(formatErrorMessage(err));
      }
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setEditFormData({
      title: project.title,
      description: project.description || '',
      dueDate: project.dueDate ? formatDateForInput(project.dueDate) : '',
    });
    setShowEditModal(true);
  };

  const openMemberModal = async (project) => {
    setSelectedProject(project);
    await Promise.all([fetchProjectUsers(project._id), fetchUsers()]);
    setShowMemberModal(true);
  };

  const handleAddMember = async (userId) => {
    if (!userId) return;
    try {
      await projectService.addTeamMember(selectedProject._id, userId);
      setSuccess('Team member added');
      await fetchProjectUsers(selectedProject._id);
      fetchProjects(); // Refresh to update member count
    } catch (err) {
      alert('Failed to add member: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this team member?')) return;
    try {
      await projectService.removeTeamMember(selectedProject._id, memberId);
      setSuccess('Team member removed');
      await fetchProjectUsers(selectedProject._id);
      fetchProjects(); // Refresh to update member count
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setSelectedProject(null);
    setProjectUsers([]);
  };

  if (loading) return <Loading />;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        {isAdmin && (
          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            ➕ New Project
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {isAdmin ? 'No projects yet. Create one to get started!' : 'No projects available'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {project.description || 'No description'}
                </p>
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                    {project.teamMembers?.length || 0} members
                  </span>
                </div>
                {project.dueDate && (
                  <p className="text-xs text-gray-500">
                    Due: {formatDate(project.dueDate)}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditModal(project)}
                >
                  Edit
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      className="flex-1"
                      onClick={() => openMemberModal(project)}
                    >
                      Team
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Create New Project"
        onClose={() => setShowCreateModal(false)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <FormInput
            label="Project Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            disabled={isSubmitting}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Project description (optional)"
            disabled={isSubmitting}
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

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        title="Edit Project"
        onClose={() => {
          setShowEditModal(false);
          setEditingProject(null);
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingProject(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditProject} className="space-y-4">
          <FormInput
            label="Project Title"
            name="title"
            value={editFormData.title}
            onChange={handleEditInputChange}
            placeholder="Enter project title"
            disabled={isSubmitting}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={editFormData.description}
            onChange={handleEditInputChange}
            placeholder="Project description"
            disabled={isSubmitting}
          />

          <FormInput
            label="Due Date"
            type="date"
            name="dueDate"
            value={editFormData.dueDate}
            onChange={handleEditInputChange}
            disabled={isSubmitting}
          />
        </form>
      </Modal>

      {/* Manage Team Members Modal */}
      <Modal
        isOpen={showMemberModal}
        title={`Manage Team - ${selectedProject?.title || ''}`}
        onClose={closeMemberModal}
      >
        <div className="space-y-4">
          {/* Add Member */}
          <div>
            <label className="form-label font-semibold">Add Team Member</label>
            <select
              className="form-select"
              onChange={(e) => {
                if (e.target.value) {
                  handleAddMember(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="">Select user to add...</option>
              {users
                .filter((u) => !projectUsers.some((p) => p._id === u._id))
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          </div>

          {/* Current Members */}
          <div>
            <label className="form-label font-semibold">Current Team Members</label>
            {projectUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No team members yet</p>
            ) : (
              <div className="space-y-2">
                {projectUsers.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    {isAdmin && member._id !== selectedProject?.createdBy?._id && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
