'use client';
import React from 'react';
import EditorialSwiper from '@/components/EditorialSwiper';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center overflow-hidden relative">
      
      {/* 🖼️ THE BACKGROUND FIX: 'fixed' prevents it from taking up vertical space */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
            alt="Atmosphere" 
            className="w-full h-full object-cover opacity-15 blur-[120px] scale-125"
         />
         {/* This creates a dark "vignette" so the edges are pitch black */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      {/* 🏗️ THE CONTENT: This now starts at the VERY top of the screen */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col min-h-screen items-center">
        
        {/* HEADER: Balanced for Desktop */}
        <header className="w-full flex justify-between items-center pt-12 mb-16 shrink-0">
          <div className="font-serif text-xl tracking-[0.6em] uppercase text-[#F5F5F0]/90">Innerspace</div>
          <div className="hidden md:block h-[1px] w-32 bg-[#F5F5F0]/10" />
          <p className="text-[#F5F5F0]/20 font-sans text-[9px] tracking-[0.4em] uppercase">
            Studio Edition
          </p>
        </header>

        {/* THE ENGINE: This will now be properly centered */}
        <div className="flex-1 w-full flex items-center justify-center">
            <EditorialSwiper />
        </div>

        <footer className="py-12 text-[#F5F5F0]/5 font-sans text-[8px] tracking-[0.6em] uppercase">
          Autonomous Interior Intelligence
        </footer>
      </div>
    </main>
  );
}
