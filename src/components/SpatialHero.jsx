import React from 'react';

const SpatialHero = ({ projectName, roomDimensions, zones, activeZoneId }) => {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] bg-brand-charcoal-dark overflow-hidden rounded-3xl border border-brand-bone/5 shadow-premium">
      {/* Background Grid - The 'Blueprint' aesthetic */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(245, 245, 240, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 240, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Editorial Header */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-5xl font-serif text-brand-bone mb-2">{projectName}</h1>
        <p className="font-sans text-brand-bone-dark tracking-widest text-sm uppercase">
          {roomDimensions.floorSpace}M² • {roomDimensions.ceilingHeight}MM CEILING
        </p>
      </div>

      {/* Abstracted 3D Wireframe Representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mock Wireframe Base */}
        <div className="relative w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] border border-brand-bone/20 skew-x-12 -skew-y-12 rotate-12 transition-transform duration-1000">
          
          {/* Glowing Furniture Nodes */}
          {zones.map((zone) => {
            const isActive = activeZoneId === zone.id;
            return (
              <div 
                key={zone.id}
                className={`absolute w-4 h-4 rounded-full transition-all duration-500 cursor-pointer group 
                  ${isActive 
                    ? 'bg-brand-bone shadow-[0_0_30px_rgba(245,245,240,1)] scale-150 z-20 animate-pulse' 
                    : 'bg-brand-gold shadow-[0_0_20px_rgba(197,168,128,0.8)] animate-pulse'
                  }`}
                style={{ top: zone.y, left: zone.x }}
              >
                {/* Tooltip on hover or if active */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 transition-opacity duration-300 bg-brand-charcoal/80 backdrop-blur-md border border-brand-bone/10 px-4 py-2 rounded-lg whitespace-nowrap z-30 shadow-glass ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <p className={`font-sans text-xs tracking-widest uppercase ${isActive ? 'text-brand-gold font-medium' : 'text-brand-bone'}`}>{zone.label}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Subtle overlay gradient to blend edges */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-charcoal-dark to-transparent pointer-events-none" />
    </div>
  );
};

export default SpatialHero;
