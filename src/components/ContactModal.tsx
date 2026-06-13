"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusLogs, setStatusLogs] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setAlias('');
      setEmail('');
      setMessage('');
      setStatusLogs([]);
      setIsSending(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const addLogWithDelay = (log: string, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setStatusLogs((prev) => [...prev, log]);
        resolve();
      }, delay);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias || !email || !message) return;

    setIsSending(true);
    setStatusLogs([]);

    await addLogWithDelay(">> INITIALIZING SECURE UPLINK...", 300);
    await addLogWithDelay(">> ENCRYPTING PACKET (AES-GCM-256)...", 500);
    await addLogWithDelay(">> ROUTING VIA PROXY NODE: [182.93.44.11]", 400);
    await addLogWithDelay(">> INJECTING TO GENVM DECENTRALIZED DATA STREAM...", 600);
    await addLogWithDelay(">> CONFIRMED: TRANSMISSION BROADCAST COMPLETE.", 400);

    setIsSuccess(true);
    setIsSending(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-cyber-black rounded-xl border border-neon-blue/30 overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.15)] flex flex-col z-10"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-neon-blue animate-pulse" />
                <h2 className="text-sm md:text-lg font-bold tracking-widest text-glow uppercase">ESTABLISH CHANNEL</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                disabled={isSending}
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Form & Terminal Section */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Alias input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Agent Alias
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSending}
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="e.g. CYBER_SHADOW"
                      className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors placeholder:text-gray-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Secure Address Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Secure Mail Address
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isSending}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. shadow@nexus.net"
                      className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors placeholder:text-gray-600 disabled:opacity-50"
                    />
                  </div>

                  {/* Intel / Message Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Intel / Message Payload
                    </label>
                    <textarea
                      required
                      rows={4}
                      disabled={isSending}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your encrypted transmission here..."
                      className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors placeholder:text-gray-600 disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isSending || !alias || !email || !message}
                    className={`w-full py-4 rounded font-bold transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider ${
                      isSending
                        ? 'bg-neon-blue/20 text-neon-blue cursor-not-allowed border border-neon-blue/20'
                        : 'bg-transparent border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black shadow-[0_0_15px_rgba(0,243,255,0.15)] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] cursor-pointer'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'TRANSFERENCE ACTIVE' : 'SEND TRANSMISSION'}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-neon-blue/10 border border-neon-blue flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                  >
                    <CheckCircle className="w-8 h-8 text-neon-blue" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">Uplink Confirmed</h3>
                  <p className="text-sm text-gray-400 max-w-sm mb-8">
                    Your secure transmission has been successfully routed. Our cyber operatives will review your payload shortly.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white rounded transition-colors"
                  >
                    Close Terminal
                  </button>
                </div>
              )}

              {/* Status Logs Overlay for sending action */}
              {statusLogs.length > 0 && (
                <div className="mt-6 p-4 bg-black/80 rounded border border-white/5 font-mono text-[10px] space-y-1 max-h-40 overflow-y-auto">
                  {statusLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        idx === statusLogs.length - 1 && isSending
                          ? 'text-neon-blue animate-pulse'
                          : idx === statusLogs.length - 1 && isSuccess
                          ? 'text-green-400'
                          : 'text-gray-500'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="h-10 border-t border-white/5 bg-black/40 flex items-center px-6 text-[9px] font-mono text-gray-500 tracking-wider justify-between shrink-0">
              <span>STATUS: SECURE PORT ACTIVE</span>
              <span>TUNNEL ID: 0x9A..3F</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
