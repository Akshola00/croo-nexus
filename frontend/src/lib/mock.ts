import type {
  AgentId,
  AgentState,
  Handoff,
  Metrics,
  StreamMessage,
  Verdict,
  VerdictOutput,
} from './types'

const DEMO_CONTRACT = '0x4200000000000000000000000000000000000006'

function tx() {
  const hex = '0123456789abcdef'
  return '0x' + Array.from({ length: 64 }, () => hex[Math.floor(Math.random() * 16)]).join('')
}

export const INITIAL_AGENTS: AgentState[] = [
  { id: 'orchestrator', codename: 'NEXUS-0', role: 'Orchestrator', status: 'idle', latencyMs: null, stakeUsdc: 5, reputation: 99, completedJobs: 318, contribution: null },
  { id: 'verifier', codename: 'VERIDIAN', role: 'On-Chain Verifier', status: 'idle', latencyMs: null, stakeUsdc: 1, reputation: 98, completedJobs: 142, contribution: null },
  { id: 'history', codename: 'ARCHIVE', role: 'History & Signals', status: 'idle', latencyMs: null, stakeUsdc: 1, reputation: 95, completedJobs: 96, contribution: null },
  { id: 'synthesizer', codename: 'ORACLE', role: 'Verdict Synthesizer', status: 'idle', latencyMs: null, stakeUsdc: 1, reputation: 97, completedJobs: 121, contribution: null },
]

export const INITIAL_METRICS: Metrics = {
  progress: 0,
  confidence: 0,
  riskScore: 0,
  latencyMs: 0,
  toolCalls: 0,
}

export const MOCK_VERDICTS: Record<Verdict, VerdictOutput> = {
  SAFE: {
    verdict: 'SAFE',
    confidence: 'high',
    contract: DEMO_CONTRACT,
    chain: 'base',
    onchainChecks: {
      sourceVerified: true,
      isProxy: false,
      proxyAdmin: null,
      dangerousFunctions: [],
      lpLocked: true,
      honeypotResult: 'PASS',
      honeypotSimulationTx: 'tenderly-sim-9f2a',
    },
    history: {
      exploits: [],
      audit: { auditor: 'OpenZeppelin', date: '2025-09', criticalFindings: 0 },
      githubActivity: 'active',
      socialFlags: [],
    },
    rationale:
      '[AI-GENERATED] Source verified, non-upgradeable, liquidity locked, zero exploit history. Audited by OpenZeppelin with no critical findings. Cleared for interaction.',
    summary:
      'All four agents agree — verified, locked, audited, clean. NEXUS-0 settled $0.80 across the network and returned SAFE.',
    payments: {
      orchestratorToVerifier: tx(),
      orchestratorToHistory: tx(),
      orchestratorToSynthesizer: tx(),
    },
  },
  CAUTION: {
    verdict: 'CAUTION',
    confidence: 'high',
    contract: DEMO_CONTRACT,
    chain: 'base',
    onchainChecks: {
      sourceVerified: true,
      isProxy: true,
      proxyAdmin: '0x9a8F...c41D',
      dangerousFunctions: ['pause()', 'setFee(uint256)'],
      lpLocked: false,
      honeypotResult: 'PASS',
      honeypotSimulationTx: 'tenderly-sim-3b7e',
    },
    history: {
      exploits: [],
      audit: { auditor: 'Sherlock', date: '2025-11', criticalFindings: 0 },
      githubActivity: 'active',
      socialFlags: ['anonymous team'],
    },
    rationale:
      '[AI-GENERATED] Audited and verified, but an upgradeable proxy whose admin retains pause + fee control, with unlocked LP and an anonymous team. Elevated risk — proceed only with caution.',
    summary:
      'VERIDIAN flagged owner pause/fee powers and an unlocked LP; ARCHIVE found no exploits but an anonymous team. ORACLE weighed both and returned CAUTION.',
    payments: {
      orchestratorToVerifier: tx(),
      orchestratorToHistory: tx(),
      orchestratorToSynthesizer: tx(),
    },
  },
  AVOID: {
    verdict: 'AVOID',
    confidence: 'high',
    contract: DEMO_CONTRACT,
    chain: 'base',
    onchainChecks: {
      sourceVerified: false,
      isProxy: true,
      proxyAdmin: '0x0000...dEaD',
      dangerousFunctions: ['mint()', 'pause()', 'setFee(uint256)', 'withdrawAll()'],
      lpLocked: false,
      honeypotResult: 'FAIL',
      honeypotSimulationTx: 'tenderly-sim-ee01',
    },
    history: {
      exploits: [
        { date: '2026-02', description: 'Reentrancy drain via unguarded withdraw', amountLost: '$1.2M', source: 'rekt.news' },
      ],
      audit: { auditor: null, date: null, criticalFindings: null },
      githubActivity: 'abandoned',
      socialFlags: ['anonymous team', 'deleted social accounts'],
    },
    rationale:
      '[AI-GENERATED] Unverified source, failed honeypot simulation, $1.2M reentrancy exploit on record. No audit, abandoned repo, deleted socials. Critical threat — do not interact.',
    summary:
      'VERIDIAN’s honeypot sim failed and ARCHIVE surfaced a $1.2M exploit. ORACLE returned AVOID with high confidence — do not interact.',
    payments: {
      orchestratorToVerifier: tx(),
      orchestratorToHistory: tx(),
      orchestratorToSynthesizer: tx(),
    },
  },
}

