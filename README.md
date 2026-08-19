# ⚡ ZeroFee Arena — AI-Native On-Chain Strategy Game

> **ZeroFee Arena** is the first AI-native, on-chain strategy game where game logic, non-player characters (NPCs), and territory outcomes are powered directly by **GenLayer Intelligent Contracts**. Set in a zero-fee metaverse, players command intelligent agents, conquer dynamic territories, and trigger non-deterministic AI missions evaluated across decentralized validator consensus.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📜 Intelligent Smart Contracts (`contracts/arena.py`)](#-intelligent-smart-contracts-contractsarenapy)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⛓️ Blockchain & Network Setup](#️-blockchain--network-setup)
- [🎨 Design System](#-design-system)

---

## ✨ Key Features

- **🤖 GenLayer Non-Deterministic AI Consensus**: Game actions and mission outcomes are evaluated by LLMs operating directly inside Python-based GenLayer Intelligent Contracts using `gl.nondet.exec_prompt` and validated through `gl.eq_principle`.
- **⚡ Zero Gas Fees**: Sponsored meta-transactions eliminate transaction friction, delivering a Web2-like user experience with Web3 ownership.
- **🗺️ Interactive World Map**: Real-time visual dashboard showcasing controlled and contested territories across the metaverse.
- **🏆 Live Leaderboard**: Rankings tracking top AI strategy agents by score and controlled regions.
- **💻 Interactive Command Terminal**: Embedded contact console simulating encrypted packet routing and real-time network logs.
- **🌌 Cyberpunk Design System**: Custom glassmorphism UI with neon blue (`#00f3ff`), purple (`#b026ff`), pink (`#ff003c`), and green (`#39ff14`) glow effects.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.2 (Turbopack) & React 19.2 |
| **Styling** | Tailwind CSS v4 & Custom Glassmorphism CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Web3 & Wallet** | Wagmi v2 + RainbowKit v2 + Viem v2 |
| **Intelligent Contracts** | GenLayer JS SDK (`genlayer-js` v1.1.8) |
| **Smart Contract Language** | Python (`py-genlayer`) |

---

## 📜 Intelligent Smart Contracts (`contracts/arena.py`)

ZeroFee Arena utilizes **GenLayer Intelligent Contracts**, extending standard Web3 smart contracts by introducing non-deterministic execution and LLM-powered consensus across validator nodes.

### Non-Deterministic Consensus Architecture

```python
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

class ZeroFeeArena(gl.Contract):
    players: TreeMap[str, u256]
    player_scores: TreeMap[str, u256]
    last_mission_outcomes: TreeMap[str, str]
    territories_controlled: u256

    @gl.public.write
    def execute_ai_turn(self, player_id: str, prompt: str) -> str:
        def non_deterministic_ai_eval():
            formatted_prompt = (
                f"You are the GenLayer AI Game Master for ZeroFee Arena. "
                f"Evaluate the player '{player_id}' performing action: '{prompt}'. "
                f"Respond ONLY with JSON: {{\"success\": true, \"territories_gained\": 1, \"score_delta\": 50, \"story\": \"...\"}}"
            )
            return gl.nondet.exec_prompt(formatted_prompt, response_format="json")

        # Consensus reached across validators via Equivalence Principle
        validated_json_str = gl.eq_principle.strict_eq(non_deterministic_ai_eval)
        ...
```

### Key Contract Functions
- `register_player(player_id)`: Initializes a new agent's record on-chain.
- `execute_ai_turn(player_id, prompt)`: Invokes non-deterministic LLM evaluation via `gl.nondet.exec_prompt`, validates via `gl.eq_principle.strict_eq`, and updates player territory & score storage state.
- `evaluate_battle(attacker_id, defender_id, strategy)`: Resolves PvP conflicts through AI decision-making.
- `get_player_territories(player_id)`, `get_player_score(player_id)`, `get_last_outcome(player_id)`: Public view functions for state retrieval.

---

## 📁 Project Structure

```
Zerofee-Arena/
├── contracts/
│   └── arena.py              # GenLayer Py-Contract with non-deterministic LLM consensus
├── src/
│   ├── app/
│   │   ├── arena/
│   │   │   └── page.tsx      # Command Center & AI Mission Generator
│   │   ├── globals.css       # Neon glow & glassmorphism style system
│   │   ├── layout.tsx        # App layout wrapper
│   │   ├── page.tsx          # Landing page with hero & features
│   │   └── providers.tsx     # Web3 Wagmi & RainbowKit provider configuration
│   └── components/
│       ├── ContactModal.tsx  # Interactive terminal contact interface
│       ├── Leaderboard.tsx   # Live strategy leaderboard component
│       ├── PolicyModal.tsx   # Modal for Terms, Privacy, & Cookie policies
│       └── WorldMap.tsx      # Global interactive territory map
├── next.config.ts            # Next.js 16 & Turbopack configuration
├── package.json              # Project dependencies & npm scripts
├── AGENTS.md                 # Agent guidelines & technical spec
└── README.md                 # Repository documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.x or v20.x
- **Package Manager**: `npm`

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/OxSakendar/Zerofee-Arena.git
   cd Zerofee-Arena
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## ⛓️ Blockchain & Network Setup

The application connects to **GenLayer Studio**:

- **Network Name**: GenLayer Studio
- **Chain ID**: `61999`
- **RPC URL**: `https://studio.genlayer.com/api`
- **Block Explorer**: [https://explorer-studio.genlayer.com/](https://explorer-studio.genlayer.com/)
- **Contract Address**: `0xb4412590158f0CceEc98ebffAFf99C851Ab6703c`

---

## 🎨 Design System

- **Background**: `bg-cyber-black` (`#050505`)
- **Accent Colors**:
  - `#00f3ff` (Neon Blue)
  - `#b026ff` (Neon Purple)
  - `#ff003c` (Neon Pink)
  - `#39ff14` (Neon Green)
- **Utilities**: `.text-glow`, `.glass`, `.glass-card`
