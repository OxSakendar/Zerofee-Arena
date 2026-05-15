"use client";

import { motion } from "framer-motion";
import { Shield, Cpu, Zap, Globe, Coins } from "lucide-react";
import Link from "next/link";
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  const handleEnterArena = () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else if (isConnected) {
      router.push('/arena');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white overflow-hidden selection:bg-neon-blue selection:text-black">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue opacity-20 blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-neon-pink opacity-10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-neon-blue flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-wider text-glow">ZEROFEE<span className="text-white">ARENA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-neon-blue transition-colors">Features</Link>
            <Link href="#leaderboard" className="hover:text-neon-purple transition-colors">Leaderboard</Link>
            <Link href="#docs" className="hover:text-neon-pink transition-colors">Docs</Link>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-neon-purple/30 text-neon-purple mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            <span className="text-sm font-medium tracking-wide">Powered by GenLayer Intelligent Contracts</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            The First <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">AI-Native</span><br />
            On-Chain Strategy Game
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mb-12"
          >
            Command intelligent agents, conquer territories, and outsmart your opponents in a zero-fee metaverse where AI logic lives directly on the blockchain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <div className="flex flex-col items-center">
              <button 
                onClick={handleEnterArena}
                className="px-8 py-4 rounded-sm bg-transparent border-2 border-neon-blue text-neon-blue font-bold text-lg hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] flex items-center gap-2 group"
              >
                <Zap className="w-5 h-5 group-hover:animate-bounce" />
                Enter the Arena
              </button>
              <span className="text-xs text-neon-pink mt-3 font-semibold uppercase tracking-wider">0.0 GEN Required</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="px-8 py-4 rounded-sm glass text-white font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                View World Map
              </button>
              <span className="text-xs text-gray-500 mt-3 font-semibold uppercase tracking-wider opacity-0">Spacer</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            { icon: Coins, title: "Zero Gas Fees", desc: "Play without friction. All transactions are meta-sponsored, giving you a true Web2 experience with Web3 ownership.", color: "text-neon-pink", border: "border-neon-pink/20" },
            { icon: Cpu, title: "Intelligent Contracts", desc: "NPCs and missions are powered by on-chain LLMs via GenLayer, reacting dynamically to internet data and player choices.", color: "text-neon-blue", border: "border-neon-blue/20" },
            { icon: Shield, title: "Optimistic Democracy", desc: "Fair and secure gameplay. All complex AI reasoning is validated through GenLayer's decentralized consensus mechanism.", color: "text-neon-purple", border: "border-neon-purple/20" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className={`glass-card p-8 rounded-xl border ${feature.border} hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className={`w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center mb-6 border border-white/5`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