const CONTRIB: Record<AgentId, Record<Verdict, string>> = {
  orchestrator: {
    SAFE: '3 agents hired · $0.80 settled',
    CAUTION: '3 agents hired · $0.80 settled',
    AVOID: '3 agents hired · $0.80 settled',
  },
  verifier: {
    SAFE: 'source ✓ · non-proxy · sim PASS',
    CAUTION: 'source ✓ · proxy ⚠ · LP open',
    AVOID: 'source ✗ · honeypot FAIL',
  },
  history: {
    SAFE: 'audit: OpenZeppelin · 0 exploits',
    CAUTION: 'audit: Sherlock · anon team',
    AVOID: '$1.2M exploit · repo abandoned',
  },
  synthesizer: {
    SAFE: 'verdict SAFE · conf high',
    CAUTION: 'verdict CAUTION · conf high',
    AVOID: 'verdict AVOID · conf high',
  },
}

const RISK_TARGET: Record<Verdict, number> = { SAFE: 18, CAUTION: 58, AVOID: 92 }

export interface MissionHandlers {
  onStream: (m: Omit<StreamMessage, 'id' | 'timestamp'>) => void
  onAgent: (id: AgentId, patch: Partial<AgentState>) => void
  onHandoff: (h: Omit<Handoff, 'id'>) => void
  onMetrics: (patch: Partial<Metrics>) => void
  onDone: (v: VerdictOutput) => void
}

interface Frame {
  at: number
  run: (h: MissionHandlers) => void
}

