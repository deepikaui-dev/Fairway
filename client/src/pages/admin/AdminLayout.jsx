import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Draws', path: '/admin/draws', icon: '🎲' },
    { name: 'Charities', path: '/admin/charities', icon: '💚' },
    { name: 'Winners', path: '/admin/winners', icon: '🏆' },
    { name: 'Messages', path: '/admin/messages', icon: '✉️' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-surface border-b border-border p-4 flex justify-between items-center z-20">
        <Link to="/" className="text-xl font-display font-bold text-primary flex items-center gap-2">
          Fairway <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-md">Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text hover:bg-muted focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            Fairway <span className="text-sm bg-primary/20 text-primary px-2.5 py-1 rounded-md">Admin</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-muted-text hover:text-text"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text hover:bg-muted'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center mb-2 px-4 py-2 rounded-lg text-xs font-semibold text-muted-text hover:text-primary hover:bg-muted transition-colors"
          >
            ← View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 font-medium text-sm transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50 p-4 sm:p-6 lg:p-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
