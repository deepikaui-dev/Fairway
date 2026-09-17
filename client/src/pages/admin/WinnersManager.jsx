import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../../services/api';
import { Button } from '../../components/ui/Button';

export function WinnersManager() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const { data } = await api.get('/api/admin/winners');
      setWinners(data.data);
    } catch (error) {
      console.error('Failed to fetch winners', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/winners/${id}`, { status: newStatus });
      fetchWinners();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading winners...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-text">Winners Management</h2>
      <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted text-muted-text border-b border-border">
              <th className="p-4 font-medium text-sm">User</th>
              <th className="p-4 font-medium text-sm">Draw</th>
              <th className="p-4 font-medium text-sm">Prize</th>
              <th className="p-4 font-medium text-sm">Proof</th>
              <th className="p-4 font-medium text-sm">Status</th>
              <th className="p-4 font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {winners.map((winner) => (
              <tr key={winner.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 text-sm font-medium text-text">
                  <div>{winner.full_name || 'No Name'}</div>
                  <div className="text-xs text-muted-text font-normal">{winner.email}</div>
                </td>
                <td className="p-4 text-sm text-text">
                  Match {winner.match_tier} <br/>
                  <span className="text-xs text-muted-text">
                    {winner.draw_month}/{winner.draw_year}
                  </span>
                </td>
                <td className="p-4 text-sm text-success font-medium">
                  ${((winner.prize_amount_cents || 0) / 100).toFixed(2)}
                </td>
                <td className="p-4 text-sm">
                  {winner.file_url ? (
                    <a href={`${API_URL}${winner.file_url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs">
                      View Proof
                    </a>
                  ) : (
                    <span className="text-muted-text text-xs">No proof uploaded</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    winner.status === 'paid' ? 'bg-success/20 text-success' :
                    winner.status === 'verified' ? 'bg-primary/20 text-primary' :
                    winner.status === 'rejected' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {winner.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {winner.status === 'pending' && winner.file_url && (
                    <>
                      <Button variant="outline" className="text-xs py-1 px-2" onClick={() => updateStatus(winner.id, 'verified')}>Verify</Button>
                      <Button variant="outline" className="text-xs py-1 px-2 text-error border-error" onClick={() => updateStatus(winner.id, 'rejected')}>Reject</Button>
                    </>
                  )}
                  {winner.status === 'verified' && (
                    <Button variant="primary" className="text-xs py-1 px-2" onClick={() => updateStatus(winner.id, 'paid')}>Mark Paid</Button>
                  )}
                </td>
              </tr>
            ))}
            {winners.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-muted-text">No winners found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
