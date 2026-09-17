import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Hero } from '../components/Hero';

export function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const statsBar = (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {[
          { icon: '👥', value: '10,000+', label: 'Active Members' },
          { icon: '♡', value: '$250,000+', label: 'Donated to Charities' },
          { icon: '🎁', value: '500+', label: 'Monthly Prizes Won' },
          { icon: '🌱', value: '50+', label: 'Charity Partners' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center text-center py-8 px-4 sm:px-6 gap-2 ${
              i !== 3 ? 'border-r border-white/10' : ''
            } ${i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''}`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white leading-none tracking-tight">
              {stat.value}
            </span>
            <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-widest font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="flex flex-col bg-background overflow-hidden relative">
      
      <Hero
        imageSrc="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2071&auto=format&fit=crop"
        backgroundGradients={
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#022A1E] via-[#022A1E]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#022A1E] via-transparent to-transparent"></div>
          </>
        }
        floatingElements={
          <>
            <motion.div 
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[30%] left-[55%] w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#5C4300] font-bold shadow-[0_0_15px_rgba(255,215,0,0.5)] border border-[#FFE866]"
            >$</motion.div>
            <motion.div 
              animate={{ y: [0, 30, 0], x: [0, -15, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[45%] left-[62%] w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#5C4300] font-bold text-lg shadow-[0_0_15px_rgba(255,215,0,0.5)] border border-[#FFE866]"
            >$</motion.div>
            <motion.div 
              animate={{ y: [0, -15, 0], x: [0, 20, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-[65%] left-[45%] w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#5C4300] font-bold text-xl shadow-[0_0_15px_rgba(255,215,0,0.5)] border border-[#FFE866]"
            >$</motion.div>
          </>
        }
        subtitle={
          <>
            <span>Fairway</span> 
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> 
            <span>The Golf Club</span>
          </>
        }
        title={
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.1]">
            Play. <span className="text-accent">Give.</span> Win.
          </h1>
        }
        description="More than just golf. Fairway is a community of members who play for a greater purpose — supporting real charities and winning amazing prizes."
        buttons={
          <>
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 text-base bg-accent text-primary hover:bg-white border-none shadow-lg shadow-accent/20">
                Join Now &rarr;
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-white/30 hover:bg-white/10 text-white">
                Learn More
              </Button>
            </Link>
          </>
        }
        bottomContent={statsBar}
      />

      {/* Charity Impact Section */}
      <section className="py-20 relative bg-[#011C14] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative z-10"
            >
              <motion.div variants={fadeInUp} className="mb-4 font-semibold text-accent tracking-[0.15em] text-xs uppercase">Charity Impact</motion.div>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-bold mb-6 text-white leading-tight">
                Real People.<br />Real Change.
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
                Your membership helps fund meaningful projects and support communities in need. Together, we can make a bigger impact.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Link to="/charities">
                  <Button size="lg" className="rounded-full px-8 text-base bg-accent text-primary hover:bg-white border-none shadow-lg">
                    Explore Charities &rarr;
                  </Button>
                </Link>
              </motion.div>
              
              {/* Hand-drawn element */}
              <motion.div 
                initial={{ opacity: 0, pathLength: 0 }}
                whileInView={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute top-[40%] right-[10%] opacity-40 pointer-events-none hidden md:block"
              >
                <svg width="150" height="120" viewBox="0 0 150 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20 Q 50 10 90 30 T 140 80" stroke="white" strokeWidth="1" strokeDasharray="4 4" fill="none"/>
                  <path d="M120 75 L 140 80 L 135 60" stroke="white" strokeWidth="1" fill="none"/>
                  <text x="30" y="80" fill="white" fontSize="12" fontFamily="cursive" transform="rotate(-15 30 80)">Small</text>
                  <text x="40" y="100" fill="white" fontSize="12" fontFamily="cursive" transform="rotate(-15 40 100)">contributions.</text>
                  <text x="60" y="120" fill="white" fontSize="14" fontFamily="cursive" transform="rotate(-15 60 120)">Big impact.</text>
                  <path d="M20 40 C 30 20, 50 20, 60 40 C 50 60, 30 60, 20 40" stroke="white" strokeWidth="1" fill="none"/>
                </svg>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-accent/20 rounded-[2rem] transform translate-x-4 translate-y-4 blur-xl"></div>
              <div className="relative rounded-[2rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Child holding plant" 
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Floating Card overlay */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute bottom-8 -right-8 md:right-8 bg-white rounded-2xl p-6 shadow-2xl max-w-[320px] text-primary"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-xl shrink-0">
                      📚
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight mb-1">Education for All</h4>
                      <p className="text-xs text-muted-text">Providing quality education to underprivileged children.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "68%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-accent rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>68% funded</span>
                      <span className="text-accent">&rarr;</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transition shape to next section */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none z-10 text-surface">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* Exciting Rewards Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-[-10%] top-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.div variants={fadeInUp} className="mb-2 font-semibold text-primary tracking-[0.15em] text-xs uppercase">Exciting Rewards</motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold mb-4 text-primary">This Month's Draw</motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-text text-lg max-w-md mb-6">
              The next draw is on <strong className="text-primary font-bold">30 Apr 2025</strong>. Be part of it and stand a chance to win amazing rewards!
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/draws">
                <Button variant="outline" className="rounded-full px-6 bg-white border-border hover:bg-gray-50">
                  View Draw Details &rarr;
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Prize Pool Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 bg-[#0A1A14] rounded-[2rem] p-8 md:p-12 text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-white/70 text-sm font-medium mb-2">Prize Pool</div>
                <div className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight">$50,000</div>
              </div>
            </motion.div>

            {/* How It Works Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-border/40 relative overflow-hidden"
            >
              <div className="flex flex-col h-full justify-center relative z-10">
                <div className="text-sm font-semibold text-muted-text mb-8">How It Works</div>
                <div className="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-gray-100">
                  <div className="px-2">
                    <div className="text-xs md:text-sm text-pink-500 font-medium mb-2">5 numbers</div>
                    <div className="text-3xl md:text-5xl font-display font-bold text-pink-500">40%</div>
                  </div>
                  <div className="px-2">
                    <div className="text-xs md:text-sm text-blue-500 font-medium mb-2">4 numbers</div>
                    <div className="text-3xl md:text-5xl font-display font-bold text-blue-500">35%</div>
                  </div>
                  <div className="px-2">
                    <div className="text-xs md:text-sm text-purple-500 font-medium mb-2">3 numbers</div>
                    <div className="text-3xl md:text-5xl font-display font-bold text-purple-500">25%</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Golf Ball Image */}
              <motion.img 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                src="https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=500&auto=format&fit=crop" 
                alt="Golf ball texture" 
                className="absolute -right-32 -bottom-32 w-80 h-80 object-cover rounded-full opacity-20 mix-blend-multiply"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 bg-surface px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1535136104889-4b62db515321?q=80&w=2000&auto=format&fit=crop" 
            alt="Golf course landscape" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#022A1E]/95 via-[#022A1E]/80 to-transparent"></div>
          
          <div className="relative z-10 px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 text-3xl">
                👥
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Join Fairway Today</h3>
                <p className="text-white/80">Be part of something bigger. Play, give, win.</p>
              </div>
            </div>
            
            <Link to="/register" className="shrink-0">
              <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-gray-100 shadow-xl">
                Get Started &rarr;
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

