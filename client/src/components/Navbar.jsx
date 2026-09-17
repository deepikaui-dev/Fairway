import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => currentPath === path;

  const navLinkClass = (path) => {
    const baseClass = "text-text hover:text-primary transition-colors pb-1";
    return isActive(path) 
      ? `${baseClass} border-b-2 border-primary text-primary font-semibold` 
      : baseClass;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="w-full bg-surface border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-start leading-none group">
              <div className="flex items-center gap-1 font-display font-bold text-2xl text-primary tracking-tight">
                FAIRWAY
              </div>
              <div className="text-[10px] text-primary/70 font-medium ml-0.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                THE GOLF CLUB <span className="text-[10px]">🏌️‍♂️</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center text-sm font-medium">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>How it Works</Link>
            <Link to="/charities" className={navLinkClass('/charities')}>Charities</Link>
            <Link to="/draws" className={navLinkClass('/draws')}>Draws</Link>
            <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
          </div>

          <div className="flex space-x-4 items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-background border border-border transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label="User Menu"
                >
                  <div className="w-9 h-9 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center shadow-inner">
                    {getInitials(user?.full_name || user?.email)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text max-w-[120px] truncate">
                    {user?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-muted-text transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text truncate">
                          {user?.full_name || 'Member'}
                        </p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isAdmin ? 'Admin' : 'Member'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-text truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-background hover:text-primary transition-colors font-medium"
                        >
                          <span className="text-base">📊</span> Admin Command Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-background hover:text-primary transition-colors font-medium"
                        >
                          <span className="text-base">👤</span> Member Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-border pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors font-medium"
                      >
                        <span className="text-base">🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-4 items-center">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full px-6 text-sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="rounded-full px-6 text-sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
