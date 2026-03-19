import React from 'react';
import { motion } from 'framer-motion';

// Stagger container variants — parent orchestrates child entrance
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

const InvestmentGallery = ({ items, selectedItemIds, onItemToggle, onItemHover }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => {
        const isLeadingElement = index % 3 === 0;
        const colSpan = isLeadingElement ? 'lg:col-span-7' : 'lg:col-span-5';
        const isSelected = selectedItemIds.includes(item.id);
        
        return (
          <motion.div 
            key={item.id} 
            variants={cardVariants}
            className={`${colSpan} glass-card-interactive group relative overflow-hidden flex flex-col justify-end min-h-[450px] ${
              isSelected ? 'ring-1 ring-brand-gold ring-offset-4 ring-offset-brand-charcoal' : ''
            }`}
            onMouseEnter={() => onItemHover(item.zoneId)}
            onMouseLeave={() => onItemHover(null)}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-brand-charcoal-light">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className={`w-full h-full object-cover transition-all duration-[800ms] ease-out ${
                  isSelected ? 'mix-blend-normal opacity-100 scale-105' : 'mix-blend-luminosity opacity-70 group-hover:scale-105 group-hover:opacity-90'
                }`} 
              />
              {/* Vignette */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-charcoal to-transparent opacity-90" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-8 flex flex-col h-full justify-between pointer-events-none">
              
              {/* Badges: Float at top */}
              <div className="flex flex-wrap gap-2 pointer-events-auto">
                {item.fitVerified && (
                  <div className="inline-flex items-center px-3 py-1 bg-brand-charcoal-light/60 border border-emerald-500/20 rounded shadow-glass backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    <span className="text-xs font-sans tracking-widest text-brand-bone-dark uppercase">Fits {item.zoneLabel}</span>
                  </div>
                )}
                {item.tradeDiscount && (
                  <div className="inline-flex px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded font-sans text-xs tracking-widest uppercase backdrop-blur-md">
                    Trade: Save {item.tradeDiscount}%
                  </div>
                )}
              </div>

              {/* Bottom Details */}
              <div className="mt-auto flex justify-between items-end border-t border-brand-bone/10 pt-6 border-opacity-0 group-hover:border-opacity-100 transition-colors duration-500 pointer-events-auto">
                <div>
                  <h3 className="text-3xl font-serif text-brand-bone mb-1 drop-shadow-md">{item.name}</h3>
                  <p className="font-sans text-sm text-brand-bone-dark font-light tracking-wide">{item.brand}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-sans font-medium transition-colors drop-shadow-md ${isSelected ? 'text-brand-gold-light' : 'text-brand-gold group-hover:text-brand-gold-light'}`}>
                    ${item.price.toLocaleString()}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemToggle(item.id);
                    }}
                    className={`text-xs font-sans uppercase tracking-[0.2em] mt-2 transition-all duration-300 ${
                      isSelected 
                        ? 'text-brand-gold opacity-100' 
                        : 'text-brand-bone-dark group-hover:text-brand-bone opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                    }`}
                  >
                    {isSelected ? '✓ In Unified Basket' : 'Add to Unified Basket →'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default InvestmentGallery;
