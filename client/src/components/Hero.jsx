import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Hero({ 
  imageSrc, 
  backgroundGradients, 
  floatingElements, 
  subtitle, 
  title, 
  description, 
  buttons,
  bottomContent,
  rightContent
}) {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

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

  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary text-white overflow-hidden pt-20 rounded-b-[3rem] shadow-2xl">
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        {imageSrc && (
          <img 
            src={imageSrc} 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        {backgroundGradients}
      </motion.div>
      
      {floatingElements && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {floatingElements}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="flex flex-col h-full"
          >
            {subtitle && (
              <motion.div variants={fadeInUp} className="mb-6 font-semibold text-white/70 tracking-[0.2em] text-xs uppercase flex items-center gap-4">
                {subtitle}
              </motion.div>
            )}
            
            {title && (
              <motion.div variants={fadeInUp} className="mb-6">
                {title}
              </motion.div>
            )}
            
            {description && (
              <motion.div variants={fadeInUp} className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light max-w-lg">
                {description}
              </motion.div>
            )}
            
            {buttons && (
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-12">
                {buttons}
              </motion.div>
            )}

          </motion.div>

          {rightContent && (
            <motion.div 
              initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden md:flex justify-end items-start h-full"
            >
              {rightContent}
            </motion.div>
          )}
        </div>

        {bottomContent && (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="mt-16 w-full"
          >
            <motion.div variants={fadeInUp}>
              {bottomContent}
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Curved bottom edge */}
      {!imageSrc && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <svg className="absolute top-10 right-[20%] w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
      )}
      
      {imageSrc && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.8,30.34,143.9,42.59,213.3,47.38,250.32,49.95,287.42,51.81,321.39,56.44Z" className="fill-[#011C14]"></path>
          </svg>
        </div>
      )}
    </section>
  );
}
