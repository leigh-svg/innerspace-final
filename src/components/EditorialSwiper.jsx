'use client';

import React, { useState } from 'react';
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

const calculateDesignDNA = (swipeHistory) => {
  const tagScores = {};
  swipeHistory.forEach(({ tags, action }) => {
    const weight = action === 'love' ? 1 : -1;
    tags.forEach(tag => {
      tagScores[tag] = (tagScores[tag] || 0) + weight;
    });
  });

  const sortedTraits = Object.entries(tagScores)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 3);
  
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
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  const opacityRight = useTransform(x, [50, 150], [0, 1]);
  const opacityLeft = useTransform(x, [-50, -150], [0, 1]);
  const animControls = useAnimation();

  const handleDragEnd = async (event, info) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      await animControls.start({ x: 600, opacity: 0, transition: { duration: 0.3 } });
      handleSwipe(item, 'love');
    } else if (info.offset.x < -threshold) {
      await animControls.start({ x: -600, opacity: 0, transition: { duration: 0.3 } });
      handleSwipe(item, 'pass');
    } else {
      animControls.start({ x: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } });
    }
  };

  if (index < activeIndex) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-4 w-full h-full pointer-events-none"
      style={{
        zIndex: MOCK_SWIPER_IMAGES.length - index,
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        scale: isFront ? 1 : 1 - (index - activeIndex) * 0.04,
        y: isFront ? 0 : (index - activeIndex) * -10,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={animControls}
    >
      <div className="pointer-events-auto relative w-full max-w-[340px] aspect-[3/4.5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-[#1A1A1A]">
        <img 
          src={item.src} 
          alt="Style reference" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />

        {isFront && (
          <>
            <motion.div 
              style={{ opacity: opacityRight }}
              className="absolute top-8 left-8 border-2 border-emerald-400 text-emerald-400 font-sans tracking-widest font-bold text-xl px-4 py-1 rounded-full rotate-[-10deg] bg-emerald-500/10 backdrop-blur-md"
            >
              INSPIRED
            </motion.div>
            <motion.div 
              style={{ opacity: opacityLeft }}
              className="absolute top-8 right-8 border-2 border-white/50 text-white/80 font-sans tracking-widest font-bold text-xl px-4 py-1 rounded-full rotate-[10deg] bg-white/10 backdrop-blur-md"
            >
              PASS
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// --- Main DNA Engine ---

export default function EditorialSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [finalDNA, setFinalDNA] = useState(null);

  const handleSwipe = (item, action) => {
    const newHistory = [...swipeHistory, { tags: item.tags, action }];
    setSwipeHistory(newHistory);
    if (activeIndex + 1 >= MOCK_SWIPER_IMAGES.length) {
      triggerDNAReveal(newHistory);
    } else {
      setActiveIndex(prev => prev + 1);
    }
  };

  const triggerDNAReveal = (history) => {
    setIsRevealing(true);
    setTimeout(() => {
      const computedDNA = calculateDesignDNA(history);
      setFinalDNA(computedDNA);
    }, 2500); 
  };

  if (finalDNA) return <DNAReveal summary={finalDNA} />;
  if (isRevealing) return <LoadingDNA />;

  return (
    <div className="w-full max-w-md mx-auto h-[550px] relative flex flex-col items-center">
      <div className="text-center mb-8 z-50">
        <h2 className="font-serif text-2xl text-[#F5F5F0] mb-1 italic tracking-wide">Style Calibration</h2>
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#F5F5F0]/40">
          Selection {activeIndex + 1} of {MOCK_SWIPER_IMAGES.length}
        </p>
      </div>

      <div className="relative w-full flex-1">
        <AnimatePresence>
          {MOCK_SWIPER_IMAGES.map((item, index) => (
            <SwipeCard 
              key={item.id} 
              item={item} 
              index={index} 
              activeIndex={activeIndex} 
              handleSwipe={handleSwipe} 
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center font-sans tracking-[0.4em] text-[9px] uppercase text-[#F5F5F0]/20">
        Swipe Right to Love • Left to Pass
      </div>
    </div>
  );
}

// --- Auxiliary Components ---

const LoadingDNA = () => (
  <div className="w-full max-w-md mx-auto h-[500px] flex flex-col items-center justify-center bg-[#1A1A1A]/50 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
    <div className="w-12 h-12 border-2 border-[#F5F5F0]/10 border-t-[#F5F5F0] rounded-full animate-spin mb-6" />
    <h3 className="font-serif text-xl text-[#F5F5F0]">Synthesizing Archetype</h3>
    <p className="font-sans mt-3 text-[#F5F5F0]/30 tracking-[0.2em] text-[10px] uppercase animate-pulse">
      Extracting Computer Vision Vectors...
    </p>
  </div>
);

const DNAReveal = ({ summary }) => {
  const router = useRouter();

  const handleProceed = () => {
    const encodedArchetype = encodeURIComponent(summary.archetype);
    router.push(`/project/new_scan_id_x829?dna=${encodedArchetype}`);
  };

  const handleWhatsAppTrigger = () => {
    const link = generateWhatsAppConciergeLink(summary.archetype);
    window.open(link, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6">
          <Check className="text-emerald-400 w-6 h-6" />
        </div>
        <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-emerald-400/80 mb-4">Calibration Complete</span>
        <h2 className="font-serif text-4xl md:text-5xl text-[#F5F5F0] mb-6">{summary.archetype}</h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {summary.traits.map(trait => (
            <span key={trait} className="px-3 py-1 border border-white/10 rounded-full font-sans text-[9px] tracking-widest text-[#F5F5F0]/60 uppercase bg-white/5">
              #{trait.replace('_', ' ')}
            </span>
          ))}
        </div>

        <button 
          onClick={handleWhatsAppTrigger}
          className="w-full py-4 bg-[#F5F5F0] text-black font-sans text-xs uppercase tracking-widest flex items-center justify-center space-x-3 rounded-full hover:bg-white transition-all shadow-xl"
        >
          <Smartphone className="w-4 h-4" />
          <span>Begin Room Scan via WhatsApp</span>
        </button>

        <button onClick={handleProceed} className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#F5F5F0]/30 hover:text-[#F5F5F0] transition-colors">
          Skip to Dashboard Demo
        </button>
      </div>
    </motion.div>
  );
};
