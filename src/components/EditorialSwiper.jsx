'use client';

import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Smartphone, Check } from 'lucide-react';

// --- STYLES (The Brute Force Fix) ---
const CardStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .swiper-card-container {
      width: 320px !important;
      height: 480px !important;
      position: relative !important;
      overflow: hidden !important;
      border-radius: 24px !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5) !important;
    }
    .swiper-image-fix {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
  `}} />
);

const MOCK_SWIPER_IMAGES = [
  { id: '1', src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80', tags: ['minimalist'] },
  { id: '2', src: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80', tags: ['japandi'] },
  { id: '3', src: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80', tags: ['maximalist'] },
  { id: '4', src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd9b?auto=format&fit=crop&q=80', tags: ['classic'] },
  { id: '5', src: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80', tags: ['boucle'] }
];

const SwipeCard = ({ item, index, activeIndex, handleSwipe }) => {
  const isFront = index === activeIndex;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const animControls = useAnimation();

  const handleDragEnd = async (e, info) => {
    if (info.offset.x > 100) {
      await animControls.start({ x: 500, opacity: 0 });
      handleSwipe(item, 'love');
    } else if (info.offset.x < -100) {
      await animControls.start({ x: -500, opacity: 0 });
      handleSwipe(item, 'pass');
    } else {
      animControls.start({ x: 0 });
    }
  };

  if (index < activeIndex) return null;

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ x: isFront ? x : 0, rotate: isFront ? rotate : 0, zIndex: 50 - index }}
      drag={isFront ? "x" : false}
      onDragEnd={handleDragEnd}
      animate={animControls}
    >
      <div className="swiper-card-container">
        <img src={item.src} className="swiper-image-fix" alt="design" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function EditorialSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSwipe = (item, action) => {
    if (activeIndex + 1 >= MOCK_SWIPER_IMAGES.length) {
      setDone(true);
    } else {
      setActiveIndex(prev => prev + 1);
    }
  };

  if (done) return (
    <div className="text-center p-10 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10">
      <h2 className="text-3xl font-serif text-white mb-6">Archetype Synthesized</h2>
      <button 
        onClick={() => router.push('/project/demo?dna=Japandi')}
        className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs"
      >
        View My Dashboard
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <CardStyles />
      <AnimatePresence>
        {MOCK_SWIPER_IMAGES.map((item, index) => (
          <SwipeCard key={item.id} item={item} index={index} activeIndex={activeIndex} handleSwipe={handleSwipe} />
        ))}
      </AnimatePresence>
    </div>
  );
}
