"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Zap, Map, BrainCircuit, Swords, Award, RefreshCw, UserCheck } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from 'genlayer-js';
import { studionet as studioChain } from 'genlayer-js/chains';
import { TransactionStatus, ExecutionResult } from 'genlayer-js/types';
import { WorldMap } from "@/components/WorldMap";
import { Leaderboard, LeaderboardAgent } from "@/components/Leaderboard";

const CONTRACT_ADDRESS = "0x32F69599A8Ea389ba856BE946dC8e28BA66B9E26";

type TabMode = 'mission' | 'battle';

export default function Arena() {
  const { isConnected, address, connector } = useAccount();
  const router = useRouter();
  
  const [territories, setTerritories] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState<TabMode>('mission');
  
  // Custom inputs
  const [missionPrompt, setMissionPrompt] = useState("");
  const [targetDefender, setTargetDefender] = useState("");
  const [battleStrategy, setBattleStrategy] = useState("");
  
  const [registeredAgents, setRegisteredAgents] = useState<LeaderboardAgent[]>([]);
  const [missionLog, setMissionLog] = useState("Connecting to GenLayer contract state...");
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Authoritative State Reader: Fetch player status directly from smart contract
  const fetchContractState = useCallback(async (playerAddr: string) => {
    try {
      const readClient = createClient({ chain: studioChain });
      const normalizedAddr = playerAddr.toLowerCase();
      
      const [terrsRes, scoreRes, outcomeRes, lbRes] = await Promise.all([
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_player_territories",
          args: [normalizedAddr],
        }).catch(() => null),
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_player_score",
          args: [normalizedAddr],
        }).catch(() => null),
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_last_outcome",
          args: [normalizedAddr],
        }).catch(() => null),
        readClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          functionName: "get_leaderboard",
          args: [],
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
        setMissionLog("Awaiting strategic action dispatch...");
      }

      if (typeof lbRes === "string") {
        try {
          const parsed = JSON.parse(lbRes);
          if (Array.isArray(parsed)) {
            setRegisteredAgents(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse contract leaderboard array:", e);
        }
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

  const handleExecuteMission = async () => {
    if (!address) return;
    const finalPrompt = missionPrompt.trim() || "Infiltrate orbital data mainframe and secure sector assets";
    
    try {
      setIsPending(true);
      setMissionLog("[GENVM MISSION DISPATCH]\n\nAwaiting wallet signature for authenticated AI turn...");
      
      const provider: any = connector ? await connector.getProvider() : (window as any).ethereum;
      if (!provider) throw new Error("No Web3 wallet provider detected. Please connect your wallet.");

      const writeClient = createClient({
        chain: studioChain,
        account: address as `0x${string}`,
        provider: provider,
      });

      await writeClient.connect("studionet");

      // Execute on-chain transaction. Identity is authenticated via gl.message.sender inside contract!
      const txHash = await writeClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "execute_ai_turn",
        args: [finalPrompt],
        value: 0n,
      });

      setMissionLog(
        `[TRANSACTION DISPATCHED ON-CHAIN]\n\n` +
        `Tx Hash: ${txHash}\n\n` +
        `Awaiting GenVM LLM validator consensus across nodes...`
      );

      const readClient = createClient({ chain: studioChain });
      const receipt = await readClient.waitForTransactionReceipt({
        hash: txHash as any,
        status: TransactionStatus.ACCEPTED,
      });

      if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
        throw new Error(`GenVM Transaction Reverted on-chain (Tx: ${txHash.slice(0, 10)}...).`);
      }

      setMissionLog("[CONSENSUS REACHED]\n\nFetching validated on-chain outcome...");
      await fetchContractState(address);
      setMissionPrompt("");
    } catch (err: any) {
      console.error("Contract transaction error:", err);
      setMissionLog(`[ON-CHAIN EXECUTION FAILURE]\n\n${err.message || "Failed to execute intelligent contract turn."}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleExecuteBattle = async () => {
    if (!address) return;
    if (!targetDefender.trim()) {
      alert("Please select or enter a target defender agent address.");
      return;
    }
    const finalStrategy = battleStrategy.trim() || "Overload grid nodes with EMP pulse and launch direct assault";

    try {
      setIsPending(true);
      setMissionLog(`[PVP BATTLE DISPATCH]\n\nInitiating combat assault against Agent ${targetDefender.slice(0, 8)}...`);

      const provider: any = connector ? await connector.getProvider() : (window as any).ethereum;
      if (!provider) throw new Error("No Web3 wallet provider detected.");

      const writeClient = createClient({
        chain: studioChain,
        account: address as `0x${string}`,
        provider: provider,
      });

      await writeClient.connect("studionet");

      // Execute on-chain PvP battle evaluation. Attacker is gl.message.sender.
      const txHash = await writeClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        functionName: "evaluate_battle",
        args: [targetDefender.trim(), finalStrategy],
        value: 0n,
      });

      setMissionLog(
        `[BATTLE TRANSACTION DISPATCHED]\n\n` +
        `Tx Hash: ${txHash}\n\n` +
        `GenVM AI Battle Judge resolving tactical strategy across validator consensus...`
      );

      const readClient = createClient({ chain: studioChain });
      const receipt = await readClient.waitForTransactionReceipt({
        hash: txHash as any,
        status: TransactionStatus.ACCEPTED,
      });

      if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
        throw new Error(`Battle transaction reverted on-chain.`);
      }

      setMissionLog("[BATTLE RESOLVED]\n\nUpdating world map & player territory control...");
      await fetchContractState(address);
      setBattleStrategy("");
    } catch (err: any) {
      console.error("Battle transaction error:", err);
      setMissionLog(`[BATTLE EXECUTION FAILURE]\n\n${err.message || "Failed to resolve battle transaction."}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectTargetAgent = (defenderAddr: string) => {
    setTargetDefender(defenderAddr);
    setActiveTab('battle');
    window.scrollTo({ top: 300, behavior: 'smooth' });
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
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Command Center</h1>
            <p className="text-sm md:text-base text-gray-400 font-mono">
              Authenticated Agent: <span className="text-neon-blue">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchContractState(address!)}
              disabled={isPending}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
              Sync On-Chain
            </button>
            <button
              onClick={() => setIsMapOpen(true)}
              className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/40 text-neon-blue hover:bg-neon-blue hover:text-black rounded text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" />
              World Map
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Territories Card */}
          <div className="glass-card p-8 rounded-xl border border-neon-blue/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Controlled Territories</h2>
                <Map className="w-6 h-6 text-neon-blue" />
              </div>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white mb-4">
                {territories}
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-gray-400 flex items-center gap-1.5 font-medium">
                <Award className="w-4 h-4 text-neon-green" /> Rank: <span className="text-white font-bold">{playerRank}</span> ({score} pts)
              </p>
              <button 
                onClick={() => setIsMapOpen(true)}
                className="text-xs font-bold text-neon-blue hover:text-white transition-colors flex items-center gap-1 uppercase tracking-tighter cursor-pointer"
              >
                Map →
              </button>
            </div>
          </div>

          {/* Interactive Command Terminal */}
          <div className="glass-card p-8 rounded-xl border border-neon-purple/20 lg:col-span-2">
            {/* Tab Switcher */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'mission'
                      ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(176,38,255,0.4)]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" /> AI Mission Loop
                </button>
                <button
                  onClick={() => setActiveTab('battle')}
                  className={`px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'battle'
                      ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Swords className="w-4 h-4" /> Contested Battle
                </button>
              </div>
              <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest flex items-center gap-1 hidden sm:flex">
                <UserCheck className="w-3 h-3" /> Identity Authenticated
              </span>
            </div>

            {/* TAB 1: AI Mission Loop */}
            {activeTab === 'mission' && (
              <div>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  Formulate a custom tactical strategy. The GenLayer Intelligent Contract will execute non-deterministic LLM evaluation across validator nodes and authoritatively update your on-chain score and territory holdings.
                </p>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Tactical Mission Prompt:</label>
                  <textarea
                    rows={2}
                    value={missionPrompt}
                    onChange={(e) => setMissionPrompt(e.target.value)}
                    placeholder="e.g. Infiltrate quantum data vault in Neo Tokyo and deploy countermeasures..."
                    className="w-full bg-black/70 border border-white/10 rounded p-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-colors"
                  />
                </div>
                <button 
                  onClick={handleExecuteMission}
                  disabled={isPending}
                  className={`w-full py-3.5 bg-neon-purple text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)] text-sm uppercase tracking-wider cursor-pointer ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
                >
                  {isPending ? 'Processing On-Chain Consensus...' : 'Execute Intelligent Turn (0.0 GEN)'}
                </button>
              </div>
            )}

            {/* TAB 2: Contested PvP Battle System */}
            {activeTab === 'battle' && (
              <div>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  Challenge a registered rival agent for territory control. Input their address (or select from leaderboard/world map) and deploy your assault vector.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Target Defender Address:</label>
                    <input
                      type="text"
                      value={targetDefender}
                      onChange={(e) => setTargetDefender(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-black/70 border border-white/10 rounded p-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Select Registered Target:</label>
                    <select
                      onChange={(e) => setTargetDefender(e.target.value)}
                      value={targetDefender}
                      className="w-full bg-black/70 border border-white/10 rounded p-3 text-sm font-mono text-white focus:outline-none focus:border-neon-pink transition-colors"
                    >
                      <option value="">-- Choose Rival Agent --</option>
                      {registeredAgents
                        .filter(a => a.address && a.address.toLowerCase() !== address?.toLowerCase())
                        .map(a => (
                          <option key={a.address} value={a.address}>
                            {a.address.slice(0, 8)}... ({a.score} pts, {a.territories} terr)
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Assault Battle Strategy:</label>
                  <textarea
                    rows={2}
                    value={battleStrategy}
                    onChange={(e) => setBattleStrategy(e.target.value)}
                    placeholder="e.g. Launch coordinated cyber-nuke attack targeting sector energy conduits..."
                    className="w-full bg-black/70 border border-white/10 rounded p-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink transition-colors"
                  />
                </div>
                <button 
                  onClick={handleExecuteBattle}
                  disabled={isPending || !targetDefender.trim()}
                  className={`w-full py-3.5 bg-neon-pink text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(255,0,127,0.3)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)] text-sm uppercase tracking-wider cursor-pointer ${isPending || !targetDefender.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
                >
                  {isPending ? 'Resolving On-Chain Battle...' : 'Launch Contested Assault (0.0 GEN)'}
                </button>
              </div>
            )}

            {/* Terminal Output Logs */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
                <span>GenVM Validator Console Log</span>
                <span className="text-neon-blue">Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
              </div>
              <div className="bg-black/80 border border-white/10 rounded p-4 text-xs md:text-sm font-mono text-gray-300 min-h-[110px] flex items-start justify-start whitespace-pre-wrap text-left overflow-y-auto max-h-[220px]">
                {missionLog}
              </div>
            </div>
          </div>
        </div>

        {/* Live Contract Leaderboard & PvP Challenge Table */}
        <Leaderboard onChallengeAgent={handleSelectTargetAgent} />
      </main>

      {/* World Map Modal */}
      <WorldMap 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelectTarget={handleSelectTargetAgent}
      />
    </div>
  );
}


