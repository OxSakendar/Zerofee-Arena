# CLAUDE.md — ZeroFee Arena Developer Guidelines

This file documents common commands, build processes, and coding style guidelines for ZeroFee Arena.

---

## 🚀 Common Commands

* **Run Development Server**: `npm run dev` (On Windows PowerShell, use `npm.cmd run dev` to bypass script execution block)
* **Build Application**: `npm run build`
* **Start Production Server**: `npm run start`
* **Linting**: `npm run lint`

---

## 🎨 Code Style & Conventions

* **Imports**: Use path aliases (`@/components/*`, `@/app/*`) rather than relative paths.
* **Client Directives**: Add `"use client"` at the top of client-interactive React components (especially those using React hooks, RainbowKit, wagmi, or Framer Motion).
* **Styling**: Use Tailwind CSS v4 class conventions with modern cyberpunk classes (`bg-cyber-black`, `text-neon-blue`, `text-neon-purple`, `text-neon-pink`, `text-neon-green`, `.text-glow`).
* **Icons**: Standardize on `lucide-react` for all UI icons.
* **State Management**: Use React hooks (`useState`, `useEffect`) and Wagmi React hooks for contract read/write interactions.
* **Smart Contracts**: Keep Py-GenLayer python contract variables type-hinted and conformant with the `gl.Contract` class structure.

---

## 📂 Reference Documentation
* See [AGENTS.md](file:///d:/ZeroFee%20Arena/Zerofee-Arena/AGENTS.md) for full tech stack, custom blockchain RPC configurations, and detailed component layouts.
