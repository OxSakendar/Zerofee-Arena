'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Chain } from 'viem';

// Define GenLayer Studio Custom Chain
export const genLayerStudio = {
  id: 61999,
  name: 'GenLayer Studio',
  nativeCurrency: { name: 'GenLayer', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://studio.genlayer.com/api'] },
  },
  blockExplorers: {
    default: { name: 'GenLayer Explorer', url: 'https://explorer-studio.genlayer.com/' },
  },
} as const satisfies Chain;

// Get RainbowKit default config (supports MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet out of the box with wallets imported)
const config = getDefaultConfig({
  appName: 'ZeroFee Arena',
  projectId: '3fcc6bba6f1de962d911bb5b5c3dba68', // Generic WalletConnect Project ID for dev
  chains: [genLayerStudio],
  ssr: true, // Next.js App Router support
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00f3ff',
            accentColorForeground: '#050505',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
