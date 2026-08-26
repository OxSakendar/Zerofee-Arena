"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon, Target, Users, Shield, RefreshCw, Swords } from 'lucide-react';
import Image from 'next/image';
import { createClient } from 'genlayer-js';
import { studionet as studioChain } from 'genlayer-js/chains';

const CONTRACT_ADDRESS = "0x32F69599A8Ea389ba856BE946dC8e28BA66B9E26";

export interface SectorNode {
  id: string;
  name: string;
  x: string;
  y: string;
  controller: string;
  territories: number;
  score: number;
  status: string;
}

interface WorldMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTarget?: (address: string) => void;
}

const DEFAULT_SECTORS: SectorNode[] = [
  { id: 'neo-tokyo', name: 'Neo Tokyo Sector', x: '75%', y: '35%', controller: '', territories: 1, score: 100, status: 'Neutral' },
  { id: 'under-london', name: 'Under London Grid', x: '45%', y: '25%', controller: '', territories: 1, score: 100, status: 'Neutral' },
  { id: 'amazonia-hive', name: 'Amazonia Data Hive', x: '35%', y: '65%', controller: '', territories: 1, score: 100, status: 'Neutral' },
  { id: 'arctic-vault', name: 'Arctic Seed Vault', x: '55%', y: '15%', controller: '', territories: 1, score: 100, status: 'Neutral' },
  { id: 'orbital-station', name: 'Orbital Station Zero', x: '20%', y: '20%', controller: '', territories: 1, score: 100, status: 'Neutral' },
  { id: 'shanghai-nexus', name: 'Shanghai Cyber Nexus', x: '80%', y: '50%', controller: '', territories: 1, score: 100, status: 'Neutral' },
];

export const WorldMap: React.FC<WorldMapProps> = ({ isOpen, onClose, onSelectTarget }) => {
  const [sectors, setSectors] = useState<SectorNode[]>(DEFAULT_SECTORS);
  const [activeAgents, setActiveAgents] = useState<number>(0);
  const [totalTerritories, setTotalTerritories] = useState<number>(0);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [showIntel, setShowIntel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorldState = useCallback(async () => {
    try {
      setIsLoading(true);
      const readClient = createClient({ chain: studioChain });
      const rawRes = await readClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_world_sectors",
        args: [],
      });

      if (typeof rawRes === "string") {
        const data = JSON.parse(rawRes);
        if (data && Array.isArray(data.sectors)) {
          setSectors(data.sectors);
          setActiveAgents(Number(data.total_agents || 0));
          setTotalTerritories(Number(data.total_territories || 0));
        }
      }
    } catch (err) {
      console.warn("Error reading contract world sectors:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchWorldState();
    }
  }, [isOpen, fetchWorldState]);

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
                <h2 className="text-sm md:text-xl font-bold tracking-widest text-glow uppercase">On-Chain Territory Grid</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchWorldState}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-neon-blue flex items-center gap-1.5 text-xs font-bold"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Sync Contract</span>
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </button>
              </div>
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
                  
                  {/* Interactive Sector Nodes */}
                  {sectors.map((sector) => (
                    <motion.div
                      key={sector.id}
                      style={{ left: sector.x, top: sector.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      onMouseEnter={() => setHoveredSector(sector.id)}
                      onMouseLeave={() => setHoveredSector(null)}
                      onClick={() => setHoveredSector(hoveredSector === sector.id ? null : sector.id)}
                    >
                      <div className="relative">
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${sector.controller ? 'bg-neon-blue' : 'bg-neon-purple'} animate-pulse shadow-[0_0_15px_rgba(0,243,255,0.5)]`} />
                        <div className={`absolute inset-0 rounded-full border-2 ${sector.controller ? 'border-neon-blue' : 'border-white/20'} animate-ping opacity-50`} />
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredSector === sector.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, x: -50 }}
                              animate={{ opacity: 1, y: -70, x: -50 }}
                              exit={{ opacity: 0, y: 10, x: -50 }}
                              className="absolute z-30 w-44 md:w-56 glass p-3 rounded border border-neon-blue/40 pointer-events-auto"
                            >
                              <p className="text-xs font-bold text-neon-blue mb-1 uppercase tracking-tighter">{sector.name}</p>
                              <div className="flex flex-col text-[10px] text-gray-300 gap-1 mb-2 font-mono">
                                <span>Controller: {sector.controller ? `${sector.controller.slice(0, 6)}...${sector.controller.slice(-4)}` : "Unclaimed"}</span>
                                <span>Score: {sector.score} pts | Terr: {sector.territories}</span>
                              </div>
                              {sector.controller && onSelectTarget && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectTarget(sector.controller);
                                    onClose();
                                  }}
                                  className="w-full py-1 bg-neon-pink/20 border border-neon-pink/50 text-neon-pink hover:bg-neon-pink hover:text-black font-bold text-[10px] rounded transition-colors flex items-center justify-center gap-1 uppercase"
                                >
                                  <Swords className="w-3 h-3" /> Assault Sector
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar / Info - Desktop */}
              <div className="absolute right-8 bottom-8 w-64 glass p-6 rounded-lg border border-white/10 hidden lg:block backdrop-blur-xl z-20">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-neon-pink" />
                  Contract Intelligence
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users className="w-3 h-3 text-neon-blue" />
                      Registered Agents
                    </span>
                    <span className="text-neon-blue font-mono font-bold">
                      {activeAgents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-neon-purple" />
                      Controlled Territories
                    </span>
                    <span className="text-neon-purple font-mono font-bold">
                      {totalTerritories}
                    </span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <p className="text-[10px] text-gray-400 italic">
                    * World sectors map authoritatively to registered GenLayer Intelligent Contract player state.
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
                        On-Chain Intel
                      </h3>
                      <button onClick={() => setShowIntel(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          Agents
                        </span>
                        <span className="text-lg text-neon-blue font-mono font-bold">{activeAgents}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          Territories
                        </span>
                        <span className="text-lg text-neon-purple font-mono font-bold">{totalTerritories}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Bar Controls */}
            <div className="h-14 border-t border-white/5 bg-black/40 flex items-center justify-center gap-4 md:gap-8 px-4 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-neon-blue" /> Controlled Sectors
               </div>
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-neon-purple" /> Contested Sectors
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

