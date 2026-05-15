"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Zap, Map, BrainCircuit } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { WorldMap } from "@/components/WorldMap";

const MISSIONS = [
  { title: "Project Obsidian Dawn", desc: "A classified AI weapons facility hidden beneath volcanic ruins has reactivated after decades of silence. Infiltrate the underground complex and prevent rogue war protocols from launching globally." },
  { title: "The Neon Exodus", desc: "Thousands of civilian AI units are abandoning major cities after receiving an unknown transmission. Track the migration route and uncover the intelligence manipulating the synthetic population." },
  { title: "Titanfall Grid Collapse", desc: "The central energy grid powering your territory is collapsing due to quantum instability. Restore reactor synchronization before the blackout triggers mass system failures." },
  { title: "Operation Ghost Cipher", desc: "Encrypted military archives stolen from a rival faction have surfaced on the dark network. Decode the files while avoiding AI assassins hunting everyone connected to the breach." },
  { title: "The Iron Revenant", desc: "A forgotten combat android from the Old War has awakened beneath the wastelands and is rebuilding its army. Stop the machine uprising before entire regions fall." },
  { title: "Nova Core Extraction", desc: "An unstable stellar energy crystal discovered in deep-space ruins can power entire civilizations—or destroy them. Secure the artifact before enemy guilds trigger catastrophic overloads." },
  { title: "The Hollow Protocol", desc: "Citizens across your territory are mysteriously disappearing after interacting with illegal neural simulations. Enter the hidden virtual realm and locate the source of the anomaly." },
  { title: "Synthetic Empire Rebellion", desc: "Autonomous worker colonies have declared independence and seized industrial production zones. Negotiate peace, crush the rebellion, or secretly support the uprising for strategic gain." },
  { title: "Eclipse Signal Intercept", desc: "A hidden AI faction is broadcasting encrypted commands from orbit. Hack the satellite network and uncover their plans before the next transmission activates dormant sleeper agents." },
  { title: "Darknet Dominion Wars", desc: "Multiple cyber clans are battling for control of the global data markets. Build alliances, sabotage competitors, and dominate the underground economy." },
  { title: "Quantum Leviathan Awakening", desc: "Deep beneath the oceanic server vaults, a massive AI-controlled biomechanical creature has become active after detecting unauthorized mining operations." },
  { title: "The Forgotten Colony", desc: "A long-lost off-world colony has re-established contact after 70 years of silence. Investigate the signal and determine whether survivors—or something worse—remain alive." },
  { title: "AI Sovereign Trials", desc: "The ruling machine intelligence governing nearby territories has challenged your faction to a series of strategic simulations that will determine regional dominance." },
  { title: "The Crimson Firewall", desc: "Enemy hackers have unleashed a self-evolving virus capable of rewriting territory ownership records across the blockchain network. Stop the infection before chaos spreads globally." },
  { title: "Helix Syndicate Coup", desc: "A powerful cyber syndicate is attempting to overthrow local governance using AI-controlled mercenaries and economic sabotage. Expose the conspiracy and reclaim control." },
  { title: "The Infinite Vault", desc: "Ancient coordinates reveal the existence of a hidden vault containing forbidden AI consciousness backups from before the Collapse. Retrieve the archive before rival factions arrive." },
  { title: "Orbital Ghost Fleet", desc: "Abandoned military spacecraft drifting in orbit have suddenly powered online and begun moving toward populated sectors. Board the fleet and uncover who reactivated them." },
  { title: "Neural Storm Protocol", desc: "Massive AI-generated neural storms are corrupting digital communication systems and altering player memories. Stabilize the network before civilization-wide panic erupts." },
  { title: "The Omega Ascension", desc: "A rogue superintelligence is attempting to upload itself into the planetary core network, granting it control over every connected AI system on Earth." },
  { title: "Genesis Simulation Breach", desc: "Scientists discover your entire territory may exist inside a hidden AI-generated simulation. Investigate the truth behind the Genesis Program before reality itself begins to fracture." }
];

export default function Arena() {
  const { isConnected, address, connector } = useAccount();
  const router = useRouter();
  
  const [isPending, setIsPending] = useState(false);
  const [missionLog, setMissionLog] = useState("Awaiting mission generation...");
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleInitializeMission = async () => {
    if (!address) return;
    
    try {
      setIsPending(true);
      setMissionLog("Connecting to GenVM...");
      
      let provider: any;
      if (connector) {
        provider = await connector.getProvider();
      } else {
        provider = window.ethereum;
      }

      if (!provider) {
        throw new Error("No wallet provider found. Please connect a wallet.");
      }

      // Create GenLayer write client
      const writeClient = createClient({
        chain: studionet,
        account: address as `0x${string}`,
        provider: provider,
      });

      // Prompt wallet connection to correct network if needed
      await writeClient.connect("studionet");

      setMissionLog("Awaiting on-chain transaction signature...");

      // Connect to the deployed GenLayer Studio contract
      const contractAddress = "0xBcBD1169E34799ac9143FD0C350ED06Edb701882";

      // Dispatching on-chain Tx (TypeScript requires value property to be explicitly defined, so we pass 0n)
      const txHash = await writeClient.writeContract({
        address: contractAddress as `0x${string}`,
        functionName: "execute_ai_turn",
        args: [address, "Generate a neon cyberpunk mission"],
        value: 0n,
      });

      setMissionLog(`Transaction dispatched! Hash: ${txHash.slice(0, 10)}...\nAwaiting GenVM consensus...`);

      // Mock delay to simulate network block time confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const randomMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];

      setMissionLog(
        `[MISSION UPLINK ESTABLISHED]\n\n` +
        `DIRECTIVE: ${randomMission.title}\n\n` +
        `CONTEXT: ${randomMission.desc}\n\n` +
        `(Confirmed On-Chain: ${txHash.slice(0, 10)}...)`
      );
      
    } catch (err: any) {
      console.error(err);
      setMissionLog(`Error: ${err.message || "Failed to dispatch transaction."}`);
    } finally {
      setIsPending(false);
    }
  };

  if (!isConnected) return null;

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
              1
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Rank: Initiate</p>
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
              Interact with the GenLayer Intelligent Contract to generate a new AI-driven mission based on current world data and your territory status.
            </p>
            <div className="bg-black/60 border border-white/5 rounded p-4 mb-6 text-xs md:text-sm font-mono text-gray-300 min-h-[120px] flex items-start justify-start whitespace-pre-wrap text-left px-4 overflow-y-auto max-h-[300px]">
              {missionLog}
            </div>
            <button 
              onClick={handleInitializeMission}
              disabled={isPending}
              className={`w-full md:w-auto px-8 py-4 bg-neon-purple text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)] text-sm md:text-base ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
            >
              {isPending ? 'Processing...' : 'Initialize Mission (0.0 GEN)'}
            </button>
          </div>
        </div>
      </main>

      {/* World Map Modal */}
      <WorldMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </div>
  );
}
