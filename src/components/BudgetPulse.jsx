import React from 'react';
import { motion } from 'framer-motion';

const BudgetPulse = ({ totalSpend, budgetCap }) => {
  const percentage = Math.min((totalSpend / budgetCap) * 100, 100);
  const isOverBudget = totalSpend > budgetCap;

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      {/* Minimalist Header */}
      <motion.h3 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-brand-bone text-lg mb-8 tracking-wide"
      >
        The Budget Pulse
      </motion.h3>
      
      <div className="relative flex justify-center h-64 w-full">
        {/* The Vertical Track */}
        <div className="relative w-1 h-full bg-brand-charcoal-light rounded-full overflow-hidden">
          {/* The Expanding Gauge (fills from bottom up) */}
          <motion.div 
            className={`absolute bottom-0 w-full rounded-full ${isOverBudget ? 'bg-red-400/80 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : 'bg-brand-gold shadow-[0_0_15px_rgba(197,168,128,0.5)]'}`}
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>

        {/* Current Spend Marker (floats alongside gauge) */}
        <motion.div 
          className="absolute left-1/2 ml-4 -translate-y-1/2"
          initial={{ bottom: 0, opacity: 0 }}
          animate={{ bottom: `max(0px, calc(${percentage}% - 12px))`, opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-px ${isOverBudget ? 'bg-red-400' : 'bg-brand-gold'}`} />
            <span className={`font-sans font-medium text-lg drop-shadow-md ${isOverBudget ? 'text-red-400' : 'text-brand-gold'}`}>
              ${totalSpend.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Cap Marker (Fixed at top) */}
        <div className="absolute top-0 right-1/2 mr-4 flex items-center space-x-3">
          <span className="font-sans text-xs tracking-widest text-brand-bone-dark uppercase">Cap: ${budgetCap.toLocaleString()}</span>
          <div className="w-2 h-px bg-brand-bone-dark/50" />
        </div>
      </div>
      
      {/* Subtle Feedback Context */}
      <div className="mt-8 text-center max-w-[200px]">
        {isOverBudget ? (
          <p className="font-sans text-xs uppercase tracking-widest text-red-400 opacity-80 animate-pulse">
            Guardrail Exceeded
          </p>
        ) : (
          <motion.p 
            key={Math.round(percentage)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sans text-xs uppercase tracking-widest text-brand-bone-dark"
          >
            {100 - Math.round(percentage)}% Allocation Remaining
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default BudgetPulse;
