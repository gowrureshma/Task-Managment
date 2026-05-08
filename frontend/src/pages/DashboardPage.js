import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services';
import { Alert, Card, Loading, Badge } from '../components/Common';
import { formatDate, getStatusBadgeClass, getPriorityBadgeClass } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch task statistics
      const statsResponse = await taskService.getTaskStats();
      setStats(statsResponse.data);

      // Fetch recent tasks
      const tasksResponse = await taskService.getMyTasks();
      setRecentTasks(tasksResponse.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's your task overview</p>
      </div>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} />}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalTasks}</div>
            <p className="text-gray-600 text-sm mt-2">Total Tasks</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
            <p className="text-gray-600 text-sm mt-2">Completed</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</div>
            <p className="text-gray-600 text-sm mt-2">Pending</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{stats.inProgressTasks}</div>
            <p className="text-gray-600 text-sm mt-2">In Progress</p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-gray-600 text-sm mt-2">Overdue</p>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {stats && stats.totalTasks > 0 && (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Overall Progress</h3>
            <span className="text-sm font-bold text-blue-600">{stats.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </Card>
      )}

      {/* Recent Tasks */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No tasks assigned yet</p>
        ) : (
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <Badge variant={getStatusBadgeClass(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge variant={getPriorityBadgeClass(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <p className="text-xs text-gray-500">
                    Due: {formatDate(task.dueDate) || 'No due date'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
