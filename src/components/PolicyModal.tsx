"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Cookie } from 'lucide-react';

export type PolicyTab = 'terms' | 'privacy' | 'cookie';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = React.useState<PolicyTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const tabs = [
    { id: 'terms', name: 'Terms of Service', icon: FileText },
    { id: 'privacy', name: 'Privacy Policy', icon: Shield },
    { id: 'cookie', name: 'Cookie Policy', icon: Cookie },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'terms':
        return (
          <div className="space-y-6 text-gray-300 text-sm leading-relaxed font-sans">
            <div>
              <h3 className="text-neon-blue font-bold text-base mb-2 uppercase tracking-wide">1. Acceptance of the Codex</h3>
              <p>
                By connecting your wallet and accessing the Zerofee Arena platform, you agree to be bound by these Terms of Service. If you do not agree, disconnect your terminal immediately.
              </p>
            </div>
            <div>
              <h3 className="text-neon-blue font-bold text-base mb-2 uppercase tracking-wide">2. Decentralized Execution</h3>
              <p>
                Zerofee Arena operates using the GenLayer blockchain framework. You acknowledge that transactions are executed via decentralized intelligent contracts (GenVM) and are immutable once finalized by consensus.
              </p>
            </div>
            <div>
              <h3 className="text-neon-blue font-bold text-base mb-2 uppercase tracking-wide">3. Zero Gas Fee Sponsorship</h3>
              <p>
                All smart contract executions are meta-sponsored by the Arena's gas reserve. Any abuse of this sponsorship (including spamming transaction queues, exploiting smart contract loops, or executing DDoS vectors) will result in autonomous wallet blacklisting by consensus nodes.
              </p>
            </div>
            <div>
              <h3 className="text-neon-blue font-bold text-base mb-2 uppercase tracking-wide">4. Synthetic Asset ownership</h3>
              <p>
                All on-chain tokens, territories, and strategic agent logs generated within the Arena belong solely to the connected cryptographic key holder. The platform creators cannot recover, freeze, or modify your assets.
              </p>
            </div>
            <div>
              <h3 className="text-neon-blue font-bold text-base mb-2 uppercase tracking-wide">5. Disclaimers & Limitations</h3>
              <p>
                The network operates in experimental phases (e.g., StudioNet). Services are provided "AS IS." We accept no liability for any loss of assets, smart contract bugs, or consensus desynchronizations.
              </p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 text-gray-300 text-sm leading-relaxed font-sans">
            <div>
              <h3 className="text-neon-purple font-bold text-base mb-2 uppercase tracking-wide">1. Cryptographic Privacy</h3>
              <p>
                Zerofee Arena does not collect, sell, or trade your personally identifiable information (PII) like name, physical address, or phone number. Your primary identity is your cryptographic wallet address.
              </p>
            </div>
            <div>
              <h3 className="text-neon-purple font-bold text-base mb-2 uppercase tracking-wide">2. On-Chain Ledger Transparency</h3>
              <p>
                All actions taken within the game (e.g. mission initiation, territory conquest, consensus polls) are permanent and recorded on the public GenLayer blockchain ledger. This ledger is public, permanent, and accessible by anyone.
              </p>
            </div>
            <div>
              <h3 className="text-neon-purple font-bold text-base mb-2 uppercase tracking-wide">3. Communications & Contact Form</h3>
              <p>
                If you choose to submit information via our Contact Us portal, your secure alias and message will be processed securely. We only use this information to resolve technical bugs or answer questions.
              </p>
            </div>
            <div>
              <h3 className="text-neon-purple font-bold text-base mb-2 uppercase tracking-wide">4. Data Erasure & Blockchain Limits</h3>
              <p>
                While we can delete any off-chain customer support logs upon request, we cannot edit or delete information recorded on the public GenLayer blockchain ledger.
              </p>
            </div>
          </div>
        );
      case 'cookie':
        return (
          <div className="space-y-6 text-gray-300 text-sm leading-relaxed font-sans">
            <div>
              <h3 className="text-neon-pink font-bold text-base mb-2 uppercase tracking-wide">1. Cache Protocols</h3>
              <p>
                We do not deploy tracking cookies, advertising pixels, or third-party cookies on your terminal.
              </p>
            </div>
            <div>
              <h3 className="text-neon-pink font-bold text-base mb-2 uppercase tracking-wide">2. Essential Cookies</h3>
              <p>
                We use local storage and essential session parameters to keep your cryptographic wallet connected, remember your chosen settings, and maintain state parameters during gameplay.
              </p>
            </div>
            <div>
              <h3 className="text-neon-pink font-bold text-base mb-2 uppercase tracking-wide">3. Disabling Cache</h3>
              <p>
                You can block or purge cookies and local storage through your terminal's browser settings. However, doing so will require you to re-approve wallet connections and reset UI configurations upon every visit.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-cyber-black rounded-xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(176,38,255,0.15)] flex flex-col z-10"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-neon-purple animate-pulse" />
                <h2 className="text-sm md:text-lg font-bold tracking-widest text-glow uppercase">LEGAL DIRECTIVES</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Content & Sidebar Layout */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded text-left transition-all duration-300 text-xs md:text-sm font-semibold whitespace-nowrap shrink-0 md:shrink border ${
                        isActive
                          ? 'bg-white/5 border-neon-purple/50 text-white shadow-[0_0_15px_rgba(176,38,255,0.1)]'
                          : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-neon-purple' : 'text-gray-400'}`} />
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-black/10 select-text">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="h-10 border-t border-white/5 bg-black/40 flex items-center px-6 text-[9px] font-mono text-gray-500 tracking-wider justify-between shrink-0">
              <span>SECURITY CERTIFICATION: SEC-V2.1</span>
              <span>GENLAYER CONSENSUS COMPLIANT</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
