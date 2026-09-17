import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import api from '../services/api';

const tiers = [
  {
    label: '5-Number Match',
    share: '40% Pool Share',
    shareColor: 'bg-amber-100 text-amber-700',
    amount: '$14,000',
    note: 'Jackpot Rollover',
    accent: 'from-amber-400 to-orange-500',
    icon: '🏆',
    desc: 'Evenly split among 5-match tickets. Rolls over to next month if unclaimed.',
  },
  {
    label: '4-Number Match',
    share: '35% Pool Share',
    shareColor: 'bg-emerald-100 text-emerald-700',
    amount: '$12,250',
    note: 'Fixed Distribution',
    accent: 'from-emerald-400 to-teal-500',
    icon: '🥈',
    desc: 'Evenly split among 4-match winners. Does not roll over; paid out monthly.',
  },
  {
    label: '3-Number Match',
    share: '25% Pool Share',
    shareColor: 'bg-blue-100 text-blue-700',
    amount: '$8,750',
    note: 'Community Dividend',
    accent: 'from-blue-400 to-indigo-500',
    icon: '🥉',
    desc: 'Evenly split among all 3-match holders. Paid directly to member accounts.',
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

function Countdown() {
  const [time, setTime] = useState({ days: 14, hours: 8, minutes: 42, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-3">
      {[
        { v: pad(time.days), l: 'Days' },
        { v: pad(time.hours), l: 'Hours' },
        { v: pad(time.minutes), l: 'Mins' },
        { v: pad(time.seconds), l: 'Secs' },
      ].map(({ v, l }, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-white/30 text-3xl font-light">:</span>}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-display font-extrabold text-white">
              {v}
            </div>
            <span className="text-white/40 text-xs mt-1 tracking-wider">{l}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export function Draws() {
  const [upcomingDraw, setUpcomingDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    fetchDrawData();
  }, []);

  const fetchDrawData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/draws/upcoming');
      if (res.data && res.data.data) {
        setUpcomingDraw(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching draw data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOddsClick = (tierLabel) => {
    setModalMessage(`Simulation Odds for ${tierLabel}: 1 in 1,000 algorithmic match chance per monthly entry.`);
  };

  const formatCents = (cents) => {
    if (!cents) return '$35,000';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {modalMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-border">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="text-xl font-bold font-display text-primary mb-2">Prize Simulation Info</h3>
            <p className="text-muted-text text-sm mb-6 leading-relaxed">{modalMessage}</p>
            <Button onClick={() => setModalMessage(null)} className="w-full bg-primary text-white rounded-xl">
              Got it
            </Button>
          </div>
        </div>
      )}

      <Hero
        backgroundGradients={
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A10] via-[#0d2e1a] to-[#1a4428]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,175,55,0.15),transparent_60%)]" />
          </>
        }
        floatingElements={
          <>
            {['💰', '🎰', '💎'].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
                className="absolute text-4xl"
                style={{ top: `${25 + i * 18}%`, right: `${10 + i * 8}%` }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        }
        subtitle={<span className="text-accent/80">Monthly Prize Draws</span>}
        title={
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05]">
            Transparent<br />
            <span className="text-accent">Draws.</span><br />
            Verified Jackpots.
          </h1>
        }
        description="Every subscription generates verified 5-number draw tickets. 100% auditable, 100% fair payouts."
        buttons={
          <Link to="/register">
            <Button size="lg" className="rounded-full px-8 text-base bg-accent text-primary hover:bg-white border-none shadow-lg shadow-accent/20">
              Enter the Draw &rarr;
            </Button>
          </Link>
        }
      />

      {/* Jackpot Hero Panel */}
      <section className="py-20 bg-[#011C14] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
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
              <div className="text-accent font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                Next Official Draw &bull; {upcomingDraw?.draw_date ? new Date(upcomingDraw.draw_date).toLocaleDateString() : 'October 1, 2026'}
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-4 leading-tight">
                Jackpot<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                  {formatCents(upcomingDraw?.total_prize_pool_cents)}
                </span>
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                Includes rollover from previous cycle &bull; {upcomingDraw?.eligible_entries || '1,248'} active verified entrants
              </p>
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 bg-accent text-primary hover:bg-white border-none shadow-lg">
                  Get Your Ticket &rarr;
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-4 text-center">Draw Closes In</div>
              <div className="flex justify-center">
                <Countdown />
              </div>
              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Automated Algorithmic Draw — Fully Verified
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prize Tier Cards */}
      <section className="py-20 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp} className="text-primary font-semibold text-xs tracking-[0.2em] uppercase mb-3">
              Prize Structure
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-bold text-primary">
              How Prizes Are Split
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl overflow-hidden border border-border/40 shadow-sm flex flex-col transition-shadow hover:shadow-xl"
              >
                <div className={`h-2 bg-gradient-to-r ${tier.accent}`} />

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${tier.shareColor}`}>{tier.share}</span>
                    <span className="text-3xl">{tier.icon}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-primary mb-2">{tier.label}</h3>
                  <div className="text-4xl font-display font-extrabold text-primary mb-1">{tier.amount}</div>
                  <div className="text-sm font-semibold text-emerald-600 mb-4">{tier.note}</div>
                  <p className="text-muted-text text-sm leading-relaxed flex-grow mb-8">{tier.desc}</p>
                  <Button
                    onClick={() => handleOddsClick(tier.label)}
                    variant="outline"
                    className="w-full rounded-xl border-border/70 hover:bg-gray-50"
                  >
                    View Simulation Odds &rarr;
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

