import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';

export function DrawsManager() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      const { data } = await api.get('/api/draws');
      setDraws(data.data);
    } catch (error) {
      console.error('Failed to fetch draws', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateDraw = async (id) => {
    try {
      await api.post(`/api/admin/draws/${id}/simulate`);
      alert('Draw Simulated successfully!');
      fetchDraws();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to simulate');
    }
  };

  const publishDraw = async (id) => {
    try {
      await api.post(`/api/admin/draws/${id}/publish`);
      alert('Draw Published successfully!');
      fetchDraws();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to publish');
    }
  };

  const handleCreateDraw = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/admin/draws/create', {
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        date: formData.date,
      });
      setModalOpen(false);
      fetchDraws();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create draw');
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
          <h2 className="text-2xl font-display font-bold text-text">Draws Management</h2>
          <p className="text-xs text-muted-text">Schedule, simulate, and publish monthly prize draws</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <span>➕</span> Create New Draw
        </Button>
      </div>

      <div className="bg-surface rounded-2xl shadow border border-border overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-muted-text border-b border-border">
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Month / Year</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Eligible Entries</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Prize Pool</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider">Winning Numbers</th>
              <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {draws.map((draw) => (
              <tr key={draw.id} className="hover:bg-muted/40 transition-colors">
                <td className="p-4 text-sm font-semibold text-text">
                  {new Date(draw.draw_year, draw.draw_month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    draw.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                    draw.status === 'simulated' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {draw.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-text font-medium">{draw.eligible_entries || 0}</td>
                <td className="p-4 text-sm text-emerald-600 font-bold">
                  ${((draw.total_prize_pool_cents || 0) / 100).toFixed(2)}
                </td>
                <td className="p-4 text-sm text-text font-mono">
                  {draw.winning_numbers && draw.winning_numbers.length > 0 
                    ? draw.winning_numbers.join(', ') 
                    : 'Pending Draw'}
                </td>
                <td className="p-4 text-right space-x-2">
                  {draw.status === 'pending' && (
                    <Button variant="outline" onClick={() => simulateDraw(draw.id)}>Simulate</Button>
                  )}
                  {draw.status === 'simulated' && (
                    <Button variant="primary" onClick={() => publishDraw(draw.id)}>Publish</Button>
                  )}
                  {draw.status === 'published' && (
                    <span className="text-xs font-semibold text-emerald-600">Published ✓</span>
                  )}
                </td>
              </tr>
            ))}
            {draws.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-muted-text">No draws scheduled yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Draw Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold font-display text-text mb-4">Create Upcoming Draw</h3>

            {error && (
              <div className="bg-error/10 text-error p-3 rounded-xl mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateDraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Draw Month (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="input-field"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Draw Year</label>
                <input
                  type="number"
                  min="2026"
                  max="2030"
                  className="input-field"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Target Draw Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Draw'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
