import React from 'react';
import { IoArrowForward } from 'react-icons/io5';

export function Newsletter() {
  return (
    <div className="relative">
      <h4 className="font-semibold text-lg mb-2">Join Our Newsletter</h4>
      <p className="text-sm text-white/70 mb-4">Get the latest updates, events and impact stories.</p>
      
      <form className="relative flex items-center">
        <input 
          type="email" 
          placeholder="Enter your email address" 
          className="w-full bg-transparent border border-white/30 rounded-full py-3 px-6 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-accent transition-colors"
        />
        <button type="submit" className="absolute right-1 w-10 h-10 bg-[#88B097] rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors">
          <IoArrowForward />
        </button>
      </form>

      {/* Slanted text decorative element */}
      <div className="absolute right-0 -bottom-16 opacity-50 transform rotate-[-10deg] font-display text-4xl text-white/30 font-bold italic pointer-events-none">
        Play. Give. Win.
      </div>
    </div>
  );
}
