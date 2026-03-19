'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { generateWhatsAppConciergeLink } from '@/lib/utils/whatsapp';
import { Check, Link as LinkIcon, Smartphone, Hexagon } from 'lucide-react';

// --- Computer Vision Tagging Logic & Mock Data ---

const MOCK_SWIPER_IMAGES = [
  {
    id: 'img1',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
    tags: ['brutalist', 'monolithic', 'concrete', 'matte_black', 'minimalist']
  },
  {
    id: 'img2',
    src: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80',
    tags: ['warm_oak', 'japandi', 'minimalist', 'linen', 'airy']
  },
  {
    id: 'img3',
    src: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80',
    tags: ['velvet', 'jewel_tones', 'maximalist', 'brass', 'moody']
  },
  {
    id: 'img4',
    src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd9b?auto=format&fit=crop&q=80',
    tags: ['parisian', 'ornate', 'marble', 'high_contrast', 'classic']
  },
  {
    id: 'img5',
    src: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80',
    tags: ['boucle', 'curvilinear', 'japandi', 'warm_minimalist', 'travertine']
  }
];

// Reusable Tag Scoring Algorithm
const calculateDesignDNA = (swipeHistory) => {
  const tagScores = {};

  swipeHistory.forEach(({ tags, action }) => {
    // Weighting: Love = +1, Pass = -1
    const weight = action === 'love' ? 1 : -1;
    
    tags.forEach(tag => {
      tagScores[tag] = (tagScores[tag] || 0) + weight;
    });
  });

  // Sort and extract top 3 dominant traits (must have positive score)
  const sortedTraits = Object.entries(tagScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 3);
  
  // Map top traits to a primary Archetype Note
  let primaryArchetype = 'Eclectic Modern';
  if (sortedTraits.includes('japandi') || sortedTraits.includes('warm_minimalist')) {
    primaryArchetype = 'Warm Minimalist / Japandi';
  } else if (sortedTraits.includes('brutalist') || sortedTraits.includes('concrete')) {
    primaryArchetype = 'Brutalist Organic';
  } else if (sortedTraits.includes('velvet') || sortedTraits.includes('maximalist')) {
    primaryArchetype = 'Industrial Glam';
  }

  return { traits: sortedTraits, archetype: primaryArchetype };
};


// --- Framer Motion Swiper Card Component ---

