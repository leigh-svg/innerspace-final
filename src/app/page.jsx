'use client';

import React from 'react';
import EditorialSwiper from '@/components/EditorialSwiper';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity blur-2xl"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F0F0F]/50 to-[#0F0F0F]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 md:px-8 py-12 flex flex-col h-screen">
        
        {/* Minimalist Header */}
        <header className="flex justify-between items-center mb-12 shrink-0">
          <div className="font-serif text-2xl tracking-[0.3em] uppercase text-[#F5F5F0] drop-shadow-sm">
            Innerspace
          </div>
          <button className="text-[#F5F5F0]/40 font-sans text-[10px] tracking-[0.2em] uppercase hover:text-[#F5F5F0] transition-all duration-500 border-b border-transparent hover:border-[#F5F5F0]/20 pb-1">
            Member Access
          </button>
        </header>

{/* The DNA Engine Core */}
<div className="flex-1 flex flex-col justify-center items-center w-full max-w-lg mx-auto overflow-hidden">
    <div className="w-full h-[500px] md:h-[600px] relative"> 
        <EditorialSwiper />
    </div>
</div>        {/* The DNA Engine Core */}
        <div className="flex-1 flex flex-col justify-center w-full">
            <EditorialSwiper />
        </div>

        {/* Subtle Branding Footer */}
        <footer className="mt-8 shrink-0 text-center">
           <div className="flex flex-col items-center space-y-4">
             <div className="w-px h-12 bg-gradient-to-b from-[#F5F5F0]/20 to-transparent" />
             <p className="text-[#F5F5F0]/20 font-sans text-[9px] tracking-[0.4em] uppercase">
               Spatial Intelligence — Studio v1.0
             </p>
           </div>
        </footer>
      </div>
    </main>
  );
}
