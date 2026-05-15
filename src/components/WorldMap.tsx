"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon, Target, Users, Shield } from 'lucide-react';
import Image from 'next/image';

interface WorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ isOpen, onClose }) => {
  const [activeAgents, setActiveAgents] = useState(1249);
  const [networkStability, setNetworkStability] = useState(98.4);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [showIntel, setShowIntel] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1200, prev + change);
      });

      setNetworkStability(prev => {
        const change = (Math.random() * 0.2 - 0.1);
        const newVal = prev + change;
        return Number(Math.min(99.9, Math.max(95.0, newVal)).toFixed(1));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sectors = [
    { id: 'neo-tokyo', name: 'Neo Tokyo Sector', status: 'Controlled', power: 'High', x: '75%', y: '35%' },
    { id: 'under-london', name: 'Under London Grid', status: 'Contested', power: 'Medium', x: '45%', y: '25%' },
    { id: 'brazil-core', name: 'Amazonia Data Hive', status: 'Uncharted', power: 'Low', x: '35%', y: '65%' },
    { id: 'arctic-vault', name: 'Arctic Seed Vault', status: 'Neutral', power: 'Max', x: '55%', y: '15%' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full h-full md:h-auto md:max-w-6xl md:aspect-[16/9] bg-cyber-black md:rounded-2xl border-b md:border border-neon-blue/30 overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/5 glass flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <MapIcon className="w-5 h-5 text-neon-blue" />
                <h2 className="text-sm md:text-xl font-bold tracking-widest text-glow uppercase">Global Territory Grid</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/5 bg-black/20">
                  <Image 
                    src="/world-map.png" 
                    alt="Cyberpunk World Map" 
                    fill
                    className="object-cover opacity-60 md:opacity-40"
                    priority
                  />
                  
                  {/* Overlay Grid */}
                  <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
                  
                  {/* Interactive Nodes */}
                  {sectors.map((sector) => (
                    <motion.div
                      key={sector.id}
                      style={{ left: sector.x, top: sector.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      onMouseEnter={() => setHoveredSector(sector.id)}
                      onMouseLeave={() => setHoveredSector(null)}
                      onClick={() => setHoveredSector(hoveredSector === sector.id ? null : sector.id)}
                    >
                      <div className="relative">
                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${sector.status === 'Controlled' ? 'bg-neon-blue' : sector.status === 'Contested' ? 'bg-neon-purple' : 'bg-gray-500'} animate-pulse shadow-[0_0_15px_rgba(0,243,255,0.5)]`} />
                        <div className={`absolute inset-0 rounded-full border-2 ${sector.status === 'Controlled' ? 'border-neon-blue' : 'border-white/20'} animate-ping opacity-50`} />
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredSector === sector.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, x: -50 }}
                              animate={{ opacity: 1, y: -60, x: -50 }}
                              exit={{ opacity: 0, y: 10, x: -50 }}
                              className="absolute z-30 w-32 md:w-48 glass p-2 md:p-3 rounded border border-neon-blue/40 pointer-events-none"
                            >
                              <p className="text-[10px] md:text-xs font-bold text-neon-blue mb-1 uppercase tracking-tighter">{sector.name}</p>
                              <div className="flex flex-col md:flex-row md:items-center justify-between text-[8px] md:text-[10px] text-gray-400 gap-1">
                                <span>Status: {sector.status}</span>
                                <span>Power: {sector.power}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar / Info - Desktop */}
              <div className="absolute right-8 bottom-8 w-64 glass p-6 rounded-lg border border-white/10 hidden lg:block backdrop-blur-xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-neon-pink" />
                  Live Intel
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Active Agents
                    </span>
                    <motion.span 
                      key={activeAgents}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="text-neon-blue font-mono"
                    >
                      {activeAgents.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      Network Stability
                    </span>
                    <motion.span 
                      key={networkStability}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className="text-neon-purple font-mono"
                    >
                      {networkStability}%
                    </motion.span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <p className="text-[10px] text-gray-500 italic">
                    * All territory data is synced via GenLayer Intelligent Contracts in real-time.
                  </p>
                </div>
              </div>

              {/* Mobile Intel Toggle */}
              <div className="absolute bottom-4 right-4 lg:hidden z-30">
                 <button 
                  onClick={() => setShowIntel(!showIntel)}
                  className="p-3 bg-neon-blue text-black rounded-full shadow-lg shadow-neon-blue/20"
                 >
                    <Target className="w-5 h-5" />
                 </button>
              </div>

              {/* Mobile Intel Panel */}
              <AnimatePresence>
                {showIntel && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute inset-x-0 bottom-0 bg-cyber-black/95 border-t border-neon-blue/30 p-6 z-40 lg:hidden backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-neon-pink" />
                        Live Intel
                      </h3>
                      <button onClick={() => setShowIntel(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          Agents
                        </span>
                        <span className="text-lg text-neon-blue font-mono font-bold">{activeAgents.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          Stability
                        </span>
                        <span className="text-lg text-neon-purple font-mono font-bold">{networkStability}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Bar Controls */}
            <div className="h-14 border-t border-white/5 bg-black/40 flex items-center justify-center gap-4 md:gap-8 px-4 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-neon-blue" /> Controlled
               </div>
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-neon-purple" /> Contested
               </div>
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-gray-500" /> Neutral
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
