import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SubscriptionFlow } from '../components/SubscriptionFlow';

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-7 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-100 text-emerald-800',
    inactive: 'bg-gray-100 text-gray-600',
    lapsed: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-blue-100 text-blue-800',
    paid: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status || 'Unknown'}
    </span>
  );
}

export function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [drawEntries, setDrawEntries] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState(false);

  // Score form state
  const [scoreForm, setScoreForm] = useState({ stableford: '', score_date: new Date().toISOString().split('T')[0], notes: '' });
  const [scoreSubmitting, setScoreSubmitting] = useState(false);
  const [scoreError, setScoreError] = useState('');
  const [scoreSuccess, setScoreSuccess] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [profileRes, scoresRes, drawRes, winningsRes] = await Promise.all([
        api.get('/api/users/profile'),
        api.get('/api/scores'),
        api.get('/api/draws/my-entries'),
        api.get('/api/winners/me'),
      ]);
      setProfile(profileRes.data.data);
      setScores(scoresRes.data.data || []);
      setDrawEntries(drawRes.data.data || []);
      setWinnings(winningsRes.data.data || []);

      if (!profileRes.data.data?.subscription || profileRes.data.data.subscription.status !== 'active') {
        setShowSubscriptionFlow(true);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load some dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    setScoreError('');
    setScoreSuccess('');
    const val = parseInt(scoreForm.stableford, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      setScoreError('Stableford score must be between 1 and 45.');
      return;
    }
    setScoreSubmitting(true);
    try {
      await api.post('/api/scores', {
        stableford: val,
        scoreDate: scoreForm.score_date,
        notes: scoreForm.notes,
      });
      setScoreSuccess('Score added successfully!');
      setScoreForm({ stableford: '', score_date: new Date().toISOString().split('T')[0], notes: '' });
      const res = await api.get('/api/scores');
      setScores(res.data.data || []);
    } catch (err) {
      setScoreError(err.response?.data?.message || 'Failed to add score. Date may already have an entry.');
    } finally {
      setScoreSubmitting(false);
    }
  };

  const handleDeleteScore = async (id) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      await api.delete(`/api/scores/${id}`);
      setScores(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete score.');
    }
  };

  const formatCents = (cents) => {
    if (!cents) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  const charityContribution = profile?.subscription
    ? (profile.subscription.monthlyAmountCents * (profile.subscription.charityPercentage / 100)) / 100
    : 0;

  const activeDrawEntry = drawEntries.find(e => e.draw_status !== 'published');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Member Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold">
                Welcome back, {user?.full_name || profile?.fullName || 'Golfer'}! ⛳
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Your entries actively support verified charities while putting you in line for major draw prizes.
              </p>
            </div>
            <Link to="/draws">
              <Button variant="secondary" className="bg-white text-primary hover:bg-surface border-none shadow-md shrink-0">
                View Active Draws
              </Button>
            </Link>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
          ) : (
            <>
              <div className="card border-l-4 border-l-primary">
                <p className="text-xs text-muted-text uppercase font-semibold">Subscription Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-2xl font-bold text-text capitalize">
                    {profile?.subscription?.status || 'No Plan'}
                  </p>
                  {profile?.subscription && <StatusBadge status={profile.subscription.status} />}
                </div>
                <p className="text-xs text-muted-text mt-2 capitalize">
                  {profile?.subscription ? `${profile.subscription.plan} · ${formatCents(profile.subscription.monthlyAmountCents)}/mo` : 'Subscribe to enter draws & charities'}
                </p>
              </div>

              <div className="card border-l-4 border-l-emerald-500">
                <p className="text-xs text-muted-text uppercase font-semibold">Monthly Charity Contribution</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {formatCents(charityContribution * 100)}
                </p>
                <p className="text-xs text-muted-text mt-2">
                  {profile?.subscription
                    ? `${profile.subscription.charityPercentage}% of your subscription · ${profile.charity?.name || 'No charity selected'}`
                    : 'Subscribe to start contributing'}
                </p>
              </div>

              <div className="card border-l-4 border-l-amber-500">
                <p className="text-xs text-muted-text uppercase font-semibold">Current Draw Entry</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {activeDrawEntry ? `Ticket Active` : 'No Active Entry'}
                </p>
                <p className="text-xs text-muted-text mt-2">
                  {activeDrawEntry
                    ? `Numbers: ${activeDrawEntry.ticket_numbers?.join(', ') || 'N/A'}`
                    : 'Active subscription required for draw entry'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Score Entry + History */}
          <div className="card relative">
            <h3 className="text-lg font-display font-bold text-text mb-5 flex items-center gap-2">
              ⛳ Golf Scores <span className="text-xs text-muted-text font-normal">(Rolling 5-Score Stableford)</span>
            </h3>

            {/* Add Score Form */}
            <form onSubmit={handleAddScore} className="bg-surface border border-border rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-muted-text uppercase mb-3">Add New Score</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-xs text-muted-text mb-1">Stableford (1–45)</label>
                  <input
                    type="number"
                    min="1" max="45"
                    className="input-field text-sm"
                    placeholder="e.g. 32"
                    value={scoreForm.stableford}
                    onChange={e => setScoreForm({ ...scoreForm, stableford: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[130px]">
                  <label className="block text-xs text-muted-text mb-1">Date</label>
                  <input
                    type="date"
                    className="input-field text-sm"
                    value={scoreForm.score_date}
                    onChange={e => setScoreForm({ ...scoreForm, score_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              {scoreError && <p className="text-xs text-red-600 font-medium mt-2">⚠️ {scoreError}</p>}
              {scoreSuccess && <p className="text-xs text-emerald-600 font-medium mt-2">✓ {scoreSuccess}</p>}
              <Button type="submit" disabled={scoreSubmitting} className="mt-3 w-full bg-primary text-white rounded-lg text-sm">
                {scoreSubmitting ? 'Saving...' : '+ Add Score'}
              </Button>
            </form>

            {/* Score History */}
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(n => <div key={n} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : scores.length === 0 ? (
              <p className="text-sm text-muted-text text-center py-6">No scores recorded yet. Add your first score above.</p>
            ) : (
              <div className="space-y-2">
                {scores.slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3">
                    <div>
                      <span className="font-bold text-primary text-lg">{s.stableford}</span>
                      <span className="text-xs text-muted-text ml-1">pts</span>
                    </div>
                    <span className="text-xs text-muted-text">{new Date(s.score_date).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDeleteScore(s.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {scores.length > 5 && (
                  <p className="text-xs text-muted-text text-center">Showing 5 most recent of {scores.length} total</p>
                )}
              </div>
            )}

            {/* Blur overlay if not active */}
            {(!profile?.subscription || profile.subscription.status !== 'active') && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-border">
                <p className="text-primary font-bold mb-2">Subscription Required</p>
                <Button onClick={() => setShowSubscriptionFlow(true)} variant="primary" className="text-sm">
                  Choose a Plan
                </Button>
              </div>
            )}
          </div>

          {/* Draw & Charity Summary */}
          <div className="flex flex-col gap-6">

            {/* Charity Card */}
            <div className="card">
              <h3 className="text-lg font-display font-bold text-text mb-4 flex items-center gap-2">
                💚 Your Supported Charity
              </h3>
              {loading ? (
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ) : profile?.charity ? (
                <div className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4">
                  {profile.charity.imageUrl && (
                    <img src={profile.charity.imageUrl} alt={profile.charity.name} className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-primary">{profile.charity.name}</p>
                    <p className="text-xs text-muted-text mt-0.5">
                      {profile.subscription?.charityPercentage}% of your plan goes here each month
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-text mb-3">No charity selected yet.</p>
                  <Link to="/charities">
                    <Button variant="outline" className="text-sm">Browse & Select a Cause →</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Draw Entries */}
            <div className="card flex-1">
              <h3 className="text-lg font-display font-bold text-text mb-4 flex items-center gap-2">
                🎲 My Draw Entries
              </h3>
              {loading ? (
                <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ) : drawEntries.length === 0 ? (
                <p className="text-sm text-muted-text text-center py-4">No draw entries yet. An active subscription gives you automatic monthly entries.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {drawEntries.slice(0, 5).map(entry => (
                    <div key={entry.id} className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {new Date(entry.draw_year, entry.draw_month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-muted-text font-mono">{entry.ticket_numbers?.join(' · ')}</p>
                      </div>
                      <StatusBadge status={entry.draw_status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Winnings */}
            {winnings.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-display font-bold text-text mb-4 flex items-center gap-2">
                  🏆 My Winnings
                </h3>
                <div className="space-y-2">
                  {winnings.map(w => (
                    <div key={w.id} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-amber-800">{formatCents(w.prize_amount_cents)}</p>
                        <p className="text-xs text-muted-text">Match {w.match_tier} Winner</p>
                      </div>
                      <StatusBadge status={w.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showSubscriptionFlow && (
          <SubscriptionFlow 
            onSuccess={() => {
              setShowSubscriptionFlow(false);
              fetchAll();
            }}
            onCancel={profile?.subscription?.status === 'active' ? () => setShowSubscriptionFlow(false) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
