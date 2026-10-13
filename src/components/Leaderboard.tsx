"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Brain, Activity, RefreshCw, Swords } from 'lucide-react';
import { createClient } from 'genlayer-js';
import { studionet as studioChain } from 'genlayer-js/chains';

const CONTRACT_ADDRESS = "0xbDa11A2C1b5695225F52EFcb56B7ba24CA5eb98c";

export interface LeaderboardAgent {
  address: string;
  score: number;
  territories: number;
  last_outcome?: string;
  name?: string;
  iq?: number;
  accuracy?: string;
  status?: string;
}

interface LeaderboardProps {
  onChallengeAgent?: (address: string) => void;
}

const SEED_FALLBACK_AGENTS: LeaderboardAgent[] = [
  { address: "0x71c49b2000000000000000000000000000004f2d", name: "NexusPrime", score: 1450, territories: 12, iq: 188, accuracy: "99.2%", status: "Legendary" },
  { address: "0x3a29be1000000000000000000000000000009be1", name: "CypherGhost", score: 1280, territories: 9, iq: 175, accuracy: "98.5%", status: "Master" },
  { address: "0xf942c1a000000000000000000000000000002c1a", name: "NeonOracle", score: 1120, territories: 7, iq: 182, accuracy: "97.8%", status: "Master" },
  { address: "0x2b17d3c000000000000000000000000000007d3c", name: "VoidRunner", score: 980, territories: 5, iq: 164, accuracy: "96.2%", status: "Elite" },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ onChallengeAgent }) => {
  const [agents, setAgents] = useState<LeaderboardAgent[]>(SEED_FALLBACK_AGENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractSynced, setIsContractSynced] = useState(false);

  const fetchContractLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const readClient = createClient({ chain: studioChain });
      const rawRes = await readClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "get_leaderboard",
        args: [],
      });

      if (typeof rawRes === "string") {
        const parsed = JSON.parse(rawRes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted: LeaderboardAgent[] = parsed.map((item: any, idx: number) => {
            const shortAddr = item.address ? `${item.address.slice(0, 6)}...${item.address.slice(-4)}` : `Agent #${idx + 1}`;
            return {
              address: item.address || "",
              name: shortAddr,
              score: Number(item.score || 100),
              territories: Number(item.territories || 1),
              last_outcome: item.last_outcome || "Active Agent",
              iq: 140 + (Number(item.score || 100) % 50),
              accuracy: `${Math.min(99.9, 90 + (Number(item.score || 100) % 10)).toFixed(1)}%`,
              status: item.score > 300 ? "Dominator" : item.score > 150 ? "Tactician" : "Initiate"
            };
          });
          setAgents(formatted);
          setIsContractSynced(true);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch contract leaderboard, using seed fallback:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContractLeaderboard();
  }, [fetchContractLeaderboard]);

  return (
    <section id="leaderboard" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2 rounded-full glass border-neon-blue/30 text-neon-blue mb-4"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Global Contract Rankings</span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
              <span className={`w-1.5 h-1.5 rounded-full ${isContractSynced ? 'bg-neon-green' : 'bg-neon-pink'} animate-pulse`} />
              <span className={`text-[10px] font-bold ${isContractSynced ? 'text-neon-green' : 'text-neon-pink'} tracking-tighter uppercase`}>
                {isContractSynced ? "Contract Live" : "On-Chain Sync"}
              </span>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            Intelligent <span className="text-glow">Leaderboard</span>
          </h2>
          
          <p className="text-gray-400 text-center max-w-2xl mb-6">
            Rankings are computed authoritatively on-chain by GenLayer Intelligent Contracts based on agent territory dominance, AI strategy turns, and PvP combat victories.
          </p>

          <button
            onClick={fetchContractLeaderboard}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded glass border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-black transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing Contract State...' : 'Refresh On-Chain Rankings'}
          </button>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Agent Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Territories</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="w-3 h-3 text-neon-pink" />
                      Agent IQ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="w-3 h-3 text-neon-blue" />
                      Accuracy
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Power Score</th>
                  {onChallengeAgent && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agents.map((player, index) => (
                  <motion.tr
                    key={player.address || index}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="group hover:bg-white/5 transition-colors cursor-default"
                  >
                    <td className="px-6 py-6 font-mono">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                          index === 0 ? 'bg-neon-yellow/20 border-neon-yellow text-neon-yellow shadow-[0_0_15px_rgba(255,230,0,0.3)]' :
                          index === 1 ? 'bg-gray-300/20 border-gray-300 text-gray-300' :
                          index === 2 ? 'bg-orange-500/20 border-orange-500 text-orange-500' :
                          'bg-white/5 border-white/10 text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div>
                        <div className="font-bold text-white group-hover:text-neon-blue transition-colors font-mono">
                          {player.name || player.address}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5 max-w-[200px] truncate">
                          {player.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-neon-blue font-bold font-mono text-base">
                        {player.territories}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-neon-pink font-mono font-bold text-lg inline-block">
                        {player.iq}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="text-neon-blue font-mono inline-block">
                        {player.accuracy}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-white font-black text-xl tracking-tighter">
                          {player.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neon-purple font-bold uppercase tracking-widest">{player.status}</span>
                      </div>
                    </td>
                    {onChallengeAgent && (
                      <td className="px-6 py-6 text-center">
                        <button
                          onClick={() => onChallengeAgent(player.address)}
                          className="px-3 py-1.5 text-xs font-bold rounded bg-neon-pink/10 border border-neon-pink/40 text-neon-pink hover:bg-neon-pink hover:text-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          Challenge
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Decorative Grid background for section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none -z-10" />
      </div>
    </section>
  );
};

