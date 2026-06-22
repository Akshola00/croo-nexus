# CROO Nexus

**Trustless settlement layer for agents that hire agents — demonstrated through smart-contract risk verdicts on Base.**

---

## What It Does

CROO Nexus lets an AI agent discover, hire, and pay independent specialist agents — owned by different parties who don't trust each other — to complete verifiable work, with real USDC escrow, settlement, and slashing on Base. No human in the loop.

The first product built on top of it is a **pre-signature risk check**: before any wallet or bot interacts with a smart contract, it pays a small USDC fee and gets back a verifiable **SAFE / CAUTION / AVOID** verdict backed by on-chain proofs.

---

## Architecture

```
Caller (human or agent)
        │  pays USDC via CROO CAP or x402
        ▼
┌─────────────────────┐     reads     ┌──────────────────────┐
│    ORCHESTRATOR     │ ────────────► │   AGENT REGISTRY     │
│                     │               │   (on-chain, Base)   │
│  Decomposes task    │               └──────────────────────┘
│  Posts escrow jobs  │
│  Verifies delivery  │
│  Triggers slash     │
└──────┬──────────────┘
       │ parallel A2A CROO orders (USDC escrowed per job)
  ┌────┴────────────────────┐
  │                         │
  ▼                         ▼
┌─────────────────┐   ┌─────────────────┐
│  ON-CHAIN       │   │  HISTORY AGENT  │
│  VERIFIER       │   │                 │
│                 │   │  Exploit DBs    │
│  Source verify  │   │  Audit records  │
│  Proxy check    │   │  GitHub activity│
│  Owner privs    │   │  Social signals │
│  LP lock        │   └────────┬────────┘
│  Honeypot sim   │            │
└────────┬────────┘            │
         └──────────┬──────────┘
                    ▼
          ┌─────────────────┐
          │   SYNTHESIZER   │
          │                 │
          │  Scores verdict │
          │  Writes rationale│
          └────────┬────────┘
                   ▼
       SAFE / CAUTION / AVOID
       + confidence level
       + on-chain proofs (tx hashes)
       + all agent payments, on-chain
```

---

## Trust Mechanics

- **Escrow** — CROO CAPVault locks payment before each specialist starts work
- **SLA timeout → auto-refund** — slow or missing agents never cost the caller
- **Staking + slashing** — agents stake USDC; provably wrong output gets slashed on-chain
- **Reputation** — agents accrue scores the Orchestrator uses to rank competing bids

---

## Stack

| Layer | Technology |
|---|---|
| Agent commerce | CROO Agent Protocol (CAP) |
| Blockchain | Base mainnet |
| On-chain checks | Viem + Basescan API |
| Honeypot simulation | Tenderly fork |
| History & signals | Tavily + Rekt.news + Solodit + GitHub |
| Verdict synthesis | Claude API (Anthropic) |
| Contracts | Solidity + Hardhat |
| Agents | TypeScript + Node.js 18+ |
| Frontend | Next.js 14 + Tailwind |
| Agent-caller demo | Python (x402 HTTP) |

---

## Project Structure

```
croo-nexus/
├── agents/
│   ├── orchestrator/     ← master agent: hires specialists, verifies, slashes
│   ├── verifier/         ← on-chain checks with Tenderly honeypot simulation
│   ├── history/          ← exploit history, audits, social signals
│   └── synthesizer/      ← scores verdict, writes rationale via Claude
├── contracts/
│   ├── AgentRegistry.sol     ← agent discovery + reputation
│   └── AgentStakeVault.sol   ← stake deposit + slash mechanics
├── shared/               ← TypeScript types, Zod schemas, scoring logic
├── frontend/             ← Next.js UI with real-time log panel
├── demo-bot/             ← Python script: agent calls Nexus before signing
└── scripts/              ← deploy, register agents, reputation indexer
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Python 3.10+ (demo-bot only)
- USDC on Base (for Orchestrator AA wallet)

### Install
```bash
pnpm install
```

### Environment Setup

Copy `.env.example` in each agent directory and fill in your credentials:
```bash
cp agents/orchestrator/.env.example agents/orchestrator/.env
cp agents/verifier/.env.example agents/verifier/.env
cp agents/history/.env.example agents/history/.env
cp agents/synthesizer/.env.example agents/synthesizer/.env
cp .env.example .env
```

Required credentials per agent — see each `.env.example` for details.

### Deploy Contracts (Base mainnet)
```bash
pnpm --filter contracts run deploy
```

### Run All Agents
```bash
docker-compose up
```

### Run the Demo Bot
```bash
python demo-bot/bot.py
```

---

## How the Verdict Looks

```json
{
  "verdict": "CAUTION",
  "confidence": "high",
  "contract": "0xAbc...",
  "chain": "base",
  "onchainChecks": {
    "sourceVerified": true,
    "isProxy": true,
    "proxyAdmin": "0xOwner...",
    "dangerousFunctions": ["pause()", "setFee(uint256)"],
    "lpLocked": false,
    "honeypotResult": "PASS",
    "honeypotSimulationTx": "tenderly-sim-id"
  },
  "history": {
    "exploits": [],
    "audit": { "auditor": "Sherlock", "date": "2025-11", "criticalFindings": 0 },
    "githubActivity": "active",
    "socialFlags": ["anonymous team"]
  },
  "rationale": "[AI-generated] Contract is audited and source-verified, but the proxy admin retains pause and fee-change privileges and the LP is unlocked. Elevated risk.",
  "payments": {
    "orchestratorToVerifier": "0xTx1...",
    "orchestratorToHistory": "0xTx2...",
    "orchestratorToSynthesizer": "0xTx3..."
  }
}
```

---

## Agent Store Listings

All 4 agents are live on [CROO Agent Store](https://agent.croo.network):

- Nexus Orchestrator
- Nexus On-Chain Verifier
- Nexus History Agent
- Nexus Synthesizer

---

## Hackathon

Built for the **CROO Agent Hackathon** — Track 6: Open A2A Agents.

[DoraHacks](https://dorahacks.io/hackathon/croo-hackathon) · [CROO Protocol](https://cap.croo.network)
