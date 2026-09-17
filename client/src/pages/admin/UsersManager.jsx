import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/admin/users');
        setUsers(data.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-text">Users Management</h2>
      <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-muted-text border-b border-border">
              <th className="p-4 font-medium text-sm">Email</th>
              <th className="p-4 font-medium text-sm">Name</th>
              <th className="p-4 font-medium text-sm">Role</th>
              <th className="p-4 font-medium text-sm">Subscription</th>
              <th className="p-4 font-medium text-sm">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 text-sm font-medium text-text">{user.email}</td>
                <td className="p-4 text-sm text-text">{user.full_name || '-'}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-text'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {user.subscription_status === 'active' ? (
                    <span className="text-success font-medium">Active ({user.plan})</span>
                  ) : (
                    <span className="text-muted-text">None</span>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-text">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-text">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
