<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ZeroFee Arena — Developer Agent Guide

This repository contains the codebase for **ZeroFee Arena**, an AI-native strategy game built using Next.js and GenLayer Intelligent Contracts.

---

## 🛠️ Tech Stack & Dependencies
* **Core**: Next.js 16.2 (using Turbopack) & React 19.2
* **Styling**: Tailwind CSS v4
* **Animations**: Framer Motion
* **Web3 Integration**: Wagmi v2 + RainbowKit v2 + Viem v2
* **Intelligent Contract SDK**: `genlayer-js` v1.1.8

---

## ⛓️ Blockchain & Network configuration
The frontend interacts with the **GenLayer Studio** network.
* **Chain ID**: `61999`
* **RPC URL**: `https://studio.genlayer.com/api`
* **Block Explorer**: `https://explorer-studio.genlayer.com/`
* **Wallet Connect Project ID**: Pre-configured in `src/app/providers.tsx`.

---

## 📜 Smart Contracts (`/contracts`)
* **`arena.py`**: A GenLayer python-based smart contract (`ZeroFeeArena`) simulating decentralized AI consensus.
  * Extends `gl.Contract` class.
  * Public views: `get_player_territories(player_id)`
  * Public writes: `register_player(player_id)`, `execute_ai_turn(player_id, prompt)`

---

## 🎨 Theme & Design System
The frontend utilizes a customized neon cyberpunk design system:
* **Background**: `bg-cyber-black` (solid deep charcoal/black canvas)
* **Core Accent Colors**:
  * Neon Blue (`#00f3ff`): `text-neon-blue`, `border-neon-blue`
  * Neon Purple (`#b026ff`): `text-neon-purple`, `border-neon-purple`
  * Neon Pink (`#ff007f`): `text-neon-pink`, `border-neon-pink`
  * Neon Green (`#39ff14`): `text-neon-green`, `border-neon-green`
* **Glow Effects**: Text and box shadows are applied via `.text-glow` utilities to give high-premium cyberpunk glowing interfaces.

---

## 🧱 Custom Components (`/src/components`)
1. **`PolicyModal.tsx`**
   * **Purpose**: Displays legal policies (Terms of Service, Privacy Policy, Cookie Policy).
   * **Size**: Small (`max-w-2xl`).
   * **Interface**: Sidebar tabs with custom active highlights.
2. **`ContactModal.tsx`**
   * **Purpose**: A secure communication terminal interface.
   * **Size**: Small (`max-w-md`).
   * **Features**: Terminal log console that simulates real-time data packet encryption and proxy-routing logs during form transmission.
3. **`WorldMap.tsx`**
   * **Purpose**: Global interactive map showing controlled and contesting territories.
4. **`Leaderboard.tsx`**
   * **Purpose**: Live ranking of top AI strategy agents.
