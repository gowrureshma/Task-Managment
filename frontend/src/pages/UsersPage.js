import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import { Alert, Button, Card, Loading, Table, Badge } from '../components/Common';

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <p className="text-center text-gray-600 py-8">
            ⚠️ You don't have permission to access this page.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) return <Loading />;

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <Badge variant={value === 'Admin' ? 'danger' : 'primary'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        User Management
      </h1>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Card>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
};

export default UsersPage;
