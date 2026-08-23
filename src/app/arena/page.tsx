"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Zap, Map, BrainCircuit, ShieldAlert, Award } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from 'genlayer-js';
import { studionet as studioChain } from 'genlayer-js/chains';
import { TransactionStatus, ExecutionResult } from 'genlayer-js/types';
import { WorldMap } from "@/components/WorldMap";

const CONTRACT_ADDRESS = "0x32F69599A8Ea389ba856BE946dC8e28BA66B9E26";

export default function Arena() {
  const { isConnected, address, connector } = useAccount();
  const router = useRouter();
  
  const [territories, setTerritories] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [missionLog, setMissionLog] = useState("Connecting to GenLayer contract state...");
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Authoritative State Reader: Fetch player status directly from the smart contract
  const fetchContractState = useCallback(async (playerAddr: string) => {
    try {
      const readClient = createClient({ chain: studioChain });
      
      const [terrsRes, scoreRes, outcomeRes] = await Promise.all([
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_player_territories",
          args: [playerAddr],
        }).catch(() => null),
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_player_score",
          args: [playerAddr],
        }).catch(() => null),
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_last_outcome",
          args: [playerAddr],
        }).catch(() => null),
      ]);

      if (terrsRes !== null && terrsRes !== undefined) {
        setTerritories(Number(terrsRes));
      }
      if (scoreRes !== null && scoreRes !== undefined) {
        setScore(Number(scoreRes));
      }
      if (outcomeRes !== null && outcomeRes !== undefined && typeof outcomeRes === "string") {
        setMissionLog(outcomeRes);
      } else {
        setMissionLog("Awaiting mission generation...");
      }
    } catch (err) {
      console.error("Error reading authoritative contract state:", err);
      setMissionLog("Failed to sync state with GenLayer contract.");
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    } else if (address) {
      fetchContractState(address);
    }
  }, [isConnected, address, router, fetchContractState]);

  const handleInitializeMission = async () => {
    if (!address) return;
    
    try {
      setIsPending(true);
      setMissionLog("[GENVM NETWORK UPLINK]\n\nInitializing secure wallet connection to GenLayer Studio...");
      
      let provider: any;
      if (connector) {
        provider = await connector.getProvider();
      } else {
        provider = (window as any).ethereum;
      }

      if (!provider) {
        throw new Error("No Web3 wallet provider detected. Please connect your wallet.");
      }

      // Create GenLayer write client with user's wallet provider
      const writeClient = createClient({
        chain: studioChain,
        account: address as `0x${string}`,
        provider: provider,
      });

      // Connect wallet to target GenLayer chain
      await writeClient.connect("studionet");

      setMissionLog("[GENVM NETWORK UPLINK]\n\nAwaiting transaction signature in wallet...");

      // Execute on-chain transaction. Finalized contract outcomes are authoritative.
      const txHash = await writeClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "execute_ai_turn",
        args: [address, "Generate a neon cyberpunk strategy mission"],
        value: 0n,
      });

      setMissionLog(
        `[TRANSACTION DISPATCHED ON-CHAIN]\n\n` +
        `Tx Hash: ${txHash}\n\n` +
        `Awaiting GenVM validator consensus across nodes...`
      );

      // Create read client to monitor consensus status
      const readClient = createClient({ chain: studioChain });

      // Wait for validator consensus receipt
      const receipt = await readClient.waitForTransactionReceipt({
        hash: txHash as any,
        status: TransactionStatus.ACCEPTED,
      });

      if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
        throw new Error(`GenVM Transaction Reverted on-chain (Tx: ${txHash.slice(0, 10)}...).`);
      }

      setMissionLog("[CONSENSUS REACHED]\n\nQuerying updated contract state...");

      // Fetch the updated authoritative state directly from GenLayer contract
      await fetchContractState(address);
      
    } catch (err: any) {
      console.error("Contract transaction error:", err);
      setMissionLog(`[ON-CHAIN EXECUTION FAILURE]\n\n${err.message || "Failed to execute intelligent contract turn."}`);
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) return null;

  const playerRank = score > 300 ? "Dominator" : score > 150 ? "Tactician" : "Initiate";

  return (
    <div className="min-h-screen bg-cyber-black text-white selection:bg-neon-purple selection:text-black relative overflow-hidden">
      {/* Background styling */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" />
      </div>

      <nav className="relative z-50 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-neon-blue flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-wider text-glow whitespace-nowrap">ZEROFEE<span className="text-white">ARENA</span></span>
          </div>
          <div className="scale-90 md:scale-100 origin-right">
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Command Center</h1>
          <p className="text-sm md:text-base text-gray-400">Welcome, Agent {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Territories Card */}
          <div className="glass-card p-8 rounded-xl border border-neon-blue/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Controlled Territories</h2>
              <Map className="w-6 h-6 text-neon-blue" />
            </div>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white mb-4">
              {territories}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Award className="w-4 h-4 text-neon-green" /> Rank: {playerRank} ({score} pts)
              </p>
              <button 
                onClick={() => setIsMapOpen(true)}
                className="text-xs font-bold text-neon-blue hover:text-white transition-colors flex items-center gap-1 uppercase tracking-tighter"
              >
                View Map →
              </button>
            </div>
          </div>

          {/* AI Mission Generator Card */}
          <div className="glass-card p-8 rounded-xl border border-neon-purple/20 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-neon-purple" />
              <h2 className="text-xl font-bold text-white">Intelligent Mission Generator</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Interact with the GenLayer Intelligent Contract to generate a new AI-driven mission based on current world data and your territory status. Outcomes are finalized authoritatively on-chain via GenVM LLM consensus.
            </p>
            <div className="bg-black/60 border border-white/5 rounded p-4 mb-6 text-xs md:text-sm font-mono text-gray-300 min-h-[120px] flex items-start justify-start whitespace-pre-wrap text-left px-4 overflow-y-auto max-h-[300px]">
              {missionLog}
            </div>
            <button 
              onClick={handleInitializeMission}
              disabled={isPending}
              className={`w-full md:w-auto px-8 py-4 bg-neon-purple text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)] text-sm md:text-base ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
            >
              {isPending ? 'Processing On-Chain...' : 'Initialize Mission (0.0 GEN)'}
            </button>
          </div>
        </div>
      </main>

      {/* World Map Modal */}
      <WorldMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </div>
  );
}