const SwipeCard = ({ item, index, activeIndex, handleSwipe }) => {
  const isFront = index === activeIndex;
  
  const x = useMotionValue(0);
  // Transform x position into rotation (subtle 10deg max)
  const rotate = useTransform(x, [-300, 300], [-10, 10]);
  // Transform x into opacity for the overlay UI (Heart/Cross)
  const opacityRight = useTransform(x, [0, 150], [0, 1]);
  const opacityLeft = useTransform(x, [0, -150], [0, 1]);

  const animControls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      await animControls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      handleSwipe(item, 'love');
    } else if (info.offset.x < -threshold) {
      await animControls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      handleSwipe(item, 'pass');
    } else {
      animControls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  if (index < activeIndex) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-4 md:p-12 w-full max-w-2xl mx-auto"
      style={{
        zIndex: MOCK_SWIPER_IMAGES.length - index,
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        scale: isFront ? 1 : 1 - (index - activeIndex) * 0.05,
        y: isFront ? 0 : (index - activeIndex) * 20,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={animControls}
    >
      <div className="relative w-full h-[70vh] rounded-[2rem] overflow-hidden shadow-glass border border-brand-bone/10 cursor-grab active:cursor-grabbing bg-brand-charcoal-light">
        
        {/* The CV Tagged Image */}
        <img 
          src={item.src} 
          alt="Style reference" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-charcoal/30 pointer-events-none" />

        {/* Swipe Feedback Overlays */}
        {isFront && (
          <>
            {/* Love Indicator */}
            <motion.div 
              style={{ opacity: opacityRight }}
              className="absolute top-12 left-12 border-2 border-emerald-400 text-emerald-400 font-sans tracking-[0.3em] font-medium text-4xl px-8 py-3 rounded-xl rotate-[-15deg] pointer-events-none bg-brand-charcoal/40 backdrop-blur-sm"
            >
              INSPIRED
            </motion.div>
            
            {/* Pass Indicator */}
            <motion.div 
              style={{ opacity: opacityLeft }}
              className="absolute top-12 right-12 border-2 border-brand-bone-dark/50 text-brand-bone-dark/80 font-sans tracking-[0.3em] font-medium text-4xl px-8 py-3 rounded-xl rotate-[15deg] pointer-events-none bg-brand-charcoal/40 backdrop-blur-sm"
            >
              PASS
            </motion.div>
          </>
        )}

      </div>
    </motion.div>
  );
};


// --- The Main DNA Engine Component ---

export default function EditorialSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [finalDNA, setFinalDNA] = useState(null);

  const handleSwipe = (item, action) => {
    // Record the tags associated with the action
    const newHistory = [...swipeHistory, { tags: item.tags, action }];
    setSwipeHistory(newHistory);

    if (activeIndex + 1 >= MOCK_SWIPER_IMAGES.length) {
      // Swiper exhausted, trigger Reveal Phase
      triggerDNAReveal(newHistory);
    } else {
      setActiveIndex(prev => prev + 1);
    }
  };

  const triggerDNAReveal = (history) => {
    setIsRevealing(true);
    
    // Simulate AI Processing time for UX pacing
    setTimeout(() => {
      const computedDNA = calculateDesignDNA(history);
      setFinalDNA(computedDNA);
      saveDNAtoSupabase(computedDNA); // Mock DB Call
    }, 2500); 
  };

  const saveDNAtoSupabase = async (dna) => {
    console.log('--- SUPABASE SYNC ---');
    console.log('UPDATE profiles SET style_dna = $1 WHERE user_id = auth.uid()');
    console.log('Payload:', JSON.stringify(dna));
    // Implementation would use: await supabase.from('profiles').update({ style_dna: dna }).eq('user_id', user.id);
  };

  if (finalDNA) {
    return <DNAReveal summary={finalDNA} />;
  }

  if (isRevealing) {
    return <LoadingDNA />;
  }

  return (
    <div className="w-full h-[80vh] min-h-[600px] relative bg-brand-charcoal overflow-hidden rounded-3xl pt-12">
      {/* Header Context */}
      <div className="absolute top-8 w-full text-center z-50">
        <h2 className="font-serif text-3xl text-brand-bone mb-1">Style Calibration</h2>
        <p className="font-sans text-xs tracking-widest uppercase text-brand-bone-dark">
          {activeIndex + 1} / {MOCK_SWIPER_IMAGES.length}
        </p>
      </div>

      {/* The Stack */}
      <div className="relative w-full h-full flex justify-center mt-12">
        {MOCK_SWIPER_IMAGES.map((item, index) => (
          <SwipeCard 
            key={item.id} 
            item={item} 
            index={index} 
            activeIndex={activeIndex} 
            handleSwipe={handleSwipe} 
          />
        ))}
      </div>

      {/* Helper Footer */}
      <div className="absolute bottom-12 w-full text-center font-sans tracking-widest text-xs uppercase text-brand-bone/50 z-50">
        Swipe Right to Love • Left to Pass
      </div>
    </div>
  );
}


// --- Auxiliary Components (Loading & Summary) ---

const LoadingDNA = () => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-brand-charcoal text-brand-bone rounded-3xl border border-brand-bone/10 backdrop-blur-xl">
    {/* Aura Loader — replaces old spinner */}
    <div className="aura-loader mb-10">
      <div className="aura-loader-dot" />
    </div>
    <h3 className="font-serif text-2xl tracking-wide">Synthesizing Archetype</h3>
    <p className="font-sans mt-4 text-brand-bone-dark/50 tracking-[0.2em] text-xs uppercase animate-pulse">
      Extracting Computer Vision Vectors...
    </p>
  </div>
);

