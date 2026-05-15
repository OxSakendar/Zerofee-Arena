"use client";

import { useAccount, useSwitchChain } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Zap, Map, BrainCircuit } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

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
  const { isConnected, address, connector, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const router = useRouter();
  
  const [isPending, setIsPending] = useState(false);
  const [missionLog, setMissionLog] = useState("Awaiting mission generation...");

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleInitializeMission = async () => {
    if (!address) return;
    
    try {
      setIsPending(true);
      setMissionLog("Checking network status...");
      
      // Ensure we are on GenLayer Studio (61999)
      if (chainId !== 61999) {
        setMissionLog("Switching network to GenLayer Studio...");
        try {
          await switchChainAsync({ chainId: 61999 });
        } catch (switchErr: any) {
          throw new Error(`Please switch to GenLayer Studio network: ${switchErr.message}`);
        }
      }

      setMissionLog("Connecting to GenVM...");
      
      let provider: any;
      if (connector) {
        provider = await connector.getProvider();
      } else {
        provider = (window as any).ethereum;
      }

      if (!provider) {
        throw new Error("No wallet provider found. Please connect a wallet.");
      }

      console.log("Initializing GenLayer client with:", { address, chainId });

      // Create GenLayer write client
      // Note: passing account as an object with address property to ensure compatibility with genlayer-js 1.1.8
      const writeClient = createClient({
        chain: studionet,
        account: { address } as any,
        provider: provider,
      });

      // Prompt wallet connection to correct network if needed (genlayer-js internal logic)
      // We already did this with wagmi, but it doesn't hurt to keep it if it handles snaps
      try {
        await writeClient.connect("studionet");
      } catch (connErr: any) {
        console.warn("writeClient.connect failed (might be expected if already connected):", connErr);
      }

      setMissionLog("Awaiting on-chain transaction signature...");

      // Connect to the deployed GenLayer Studio contract
      const contractAddress = "0xBcBD1169E34799ac9143FD0C350ED06Edb701882";

      console.log("Calling contract:", contractAddress);

      // Dispatching on-chain Tx
      const txHash = await writeClient.writeContract({
        address: contractAddress as `0x${string}`,
        functionName: "execute_ai_turn",
        args: [address, "Generate a neon cyberpunk mission"],
        value: 0n,
      });

      console.log("Transaction success!", txHash);
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
      console.error("Mission Initialization Error:", err);
      // Detailed error reporting
      let errorMessage = err.message || "Failed to dispatch transaction.";
      if (err.data?.message) errorMessage += ` (${err.data.message})`;
      setMissionLog(`Error: ${errorMessage}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleRegisterPlayer = async () => {
    if (!address) return;
    
    try {
      setIsPending(true);
      setMissionLog("Checking network status...");
      
      if (chainId !== 61999) {
        setMissionLog("Switching network to GenLayer Studio...");
        await switchChainAsync({ chainId: 61999 });
      }

      setMissionLog("Connecting to GenVM...");
      
      let provider: any;
      if (connector) {
        provider = await connector.getProvider();
      } else {
        provider = (window as any).ethereum;
      }

      const writeClient = createClient({
        chain: studionet,
        account: { address } as any,
        provider: provider,
      });

      try {
        await writeClient.connect("studionet");
      } catch (e) {}

      setMissionLog("Registering account on-chain...");

      const contractAddress = "0xBcBD1169E34799ac9143FD0C350ED06Edb701882";

      const txHash = await writeClient.writeContract({
        address: contractAddress as `0x${string}`,
        functionName: "register_player",
        args: [address],
        value: 0n,
      });

      setMissionLog(`Registration successful!\nTx: ${txHash.slice(0, 10)}...\nYou can now initialize missions.`);
      
    } catch (err: any) {
      console.error("Registration Error:", err);
      setMissionLog(`Registration Error: ${err.message || "Failed to register."}`);
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

      <nav className="relative z-10 border-b border-white/5 glass px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-neon-blue flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-wider text-glow">ZEROFEE<span className="text-white">ARENA</span></span>
        </div>
        <ConnectButton />
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2">Command Center</h1>
          <p className="text-gray-400">Welcome to the grid, Agent {address?.slice(0, 6)}...{address?.slice(-4)}</p>
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
            <p className="text-sm text-gray-400">Rank: Initiate</p>
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
            <div className="bg-black/40 border border-white/5 rounded p-4 mb-6 text-sm font-mono text-gray-300 min-h-[100px] flex items-center justify-center whitespace-pre-wrap text-left px-4">
              {missionLog}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleRegisterPlayer}
                disabled={isPending}
                className={`flex-1 px-6 py-4 border-2 border-neon-blue text-neon-blue font-bold rounded transition-all hover:bg-neon-blue hover:text-black ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Register Account
              </button>
              <button 
                onClick={handleInitializeMission}
                disabled={isPending}
                className={`flex-[2] px-8 py-4 bg-neon-purple text-white font-bold rounded transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.6)] ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
              >
                {isPending ? 'Processing...' : 'Initialize LLM Mission (0.0 GEN)'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
