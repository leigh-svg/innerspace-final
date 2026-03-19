'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CapturePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isLevel, setIsLevel] = useState(false); // Simulated gyroscope
  
  const tickerMessages = [
    "Scan corners slowly",
    "Detection: Window Frame found",
    "Analyzing topology...",
    "Detection: Ceiling Height identified",
    "Mapping floor parameters...",
    "Finalizing spatial matrix"
  ];

  // Simulating the gyroscope leveling
  useEffect(() => {
    const levelInterval = setInterval(() => {
      // Toggle level status every 2.5s for the demo effect
      setIsLevel(prev => !prev);
    }, 2500);
    return () => clearInterval(levelInterval);
  }, []);

  // Simulating recording progress and ticker updates
  useEffect(() => {
    if (!isRecording) return;

    const recordingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(recordingInterval);
          // Auto complete logic could go here
          return 100;
        }
        return prev + (100 / 150); // Simulates a 15-second scan (150 * 100ms)
      });
    }, 100);

    const tickerInterval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerMessages.length);
    }, 2500);

    return () => {
      clearInterval(recordingInterval);
      clearInterval(tickerInterval);
    };
  }, [isRecording, tickerMessages.length]);

  const handleToggleRecord = () => {
    if (progress >= 100) return; // Prevent restart in this demo
    setIsRecording(!isRecording);
  };

  if (progress >= 100) {
    return <UploadSuccessView />;
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden">
      
      {/* Background Live Camera Feed Overlay (Placeholder Image/Video) */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1594904578869-c011783103c7?auto=format&fit=crop&q=80" 
            alt="Camera Feed Placeholder" 
            className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isRecording ? 'scale-110' : 'scale-100'}`}
         />
         <div className="absolute inset-0 bg-black/40" /> {/* Ambient darkening */}
      </div>

      {/* Scanning Grid Mesh Animation */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              perspective: '1000px'
            }}
          >
            {/* Animated scanning plane sweeping vertically */}
            <motion.div 
               animate={{ y: ['-10%', '110%'] }}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="w-full h-32 bg-gradient-to-b from-transparent via-brand-gold/10 to-brand-gold/50 border-b border-brand-gold blur-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full h-full flex flex-col justify-between p-6">
        
        {/* Top Header & Guided Ticker */}
        <header className="flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
             <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-white/50'}`} />
                <span className="text-xs uppercase tracking-widest opacity-80 backdrop-blur-md px-2 py-1 rounded-md bg-black/20">
                  {isRecording ? 'Scanning' : 'Ready'}
                </span>
             </div>
             <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {/* Ticker */}
          <motion.div 
            key={tickerIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 bg-black/40 backdrop-blur-lg rounded-full border border-white/10"
          >
            <p className="text-xs tracking-widest uppercase font-medium text-brand-gold">
               {isRecording ? tickerMessages[tickerIndex] : 'Position device in Landscape'}
            </p>
          </motion.div>
        </header>

        {/* Leveling Indicator (Center Screen) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 pointer-events-none flex flex-col items-center">
            {/* The horizontal crosshair lines */}
            <div className={`w-full h-[1px] transition-colors duration-500 ${isLevel ? 'bg-brand-gold shadow-[0_0_10px_rgba(197,168,128,0.8)]' : 'bg-white/30'}`} />
            
            {/* Center target dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border transition-colors duration-500 ${isLevel ? 'border-brand-gold bg-brand-gold/20' : 'border-white/50'}`} />
            </div>

            {/* Small instructional text */}
            <span className={`mt-4 text-[10px] tracking-widest uppercase transition-opacity duration-500 ${isLevel ? 'opacity-0' : 'opacity-100 text-white/50'}`}>
               Hold device level
            </span>
        </div>

        {/* Bottom Controls Area */}
        <footer className="w-full flex flex-col items-center space-y-8 pb-8">
           
           {/* The CTA Container */}
           <div className="relative flex items-center justify-center">
              
              {/* SVG Circle for Progress Stroke */}
              <svg className="absolute w-[88px] h-[88px] -rotate-90 pointer-events-none">
                 <circle 
                    cx="44" cy="44" r="42" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="4" 
                 />
                 <circle 
                    cx="44" cy="44" r="42" 
                    fill="none" 
                    stroke="#C5A880" 
                    strokeWidth="4" 
                    strokeDasharray={264} // 2 * pi * r (approx 263.89)
                    strokeDashoffset={264 - (progress / 100) * 264}
                    className="transition-all duration-100 ease-linear"
                    strokeLinecap="round"
                 />
              </svg>

              {/* Physical Record Button */}
              <button 
                onClick={handleToggleRecord}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  isRecording ? 'bg-red-500 scale-75' : 'bg-white scale-100'
                }`}
              >
                  {isRecording && <div className="w-6 h-6 bg-white rounded-sm" />}
              </button>

           </div>
           
        </footer>

      </div>
    </div>
  );
}

const UploadSuccessView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-brand-charcoal text-brand-bone flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mb-8 border border-brand-gold/20 shadow-[0_0_30px_rgba(197,168,128,0.2)]">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    
    <h2 className="font-serif text-3xl mb-4">Tour Uploaded</h2>
    <p className="font-sans text-brand-bone-dark font-light text-sm max-w-[280px] mx-auto block leading-relaxed mb-12">
      Our architectural models are extracting the millimetric depth data. You can safely close this window.
    </p>

    <div className="p-4 bg-brand-charcoal-light/50 border border-emerald-500/20 rounded-xl max-w-xs w-full">
       <p className="font-sans text-xs tracking-widest text-emerald-400 font-medium uppercase mb-2">Next Step</p>
       <p className="font-sans text-xs text-brand-bone-dark leading-relaxed">
         You will receive a WhatsApp notification the moment your Luxury Dashboard is ready for review.
       </p>
    </div>
  </motion.div>
);