const DNAReveal = ({ summary }) => {
  const router = useRouter();

  const handleProceed = () => {
    // Navigate to the dynamic project dashboard, passing the archetype as a URL param for hydration demonstration
    const encodedArchetype = encodeURIComponent(summary.archetype);
    router.push(`/project/new_scan_id_x829?dna=${encodedArchetype}`);
  };

  const handleWhatsAppTrigger = () => {
    const link = generateWhatsAppConciergeLink(summary.archetype);
    window.open(link, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center bg-transparent text-brand-bone p-4 md:p-12 relative overflow-hidden"
    >
      {/* Heavy Blur Background Layer */}
      <div className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-3xl -z-10" />

      {/* Centered Handoff Card */}
      <div className="relative w-full max-w-2xl bg-brand-charcoal-light/50 backdrop-blur-2xl border border-brand-gold/10 rounded-[2.5rem] p-8 md:p-16 text-center shadow-premium overflow-hidden">
        
        {/* Soft Ambient Glow Behind Card Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
            
            {/* Success Checkmark Animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6"
            >
              <Check className="text-emerald-400 w-8 h-8" />
            </motion.div>

            <span className="font-sans text-xs uppercase tracking-[0.4em] text-brand-gold mb-4 block">
              Calibration Complete
            </span>
            
            <h2 className="font-serif text-5xl md:text-6xl mb-6 leading-tight drop-shadow-md">
              {summary.archetype}
            </h2>

            <div className="flex flex-wrap justify-center space-x-3 mb-12">
              {summary.traits.map(trait => (
                <span key={trait} className="px-4 py-1.5 border border-brand-bone/10 rounded-full font-sans text-xs tracking-widest text-brand-bone-dark uppercase bg-brand-charcoal/30">
                  #{trait.replace('_', ' ')}
                </span>
              ))}
            </div>

            {/* High-End CTA */}
            <button 
              onClick={handleWhatsAppTrigger}
              className="w-full md:max-w-md py-5 bg-brand-bone hover:bg-white text-brand-charcoal font-sans flex items-center justify-center space-x-3 rounded-full transition-all group shadow-[0_0_20px_rgba(245,245,240,0.1)] hover:shadow-[0_0_30px_rgba(245,245,240,0.2)]"
            >
                <Smartphone className="w-5 h-5 text-brand-charcoal" />
                <span className="font-medium tracking-wide">Begin Room Scan via WhatsApp</span>
                <span className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1">→</span>
            </button>

            {/* Minimalist 3-Step Icon Row */}
            <div className="w-full grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-brand-bone/10">
                <div className="flex flex-col items-center text-center space-y-3">
                   <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center border border-brand-bone/5">
                      <LinkIcon className="w-4 h-4 text-brand-bone-dark" />
                   </div>
                   <p className="font-sans text-[10px] uppercase tracking-widest text-brand-bone-dark">1. Receive Link</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                   <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center border border-brand-bone/5">
                      <Smartphone className="w-4 h-4 text-brand-bone-dark" />
                   </div>
                   <p className="font-sans text-[10px] uppercase tracking-widest text-brand-bone-dark">2. Walk Through</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                   <div className="w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center border border-brand-bone/5">
                      <Hexagon className="w-4 h-4 text-brand-bone-dark" />
                   </div>
                   <p className="font-sans text-[10px] uppercase tracking-widest text-brand-bone-dark">3. View Design</p>
                </div>
            </div>

            {/* Demo Skip Link */}
            <button 
                onClick={handleProceed}
                className="mt-8 text-[10px] uppercase tracking-widest text-brand-bone-dark/50 hover:text-brand-bone transition-colors"
            >
                Skip straight to Dashboard Demo
            </button>

        </div>
      </div>
    </motion.div>
  );
};