export function runMission(target: Verdict, h: MissionHandlers): () => void {
  const isAvoid = target === 'AVOID'
  const risk = RISK_TARGET[target]

  const frames: Frame[] = [
    {
      at: 200,
      run: (h) => {
        h.onAgent('orchestrator', { status: 'active' })
        h.onStream({ kind: 'system', from: 'caller', to: 'orchestrator', text: 'RISK CHECK REQUESTED · target acquired' })
        h.onMetrics({ progress: 8 })
      },
    },
    {
      at: 700,
      run: (h) => {
        h.onStream({ kind: 'comms', from: 'orchestrator', to: 'system', text: 'Reading Agent Registry on Base · selecting staked specialists' })
        h.onMetrics({ progress: 16, toolCalls: 1 })
      },
    },
    {
      at: 1250,
      run: (h) => {
        h.onAgent('orchestrator', { status: 'transmitting' })
        h.onAgent('verifier', { status: 'active' })
        h.onStream({ kind: 'payment', from: 'orchestrator', to: 'verifier', text: 'Escrow locked → VERIDIAN dispatched', txHash: tx() })
        h.onHandoff({ from: 'orchestrator', to: 'verifier', label: 'ESCROW · 0.30', state: 'active' })
        h.onMetrics({ progress: 28, toolCalls: 2 })
      },
    },
    {
      at: 1650,
      run: (h) => {
        h.onAgent('history', { status: 'active' })
        h.onStream({ kind: 'payment', from: 'orchestrator', to: 'history', text: 'Escrow locked → ARCHIVE dispatched', txHash: tx() })
        h.onHandoff({ from: 'orchestrator', to: 'history', label: 'ESCROW · 0.30', state: 'active' })
        h.onMetrics({ progress: 38, latencyMs: 240 })
      },
    },
    {
      at: 2300,
      run: (h) => {
        h.onAgent('verifier', { status: 'transmitting' })
        h.onStream({ kind: 'comms', from: 'verifier', to: 'orchestrator', text: 'On-chain sweep: source · proxy · owner powers · LP · honeypot sim' })
        h.onMetrics({ progress: 50, toolCalls: 6 })
      },
    },
    {
      at: 3100,
      run: (h) => {
        h.onAgent('verifier', { status: 'delivered', latencyMs: 1840, contribution: CONTRIB.verifier[target] })
        h.onHandoff({ from: 'orchestrator', to: 'verifier', label: 'DELIVERED', state: 'done' })
        if (isAvoid) {
          h.onStream({ kind: 'alert', from: 'verifier', to: 'orchestrator', text: '⚠ ANOMALY · source unverified + honeypot sell reverts' })
          h.onMetrics({ progress: 60, riskScore: Math.round(risk * 0.7) })
        } else {
          h.onStream({ kind: 'comms', from: 'verifier', to: 'orchestrator', text: 'Verifier payload delivered · proofs attached' })
          h.onMetrics({ progress: 60, riskScore: Math.round(risk * 0.6) })
        }
      },
    },
    {
      at: 3700,
      run: (h) => {
        h.onAgent('history', { status: 'delivered', latencyMs: 2210, contribution: CONTRIB.history[target] })
        h.onHandoff({ from: 'orchestrator', to: 'history', label: 'DELIVERED', state: 'done' })
        h.onStream({
          kind: isAvoid ? 'alert' : 'comms',
          from: 'history',
          to: 'orchestrator',
          text: isAvoid ? '⚠ THREAT INTEL · $1.2M reentrancy exploit on record' : 'Signals gathered · audit + repo + social scan complete',
        })
        h.onMetrics({ progress: 72, latencyMs: 310 })
      },
    },
    {
      at: 4300,
      run: (h) => {
        h.onAgent('synthesizer', { status: 'active' })
        h.onStream({ kind: 'payment', from: 'orchestrator', to: 'synthesizer', text: 'Escrow locked → ORACLE synthesizing verdict', txHash: tx() })
        h.onHandoff({ from: 'orchestrator', to: 'synthesizer', label: 'ESCROW · 0.20', state: 'active' })
        h.onMetrics({ progress: 84, toolCalls: 8 })
      },
    },
    {
      at: 5200,
      run: (h) => {
        h.onAgent('synthesizer', { status: 'transmitting' })
        h.onStream({ kind: 'comms', from: 'synthesizer', to: 'orchestrator', text: 'Scoring evidence · assigning confidence · drafting rationale' })
        h.onMetrics({ progress: 94, riskScore: risk, confidence: 88 })
      },
    },
    {
      at: 6000,
      run: (h) => {
        h.onAgent('synthesizer', { status: 'delivered', latencyMs: 1390, contribution: CONTRIB.synthesizer[target] })
        h.onAgent('orchestrator', { status: 'delivered', contribution: CONTRIB.orchestrator[target] })
        h.onHandoff({ from: 'synthesizer', to: 'caller', label: `VERDICT · ${target}`, state: 'done' })
        h.onStream({ kind: 'verdict', from: 'orchestrator', to: 'caller', text: `VERDICT RETURNED · ${target} · settlement complete` })
        h.onMetrics({ progress: 100, latencyMs: 0 })
        h.onDone(MOCK_VERDICTS[target])
      },
    },
  ]

  let cancelled = false
  const timers = frames.map((f) =>
    setTimeout(() => {
      if (!cancelled) f.run(h)
    }, f.at)
  )

  return () => {
    cancelled = true
    timers.forEach(clearTimeout)
  }
}
