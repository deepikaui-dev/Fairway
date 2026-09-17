import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';

export function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [subForm, setSubForm] = useState({ plan: 'monthly', status: 'active' });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateSub = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/users/${editingUser.id}/subscription`, subForm);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update subscription', error);
      alert('Failed to update subscription');
    }
  };

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
              <th className="p-4 font-medium text-sm text-right">Actions</th>
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
                <td className="p-4 text-right">
                  <Button 
                    variant="outline" 
                    className="text-xs py-1 px-2"
                    onClick={() => {
                      setEditingUser(user);
                      setSubForm({
                        plan: user.plan || 'monthly',
                        status: user.subscription_status || 'inactive'
                      });
                    }}
                  >
                    Manage Sub
                  </Button>
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

      {/* Edit Subscription Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50">
                <h3 className="font-display font-bold text-lg text-primary">Manage Subscription</h3>
                <button onClick={() => setEditingUser(null)} className="text-muted-text hover:text-text">✕</button>
              </div>
              <form onSubmit={handleUpdateSub} className="p-6 space-y-4">
                <p className="text-sm text-muted-text mb-4">
                  Editing subscription for <strong>{editingUser.email}</strong>
                </p>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    value={subForm.status}
                    onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1">Plan</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    value={subForm.plan}
                    onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })}
                  >
                    <option value="monthly">Monthly ($250/mo)</option>
                    <option value="yearly">Yearly ($2500/yr)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
