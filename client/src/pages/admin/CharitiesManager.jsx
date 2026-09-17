import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';

export function CharitiesManager() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Youth Development',
    image_url: '',
    website_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const { data } = await api.get('/api/charities');
      setCharities(data.data);
    } catch (error) {
      console.error('Failed to fetch charities', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/api/admin/charities/${id}`, { active: !currentStatus });
      fetchCharities();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const openAddModal = () => {
    setEditingCharity(null);
    setFormData({
      name: '',
      description: '',
      category: 'Youth Development',
      image_url: 'https://images.unsplash.com/photo-1593111774240-d529f12eb416?q=80&w=600&auto=format&fit=crop',
      website_url: '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (charity) => {
    setEditingCharity(charity);
    setFormData({
      name: charity.name || '',
      description: charity.description || '',
      category: charity.category || 'Youth Development',
      image_url: charity.image_url || '',
      website_url: charity.website_url || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingCharity) {
        await api.put(`/api/admin/charities/${editingCharity.id}`, formData);
      } else {
        await api.post('/api/admin/charities', formData);
      }
      setModalOpen(false);
      fetchCharities();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save charity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-text">Charities Management</h2>
          <p className="text-xs text-muted-text">Manage partner organizations & fundraising targets</p>
        </div>
        <Button variant="primary" onClick={openAddModal} className="flex items-center gap-2">
          <span>➕</span> Add Charity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities.map((charity) => (
          <div key={charity.id} className="card flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={charity.image_url || 'https://images.unsplash.com/photo-1593111774240-d529f12eb416?q=80&w=600&auto=format&fit=crop'} 
                    alt={charity.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm" 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-text">{charity.name}</h3>
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{charity.category}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  charity.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {charity.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-sm text-muted-text mb-6">{charity.description}</p>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => openEditModal(charity)}>
                Edit
              </Button>
              <Button 
                variant={charity.active ? "outline" : "primary"}
                className="flex-1"
                onClick={() => toggleStatus(charity.id, charity.active)}
              >
                {charity.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold font-display text-text mb-4">
              {editingCharity ? 'Edit Charity' : 'Add New Charity'}
            </h3>

            {error && (
              <div className="bg-error/10 text-error p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Charity Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Youth Development">Youth Development</option>
                  <option value="Eco Reforestation">Eco Reforestation</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Clean Water">Clean Water</option>
                  <option value="Community Sports">Community Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Description</label>
                <textarea
                  className="input-field min-h-[90px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingCharity ? 'Update Charity' : 'Create Charity'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
