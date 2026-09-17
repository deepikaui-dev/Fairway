import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/stats');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-text">Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Active Subscribers" value={stats.activeSubscribers} />
          <StatCard title="Total Prize Pool" value={formatCurrency(stats.totalPrizePoolCents)} />
          <StatCard title="Active Charities" value={stats.activeCharities} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-muted-text mb-2">{title}</h3>
      <div className="text-3xl font-bold text-primary">{value}</div>
    </div>
  );
}
