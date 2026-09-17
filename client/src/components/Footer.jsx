import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { IoArrowForward } from 'react-icons/io5';

import { Newsletter } from './Newsletter';

export function Footer() {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const footer = footerRef.current;
    if (footer) {
      footer.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (footer) {
        footer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative bg-primary text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Flashlight Effect */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-30 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Logo and Socials */}
        <div className="md:col-span-4 lg:col-span-3">
          <Link to="/" className="flex items-center gap-2 mb-6 text-2xl font-display font-bold">
            <span className="text-3xl text-white">⛳</span> FAIRWAY
          </Link>
          <div className="flex gap-4 mb-8">
            <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <FaLinkedinIn />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <FaXTwitter />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
            <li><Link to="/charities" className="hover:text-white transition-colors">Charities</Link></li>
            <li><Link to="/draws" className="hover:text-white transition-colors">Draws</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="md:col-span-2 lg:col-span-2">
          <h4 className="font-semibold text-lg mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Help</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-4 lg:col-span-5 relative">
          <Newsletter />
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 relative z-10">
        <p>&copy; {new Date().getFullYear()} Fairway. All rights reserved.</p>
      </div>
    </footer>
  );
}
