import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';

import storySnehaImg from '../assets/story-sneha.png';
import storyArjunImg from '../assets/story-arjun.png';

export function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="flex flex-col bg-background pt-16 overflow-hidden">
      
      <Hero
        backgroundGradients={
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B2519] via-[#0E3524] to-[#164E36]"></div>
        }
        subtitle={
          <span className="text-[#8EB7A1]">About Fairway</span>
        }
        title={
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] text-[#9BC7AF]">
            More Than Golf.<br />A Greater Purpose.
          </h1>
        }
        description="Fairway is a modern membership club that brings together the love of golf, the excitement of monthly prize draws, and the power of giving back."
        buttons={
          <>
            <button className="w-14 h-14 rounded-full bg-accent/20 border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300">
              <span className="text-xl translate-x-0.5">▶</span>
            </button>
            <span className="font-medium text-lg text-white">Our Story</span>
          </>
        }
        rightContent={
          <div className="relative text-accent/80 font-cursive text-4xl leading-relaxed transform rotate-6">
            Better<br/>Golf<br/>Brighter<br/>Futures
            <span className="block text-2xl mt-2 ml-4">♡</span>
          </div>
        }
      />

      {/* Our Story / Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-4"
          >
            <motion.div variants={fadeInUp} className="mb-4 font-semibold text-primary tracking-[0.15em] text-xs uppercase">Our Story</motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold mb-6 text-primary leading-tight">A Club Built on Community & Impact</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-text text-base mb-6 leading-relaxed">
              Fairway was created with a simple belief — golf can do more. It can bring people together, create opportunities, and make a real difference in the world.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-muted-text text-base mb-8 leading-relaxed">
              We're a membership club for golfers who want more than just a game. We combine the thrill of competition with the generosity of a community, giving members the chance to win amazing prizes while supporting meaningful charitable causes.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 text-base bg-primary hover:bg-[#0E3524]">Join the Club &rarr;</Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 relative h-[500px]"
          >
            <div className="absolute inset-0 bg-primary rounded-[2rem] transform translate-x-3 translate-y-3 opacity-20"></div>
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=600&auto=format&fit=crop" 
                alt="Golf hole" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-[20%] left-6 text-white font-cursive text-3xl leading-snug transform -rotate-6 text-shadow-sm">
                Good Golf.<br/>Greater Impact.
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-4 space-y-4"
          >
            {/* Feature Card 1 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#E8F8EE] text-primary flex items-center justify-center shrink-0 text-xl">
                ⛳
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Golf</h4>
                <p className="text-sm text-muted-text">Track your scores, improve your game, and be part of something bigger.</p>
              </div>
            </motion.div>
            
            {/* Feature Card 2 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#E8F8EE] text-primary flex items-center justify-center shrink-0 text-xl">
                🎁
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Win</h4>
                <p className="text-sm text-muted-text">Join our monthly prize draws and get the chance to win incredible rewards.</p>
              </div>
            </motion.div>
            
            {/* Feature Card 3 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#E8F8EE] text-primary flex items-center justify-center shrink-0 text-xl">
                ♡
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Give</h4>
                <p className="text-sm text-muted-text">Support verified charities and help create lasting change.</p>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-surface px-4 sm:px-6 lg:px-8 border-t border-border/50 rounded-t-[3rem] relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.div variants={fadeInUp} className="mb-2 font-semibold text-primary tracking-[0.15em] text-xs uppercase">Our Values</motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold mb-6 text-primary">What Drives Us</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-text text-lg max-w-2xl">
              At Fairway, our values shape everything we do — from the way we build our community to the impact we create together.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F3F1] text-primary flex items-center justify-center mb-6 text-2xl">👥</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Community</h3>
              <p className="text-muted-text text-sm">We believe in the power of people — on and off the course.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#FCE8F3] text-[#D13D83] flex items-center justify-center mb-6 text-2xl">♡</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Generosity</h3>
              <p className="text-muted-text text-sm">We make giving simple, meaningful and sustainable.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#E5F0FC] text-[#3478F6] flex items-center justify-center mb-6 text-2xl">🛡️</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Transparency</h3>
              <p className="text-muted-text text-sm">We keep our draws, winners and contributions open and verified.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F8EE] text-[#299554] flex items-center justify-center mb-6 text-2xl">🌱</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Positive Impact</h3>
              <p className="text-muted-text text-sm">We support real charities and help build a brighter future.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-surface px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto bg-[#0A1A14] rounded-[2.5rem] p-10 lg:p-14 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-60"></div>
          
          <div className="relative z-10">
            <div className="mb-3 font-semibold text-accent tracking-[0.15em] text-xs uppercase">Our Impact</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">Together, We Make a Difference</h2>
            <p className="text-white/70 text-base mb-8 max-w-md">
              Every membership, every round, every contribution helps support incredible causes and create lasting change in communities around the world.
            </p>
            <Link to="/charities">
              <Button variant="outline" className="rounded-full px-6 border-white/20 text-white hover:bg-white hover:text-primary">
                See Our Charities &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 relative z-10">
            <div>
              <div className="text-2xl mb-2 opacity-60">👥</div>
              <div className="text-3xl font-display font-bold mb-1">10,000+</div>
              <div className="text-xs text-white/50">Active Members</div>
            </div>
            <div>
              <div className="text-2xl mb-2 opacity-60">♡</div>
              <div className="text-3xl font-display font-bold mb-1">$250,000+</div>
              <div className="text-xs text-white/50">Donated to Charities</div>
            </div>
            <div>
              <div className="text-2xl mb-2 opacity-60">🎁</div>
              <div className="text-3xl font-display font-bold mb-1">500+</div>
              <div className="text-xs text-white/50">Monthly Prize Winners</div>
            </div>
            <div>
              <div className="text-2xl mb-2 opacity-60">🌱</div>
              <div className="text-3xl font-display font-bold mb-1">50+</div>
              <div className="text-xs text-white/50">Charity Partners</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface px-4 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-sm mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeInUp} className="mb-3 font-semibold text-primary tracking-[0.15em] text-xs uppercase">Our Community</motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold mb-4 text-primary">Real People. Real Stories.</motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-text text-base max-w-lg">
                From dedicated golfers to passionate changemakers, our members are the heart of Fairway. Their stories inspire us to keep going.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="outline" className="rounded-full px-6 flex-shrink-0 bg-white">
                Read Member Stories &rarr;
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Story 1 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col">
              <img src={storySnehaImg} alt="Member" className="w-full h-40 object-cover" />
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-primary font-medium text-sm italic mb-4 leading-relaxed">
                  "Fairway gives me the perfect balance — I get to play golf, win prizes and support causes I care about."
                </p>
                <div className="text-xs font-semibold text-muted-text uppercase tracking-wide">— Sneha R.</div>
              </div>
            </motion.div>
            
            {/* Story 2 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col">
              <img src={storyArjunImg} alt="Member" className="w-full h-40 object-cover" />
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-primary font-medium text-sm italic mb-4 leading-relaxed">
                  "It's more than a club. It's a community that believes in making a difference."
                </p>
                <div className="text-xs font-semibold text-muted-text uppercase tracking-wide">— Arjun M.</div>
              </div>
            </motion.div>

            {/* Story 3 */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col">
              <img src="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=600&auto=format&fit=crop" alt="Member" className="w-full h-40 object-cover" />
              <div className="p-6 flex-grow flex flex-col justify-between">
                <p className="text-primary font-medium text-sm italic mb-4 leading-relaxed">
                  "Seeing the impact we make through our contributions is truly rewarding."
                </p>
                <div className="text-xs font-semibold text-muted-text uppercase tracking-wide">— Priya S.</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
