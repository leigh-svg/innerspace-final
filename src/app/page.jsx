'use client';

import React from 'react';
import EditorialSwiper from '@/components/EditorialSwiper';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center overflow-hidden">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
            alt="Background Texture" 
            className="w-full h-full object-cover opacity-10 mix-blend-luminosity blur-md"
         />
         <div className="absolute inset-0 bg-brand-charcoal/80" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 md:px-8 py-12 flex flex-col h-screen">
        
        {/* Minimalist Header */}
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div className="font-serif text-2xl tracking-widest uppercase text-brand-bone">Innerspace</div>
          <button className="text-brand-bone-dark font-sans text-xs tracking-[0.2em] uppercase hover:text-brand-bone transition-colors">
            Log In
          </button>
        </header>

        {/* The DNA Engine Core */}
        <div className="flex-1 flex flex-col justify-center w-full">
            <EditorialSwiper />
        </div>
      </div>
    </main>
  );
}
