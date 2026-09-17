import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const infoCards = [
  {
    tag: 'Support Desk',
    tagColor: 'text-emerald-600 bg-emerald-50',
    emoji: '💬',
    title: 'Member Support',
    email: 'support@fairwayclub.com',
    detail: 'Mon – Fri, 8:00 AM – 6:00 PM',
  },
  {
    tag: 'Charities',
    tagColor: 'text-amber-600 bg-amber-50',
    emoji: '🤝',
    title: 'Charity Partnerships',
    email: 'partnerships@fairwayclub.com',
    detail: 'Direct inquiries for verified 501(c)(3) entities',
  },
  {
    tag: 'Headquarters',
    tagColor: 'text-blue-600 bg-blue-50',
    emoji: '🏢',
    title: 'Club Office',
    email: 'Fairway Global Holdings',
    detail: 'St. Andrews Way, London & New York',
  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden">

      <Hero
        backgroundGradients={
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#052214] via-[#083620] to-[#0c3a22]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(138,185,149,0.1),transparent_60%)]" />
          </>
        }
        floatingElements={
          <>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[25%] right-[15%] text-5xl"
            >
              ✉️
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-[30%] right-[25%] text-4xl"
            >
              📞
            </motion.div>
          </>
        }
        subtitle={<span className="text-accent/80">Get In Touch</span>}
        title={
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05]">
            We'd Love<br />
            to Hear<br />
            <span className="text-accent">From You.</span>
          </h1>
        }
        description="Have questions about membership, prize draws, or charity partnerships? Our team is here to help."
      />

      {/* Contact Main Content */}
      <section className="py-20 relative">
        {/* Decorative top bg */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#011C14] -z-0" />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-surface z-0 translate-y-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/20">

            {/* Left — dark panel */}
            <div className="bg-[#022A1E] text-white p-10 md:p-14 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Contact Information</h2>
                <p className="text-white/60 text-base leading-relaxed mb-10">
                  Fill in the form and our team will be in touch within 24 hours.
                </p>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="space-y-8"
                >
                  {infoCards.map((card, i) => (
                    <motion.div key={i} variants={fadeUp} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
                        {card.emoji}
                      </div>
                      <div>
                        <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">{card.tag}</div>
                        <div className="font-bold text-white text-base">{card.title}</div>
                        <div className="text-accent text-sm">{card.email}</div>
                        <div className="text-white/40 text-xs mt-0.5">{card.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Decorative bottom text */}
              <div className="mt-12 text-white/10 font-display font-bold text-5xl italic select-none">
                Fairway.
              </div>
            </div>

            {/* Right — form panel */}
            <div className="p-10 md:p-14 bg-white">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-display font-bold text-primary mb-2">Message Sent!</h3>
                  <p className="text-muted-text">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="space-y-6"
                >
                  <motion.div variants={fadeUp}>
                    <h2 className="text-3xl font-display font-bold text-primary mb-2">Send a Message</h2>
                    <p className="text-muted-text text-sm">We read every message personally.</p>
                    {error && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label className="block text-sm font-bold text-primary mb-2" htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label className="block text-sm font-bold text-primary mb-2" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label className="block text-sm font-bold text-primary mb-2" htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      type="text"
                      placeholder="Membership, Draw Inquiry, or Charity Partnership"
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label className="block text-sm font-bold text-primary mb-2" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm resize-none"
                      required
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full py-4 text-base font-bold rounded-xl bg-[#022A1E] hover:bg-primary disabled:opacity-70"
                    >
                      {loading ? 'Sending...' : 'Send Message →'}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
