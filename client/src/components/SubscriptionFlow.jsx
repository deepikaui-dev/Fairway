import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import api from '../services/api';

export function SubscriptionFlow({ onSuccess, onCancel }) {
  const [selectedPlan, setSelectedPlan] = useState(null); // 'monthly' | 'yearly'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$250',
      period: '/mo',
      features: ['Enter monthly prize draws', 'Support a charity of your choice', 'Performance tracking'],
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$2,500',
      period: '/yr',
      features: ['Enter monthly prize draws', 'Support a charity of your choice', 'Performance tracking', 'Save $500 annually'],
      badge: 'Best Value',
    }
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    setError(null);
    try {
      // Mocked payment - we call the backend to create the active subscription
      await api.post('/api/subscriptions/create', { plan: selectedPlan });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface w-full max-w-4xl rounded-3xl shadow-xl border border-border/50 overflow-hidden relative my-8"
      >
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-muted-text hover:text-text rounded-full hover:bg-muted"
          >
            ✕
          </button>
        )}

        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Choose Your Plan</h2>
          <p className="text-muted-text max-w-lg mx-auto mb-10">
            Join the Fairway community. Track your performance, support incredible causes, and get a chance to win every month.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 text-left">
            {plans.map(plan => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col ${
                  selectedPlan === plan.id 
                    ? 'border-primary bg-primary/5 shadow-md transform -translate-y-1' 
                    : 'border-border hover:border-primary/40 bg-white'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text">{plan.name}</h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {selectedPlan === plan.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-text font-medium">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text">
                      <span className="text-emerald-500 mt-0.5">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-gray-50 border border-border rounded-xl p-5 mb-6 text-left">
                  <h4 className="font-semibold text-text mb-3">Payment Details</h4>
                  {error && <div className="mb-3 text-red-600 text-sm font-medium">{error}</div>}
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Card Number (Mocked)" 
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white"
                      disabled
                      value="•••• •••• •••• 4242"
                    />
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-1/2 px-3 py-2 border border-border rounded-lg text-sm bg-white"
                        disabled
                        value="12/26"
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        className="w-1/2 px-3 py-2 border border-border rounded-lg text-sm bg-white"
                        disabled
                        value="123"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-text mt-3 text-center">
                    This is a simulated payment flow. No real card is required.
                  </p>
                </div>
                
                <Button 
                  onClick={handleSubscribe} 
                  disabled={loading}
                  className="w-full py-4 text-base font-bold bg-[#022A1E] text-white hover:bg-primary rounded-xl"
                >
                  {loading ? 'Processing Payment...' : `Pay ${plans.find(p => p.id === selectedPlan)?.price} Now`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
