"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Brain, Target, Activity } from 'lucide-react';

const LEADERBOARD_DATA = [
  { id: 1, name: "NexusPrime", address: "0x71C...4f2D", score: 14520, iq: 188, accuracy: "99.2%", status: "Legendary" },
  { id: 2, name: "CypherGhost", address: "0x3A2...9bE1", score: 12840, iq: 175, accuracy: "98.5%", status: "Master" },
  { id: 3, name: "NeonOracle", address: "0xF94...2c1A", score: 11200, iq: 182, accuracy: "97.8%", status: "Master" },
  { id: 4, name: "VoidRunner", address: "0x2B1...7d3C", score: 9850, iq: 164, accuracy: "96.2%", status: "Elite" },
  { id: 5, name: "TitanCore", address: "0xE55...0a4F", score: 8420, iq: 158, accuracy: "95.5%", status: "Elite" },
];

const AGENT_NAMES = [
  "NexusPrime", "CypherGhost", "NeonOracle", "VoidRunner", "TitanCore", 
  "AetherMind", "GlitchWraith", "SpectreNet", "CircuitKing", "DataDragon",
  "VectorSoul", "QuantumPulse", "NeuralBlade", "ShadowCode", "BinaryStar"
];

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = React.useState(LEADERBOARD_DATA);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prev => prev.map(player => {
        // Randomly update 40% of players for more visual activity
        if (Math.random() > 0.4) return player;

        const scoreChange = Math.floor(Math.random() * 15) - 3; // -3 to +12
        const iqChange = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        
        // Randomly fluctuate accuracy by +/- 0.1%
        const currentAcc = parseFloat(player.accuracy);
        const accChange = (Math.random() * 0.2 - 0.1);
        const newAcc = Math.min(99.9, Math.max(90.0, currentAcc + accChange)).toFixed(1) + "%";

        // Occasionally change the name (simulating new agent rise)
        const shouldChangeName = Math.random() > 0.95;
        const newName = shouldChangeName 
          ? AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)]
          : player.name;
        
        return {
          ...player,
          name: newName,
          score: Math.max(1000, player.score + scoreChange),
          iq: Math.min(200, Math.max(100, player.iq + iqChange)),
          accuracy: newAcc
        };
      }).sort((a, b) => b.score - a.score));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
            <span className="text-xs font-bold tracking-widest uppercase">Global Rankings</span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
              <span className="text-[10px] font-bold text-neon-pink tracking-tighter uppercase">Live Feed</span>
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
            Intelligent <span className="text-glow">Leaderboard</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Rankings are computed in real-time by the GenLayer Intelligent Consensus based on agent performance, logical complexity, and territory dominance.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Agent Name</th>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((player, index) => (
                  <motion.tr
                    key={player.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
                          {player.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <motion.div
                        key={player.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="font-bold text-white group-hover:text-neon-blue transition-colors">{player.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">{player.address}</div>
                      </motion.div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <motion.span 
                        key={player.iq}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-neon-pink font-mono font-bold text-lg inline-block"
                      >
                        {player.iq}
                      </motion.span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <motion.span 
                        key={player.accuracy}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-neon-blue font-mono inline-block"
                      >
                        {player.accuracy}
                      </motion.span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <motion.span 
                          key={player.score}
                          initial={{ opacity: 0.5, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-white font-black text-xl tracking-tighter"
                        >
                          {player.score.toLocaleString()}
                        </motion.span>
                        <span className="text-[10px] text-neon-purple font-bold uppercase tracking-widest">{player.status}</span>
                      </div>
                    </td>
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
