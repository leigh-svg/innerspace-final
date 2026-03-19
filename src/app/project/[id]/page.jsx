'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

import SpatialHero from '@/components/SpatialHero';
import InvestmentGallery from '@/components/InvestmentGallery';
import BudgetPulse from '@/components/BudgetPulse';
import ProConsultancyCard from '@/components/ProConsultancyCard';

// Temporary Mock Data for Frontend Assembly
const MOCK_ZONES = [
  { id: 'zone_a', x: '25%', y: '45%', label: 'Zone A: Anchor Lounge' },
  { id: 'zone_b', x: '60%', y: '30%', label: 'Zone B: Statement Lighting' },
  { id: 'zone_c', x: '45%', y: '75%', label: 'Zone C: Primary Sleep' },
];

const FULL_CATALOG = [
  {
    id: 'item_1',
    name: 'Camaleonda Sofa',
    brand: 'B&B Italia',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80',
    fitVerified: true,
    zoneId: 'zone_a',
    zoneLabel: 'Zone A',
    tradeDiscount: 15,
    archetypes: ['Warm Minimalist / Japandi', 'Industrial Glam']
  },
  {
    id: 'item_2',
    name: 'Akari Light Sculpture',
    brand: 'Noguchi',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80',
    fitVerified: true,
    zoneId: 'zone_b',
    zoneLabel: 'Zone B',
    archetypes: ['Warm Minimalist / Japandi']
  },
  {
    id: 'item_3',
    name: 'Travertine Plinth',
    brand: 'Menu',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1581428982868-e410dd127a90?auto=format&fit=crop&q=80',
    fitVerified: true,
    zoneId: 'zone_a',
    zoneLabel: 'Zone A',
    archetypes: ['Brutalist Organic', 'Eclectic Modern', 'Warm Minimalist / Japandi']
  },
  {
    id: 'item_4',
    name: 'Linen Platform Bed',
    brand: 'Restoration Hardware',
    price: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80',
    fitVerified: true,
    zoneId: 'zone_c',
    zoneLabel: 'Zone C',
    tradeDiscount: 20,
    archetypes: ['Warm Minimalist / Japandi']
  },
  {
    id: 'item_5',
    name: 'Oxidized Steel Table',
    brand: 'Custom Fab',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd9b?auto=format&fit=crop&q=80',
    fitVerified: true,
    zoneId: 'zone_a',
    zoneLabel: 'Zone A',
    archetypes: ['Brutalist Organic', 'Industrial Glam']
  }
];

export default function LuxuryDashboardPage({ params }) {
  const searchParams = useSearchParams();
  const dnaArchetype = searchParams.get('dna') || 'Warm Minimalist / Japandi'; // Fallback
  
  const [activeZoneId, setActiveZoneId] = useState(null);
  
  // 1. UI Hydration based on DNA URL param
  const dynamicItems = useMemo(() => {
    return FULL_CATALOG.filter(item => 
      item.archetypes.includes(dnaArchetype)
    );
  }, [dnaArchetype]);

  const [selectedItemIds, setSelectedItemIds] = useState([dynamicItems[0]?.id, dynamicItems[1]?.id].filter(Boolean));
  
  const budgetCap = 15000;

  // 2. 'Live Budget' Logic
  const totalSpend = useMemo(() => {
    return FULL_CATALOG
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
  }, [selectedItemIds]);

  const handleItemToggle = (itemId) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleExecuteDesign = async () => {
    const selectedItemsData = FULL_CATALOG.filter(i => selectedItemIds.includes(i.id));
    console.log('Validating and executing checkout for:', selectedItemsData);
    alert('Design Approved. Logging payload to Unified_Basket table and locking in trade discounts.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-brand-charcoal text-brand-bone relative overflow-x-hidden"
    >
      
      {/* Top Navbar */}
      <nav className="w-full h-20 border-b border-brand-bone/10 flex items-center px-4 md:px-12 justify-between backdrop-blur-md sticky top-0 z-50 bg-brand-charcoal/80">
        <div className="font-serif text-2xl tracking-widest uppercase truncate break-all">Innerspace</div>
        <div className="flex items-center space-x-6">
          <span className="hidden md:inline font-sans text-xs uppercase tracking-widest text-brand-bone-dark">Project Status: Procurement Ready</span>
          <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 space-y-16">
        
        {/* The Spatial Canvas Section */}
        <section>
          <SpatialHero 
            projectName={`Project: ${params.id}`}
            roomDimensions={{ floorSpace: 85, ceilingHeight: 3200 }}
            zones={MOCK_ZONES}
            activeZoneId={activeZoneId}
          />
        </section>

        {/* The Procurement Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 px-4 lg:px-12 gap-2">
              <h2 className="text-3xl md:text-4xl font-serif">The Investment Gallery</h2>
              {/* HYDRATED DNA LABEL */}
              <span className="font-sans text-brand-gold uppercase tracking-widest text-xs border border-brand-gold/30 px-3 py-1 rounded shadow-glass bg-brand-charcoal-light/50">
                Curated for: {dnaArchetype}
              </span>
            </div>
            
            <InvestmentGallery 
              items={dynamicItems} 
              selectedItemIds={selectedItemIds}
              onItemToggle={handleItemToggle}
              onItemHover={setActiveZoneId}
            />
          </div>

          <div className="lg:col-span-1 space-y-8 relative">
            <div className="sticky top-32 space-y-8">
              
              <div className="glass-card h-96">
                <BudgetPulse totalSpend={totalSpend} budgetCap={budgetCap} />
              </div>

              <ProConsultancyCard 
                designerName="Elena G."
                avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                availability="online"
              />

            </div>
          </div>
        </section>

      </main>

      {/* Global Checkout Footer */}
      <div className="fixed bottom-0 inset-x-0 h-24 bg-brand-charcoal-light/95 backdrop-blur-xl border-t border-brand-bone/10 flex items-center justify-between px-4 md:px-12 z-50">
        <div>
          <p className="font-sans text-brand-bone-dark uppercase tracking-widest text-[10px] md:text-xs mb-1 hidden sm:block">Total Procurement Value</p>
          <p className="font-serif text-xl md:text-2xl text-brand-gold">${totalSpend.toLocaleString()}</p>
        </div>
        
        <button 
          onClick={handleExecuteDesign}
          className="btn-primary flex items-center space-x-2 md:space-x-4 group text-sm md:text-base px-6 md:px-8 py-3 md:py-4"
        >
          <span className="truncate break-all">Approve & Procure</span>
          <span className="font-sans text-brand-charcoal opacity-60 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>
      
      <div className="h-32" />
    </motion.div>
  );
}
