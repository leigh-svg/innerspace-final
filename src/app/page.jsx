'use client';
import React from 'react';
import EditorialSwiper from '@/components/EditorialSwiper';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center overflow-hidden relative">
      
      {/* BACKGROUND: Now "pushed back" and darkened to let cards pop */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
            alt="Atmosphere" 
            className="w-full h-full object-cover opacity-20 blur-[100px] scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-16 flex flex-col min-h-screen items-center">
        
        {/* HEADER: Pushed higher and more elegant */}
        <header className="w-full flex justify-between items-center mb-24 shrink-0">
          <div className="font-serif text-2xl tracking-[0.5em] uppercase text-[#F5F5F0]">Innerspace</div>
          <div className="h-[1px] w-24 bg-[#F5F5F0]/20 hidden md:block" />
          <button className="text-[#F5F5F0]/30 font-sans text-[10px] tracking-[0.3em] uppercase hover:text-[#F5F5F0] transition-colors">
            Portfolio v1
          </button>
        </header>

        {/* THE ENGINE: Centered with plenty of space */}
        <div className="flex-1 w-full flex items-start justify-center pt-10">
            <EditorialSwiper />
        </div>

        <footer className="mt-auto py-10 text-[#F5F5F0]/10 font-sans text-[9px] tracking-[0.5em] uppercase text-center">
          Curating Spatial DNA • 2026
        </footer>
      </div>
    </main>
  );
}
