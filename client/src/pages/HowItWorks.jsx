import React from 'react';
import { Link } from 'react-router-dom';
import step1Img from '../assets/step1.png';
import step2Img from '../assets/step2.png';

export function HowItWorks() {
  return (
    <div className="flex flex-col bg-background pt-8 pb-24">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-4 font-semibold text-primary tracking-widest text-sm uppercase">How it Works</div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-16 text-primary max-w-2xl leading-tight">
          How Fairway Works: Your Journey to Community & Impact
        </h1>

        {/* Desktop Zigzag / Grid Layout */}
        <div className="relative">
          {/* Center Image (Visible mostly on desktop in center) */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 z-0">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop" 
                alt="Golf ball on green" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <h3 className="font-display text-4xl text-white font-bold drop-shadow-lg italic transform -rotate-6">
                  Good Golf.<br />Greater Impact.
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 relative z-10">
            {/* Step 1 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col md:flex-row gap-8 items-center lg:translate-x-12 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-1">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E8F3F1] text-primary flex items-center justify-center text-xl">👥</div>
                  <div className="w-12 h-12 rounded-full bg-[#E8F3F1] text-primary flex items-center justify-center text-xl">✓</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Step 1: Join & Connect</h3>
                <p className="text-muted-text mb-6">
                  Become a member. Choose your profile, set your handicap, and join a global community.
                </p>
                <Link to="/register" className="font-semibold text-primary hover:underline flex items-center gap-2">
                  Learn about membership &rarr;
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl overflow-hidden">
                <img src={step1Img} alt="Join" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col md:flex-row gap-8 items-center lg:-translate-x-12 lg:translate-y-24 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-1">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E5F0FC] text-[#3478F6] flex items-center justify-center text-xl">📊</div>
                  <div className="w-12 h-12 rounded-full bg-[#FCE8F3] text-[#D13D83] flex items-center justify-center text-xl">♡</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Step 2: Play & Impact</h3>
                <p className="text-muted-text mb-6">
                  Log your rounds, track your scores, and see your personal impact grow. Discover charity events.
                </p>
              </div>
              <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl overflow-hidden">
                <img src={step2Img} alt="Play" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col md:flex-row gap-8 items-center lg:translate-x-12 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-1">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#FFF5E5] text-[#F59E0B] flex items-center justify-center text-xl">🏆</div>
                  <div className="w-12 h-12 rounded-full bg-[#FFF5E5] text-[#F59E0B] flex items-center justify-center text-xl">🎟️</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Step 3: Win & Celebrate</h3>
                <p className="text-muted-text mb-6">
                  Participate in monthly draws. Win exclusive rewards and access member-only experiences.
                </p>
                <Link to="/draws" className="font-semibold text-primary hover:underline flex items-center gap-2">
                  View past draws &rarr;
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=600&auto=format&fit=crop" alt="Win" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-border/50 flex flex-col md:flex-row gap-8 items-center lg:-translate-x-12 lg:translate-y-24 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex-1">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#299554] flex items-center justify-center text-xl">🤝</div>
                  <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#299554] flex items-center justify-center text-xl">🌱</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">Step 4: Give & Grow</h3>
                <p className="text-muted-text mb-6">
                  See your contributions in action. Partner with charities, share stories, and grow your impact.
                </p>
              </div>
              <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=600&auto=format&fit=crop" alt="Give" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
