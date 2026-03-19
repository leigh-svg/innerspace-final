'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ProConsultancyCard = ({ designerName, avatarUrl, availability }) => {
  return (
    // CHANGED: glass-card -> glass-card-deep for the enhanced blur + gradient border
    <div className="relative glass-card-deep overflow-hidden p-8 flex flex-col items-center text-center group max-w-sm w-full mx-auto rounded-2xl">
      {/* Enhanced Background Glow Effect */}
      <div className="absolute top-0 right-0 -m-16 w-48 h-48 bg-brand-gold/15 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-12 w-32 h-32 bg-brand-bone/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms] pointer-events-none" />
      
      {/* Sub-heading */}
      <motion.span 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-sans text-[10px] uppercase tracking-[0.3em] font-medium text-brand-gold mb-6 relative z-10 block"
      >
        Hybrid Pro-Consulting
      </motion.span>

      {/* Designer Avatar */}
      <div className="relative mb-6 z-10">
        {/* 1px gradient border ring using a pseudo wrapper */}
        <div className="relative w-24 h-24 rounded-full p-px"
          style={{ background: 'linear-gradient(to bottom, rgba(245,245,240,0.25), rgba(245,245,240,0.04))' }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-brand-charcoal-light">
            <img 
              src={avatarUrl} 
              alt={designerName}
              className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
            />
          </div>
        </div>
        
        {/* Availability Badge */}
        {availability === 'online' && (
          <div className="absolute bottom-1 right-1 flex items-center justify-center w-5 h-5 bg-brand-charcoal rounded-full border border-brand-bone/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>
        )}
      </div>

      {/* Copy */}
      <h3 className="font-serif text-2xl text-brand-bone mb-2 z-10 relative">Your Concierge: {designerName}</h3>
      <p className="font-sans text-sm text-brand-bone-dark font-light leading-relaxed mb-8 max-w-[250px] z-10 relative">
        Review scan dimensions, finalize layout nuances, or override AI suggestions with a Lead Architect.
      </p>

      {/* Floating Action Button */}
      <button className="btn-accent w-full flex items-center justify-center space-x-2 z-10 relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <span>Book Video Call</span>
      </button>

      {/* Footnote */}
      <span className="font-sans text-[10px] text-brand-bone-dark/50 mt-4 uppercase tracking-widest z-10 relative">
        Complementary for Luxury Suite
      </span>
    </div>
  );
};

export default ProConsultancyCard;
