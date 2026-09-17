import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Charities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allocation, setAllocation] = useState(15);
  const [selectedCauseId, setSelectedCauseId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const { user } = useAuth();

  useEffect(() => {
    fetchCharities();
    if (user) loadCurrentCharity();
  }, [user]);

  const loadCurrentCharity = async () => {
    try {
      const { data } = await api.get('/api/users/profile');
      if (data?.data?.charity?.id) {
        setSelectedCauseId(data.data.charity.id);
      }
      if (data?.data?.subscription?.charityPercentage) {
        setAllocation(data.data.subscription.charityPercentage);
      }
    } catch {
      // silently ignore — user may not be logged in
    }
  };

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/charities');
      if (response.data && response.data.data) {
        setCharities(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch charities:', err);
      setError('Unable to load charities from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSelectCause = async (charity) => {
    if (!user) {
      showToast('Please login to select a charity cause.', 'error');
      return;
    }

    try {
      await api.put('/api/subscriptions/charity', {
        charityId: charity.id,
        charityPercentage: allocation,
      });
      setSelectedCauseId(charity.id);
      showToast(`💚 "${charity.name}" saved as your cause! Dashboard updated.`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 400 && msg.includes('No subscription')) {
        setSelectedCauseId(charity.id);
        showToast(`"${charity.name}" selected! Subscribe to lock in your donation.`, 'success');
      } else {
        showToast(msg || 'Failed to save charity. Please try again.', 'error');
      }
    }
  };



  const formatCurrency = (cents) => {
    if (!cents) return '$0';
    const amount = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {toastMessage && (
        <div className={`fixed top-24 right-6 z-50 ${toastType === 'error' ? 'bg-red-600' : 'bg-emerald-700'} text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm`}>
          <span>{toastType === 'error' ? '⚠️' : '💚'}</span>
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      <Hero
        backgroundGradients={
          <div className="absolute inset-0 bg-gradient-to-br from-[#052214] via-[#083620] to-[#0d4a2c]" />
        }
        floatingElements={
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-[15%] right-[12%] w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute bottom-[20%] left-[8%] w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
            />
          </>
        }
        subtitle={<span className="text-accent/80">Charity Partners</span>}
        title={
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05]">
            Empowering<br />
            <span className="text-accent">Communities</span><br />
            With Every Swing.
          </h1>
        }
        description="10% of every membership directly funds vetted, impactful causes. You choose where your contribution goes."
        buttons={
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 text-base bg-accent text-primary hover:bg-white border-none shadow-lg shadow-accent/20">
              Join &amp; Give Back &rarr;
            </Button>
          </Link>
        }
      />

      {/* Impact Allocator */}
      <section className="py-20 bg-[#011C14] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeUp}>
              <div className="text-accent font-semibold text-xs tracking-[0.2em] uppercase mb-3">Your Monthly Impact</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
                You Control<br />Your Giving
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                Every subscription automatically allocates a minimum of 10% to charity. Increase your impact anytime — up to 100%.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-display font-extrabold text-accent">{allocation}%</div>
                  <div className="text-white/60 text-sm mt-1">Current Allocation</div>
                </div>
                <div className="h-16 w-px bg-white/10" />
                <div className="text-center">
                  <div className="text-5xl font-display font-extrabold text-white">${((250 * allocation) / 100).toFixed(2)}</div>
                  <div className="text-white/60 text-sm mt-1">Monthly Gift</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <div className="text-accent font-semibold text-sm mb-6 uppercase tracking-wider">Allocation Slider</div>
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span className="text-white/80">Charity allocation</span>
                  <span className="text-accent font-bold">{allocation}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full relative">
                  <motion.div
                    animate={{ width: `${allocation}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>10% min</span>
                  <span>100% max</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[10, 25, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setAllocation(pct)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                      allocation === pct
                        ? 'bg-accent text-primary border-accent shadow-lg'
                        : 'border-white/10 text-white/70 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Charity Cards — Fetched directly from backend API */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.div variants={fadeUp} className="text-primary font-semibold text-xs tracking-[0.2em] uppercase mb-3">
              Supported Causes (Live API Data)
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Where Your Money Goes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-text text-lg max-w-xl mx-auto">
              Every charity is vetted by our team and synced in real-time from our backend system.
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-8 border border-border/40 animate-pulse h-64 flex flex-col justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 text-red-600 rounded-3xl p-8 border border-red-200">
              <p className="font-semibold mb-2">{error}</p>
              <Button onClick={fetchCharities} variant="outline" className="mt-4">
                Retry Fetching Backend Data
              </Button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {charities.map((c, i) => (
                <motion.div
                  key={c.id || i}
                  variants={fadeUp}
                  whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
                  className={`bg-white rounded-3xl p-8 border ${
                    selectedCauseId === c.id ? 'border-2 border-emerald-600 ring-4 ring-emerald-100' : 'border-border/40'
                  } flex flex-col gap-4 cursor-pointer transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">
                      {c.category || 'General Fund'}
                    </span>
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <span className="text-3xl">🌟</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-primary">{c.name}</h3>
                  <p className="text-muted-text text-sm leading-relaxed flex-grow">{c.description}</p>

                  <div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="font-bold text-primary">{formatCurrency(c.total_funded)} total raised</span>
                      <span className="text-emerald-700 font-semibold">Active Cause</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-4/5" />
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectCause(c)}
                    variant={selectedCauseId === c.id ? 'secondary' : 'primary'}
                    className={`w-full rounded-xl mt-2 ${
                      selectedCauseId === c.id
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {selectedCauseId === c.id ? '✓ Selected Cause' : 'Select This Cause \u2192'}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

