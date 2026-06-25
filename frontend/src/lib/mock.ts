import type { LogEvent, Verdict, VerdictOutput } from './types'

const DEMO_CONTRACT = '0x4200000000000000000000000000000000000006'

function tx() {
  const hex = '0123456789abcdef'
  return '0x' + Array.from({ length: 64 }, () => hex[Math.floor(Math.random() * 16)]).join('')
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
      '[AI-generated] Source code is verified, the contract is not upgradeable, liquidity is locked, and no historical exploits exist. Audited by OpenZeppelin with zero critical findings. Low risk.',
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
      '[AI-generated] The contract is audited and source-verified, but it is an upgradeable proxy whose admin retains pause and fee-change privileges, and the LP is not locked. Combined with an anonymous team, this is elevated risk — not a clear avoid.',
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
        {
          date: '2026-02',
          description: 'Reentrancy drain via unguarded withdraw',
          amountLost: '$1.2M',
          source: 'rekt.news',
        },
      ],
      audit: { auditor: null, date: null, criticalFindings: null },
      githubActivity: 'abandoned',
      socialFlags: ['anonymous team', 'deleted social accounts'],
    },
    rationale:
      '[AI-generated] Source code is unverified, the honeypot simulation failed (sell reverts), and a $1.2M reentrancy exploit is on record. No audit, abandoned repo, deleted socials. Do not interact.',
    payments: {
      orchestratorToVerifier: tx(),
      orchestratorToHistory: tx(),
      orchestratorToSynthesizer: tx(),
    },
  },
}

interface Step {
  delay: number
  message: string
  withTx?: boolean
  tone?: LogEvent['tone']
}

const PIPELINE_STEPS: Step[] = [
  { delay: 300, message: 'Orchestrator received request' },
  { delay: 500, message: 'Reading Agent Registry on Base...' },
  { delay: 700, message: 'Hiring Verifier agent — escrow locked', withTx: true, tone: 'croo' },
  { delay: 200, message: 'Hiring History agent — escrow locked', withTx: true, tone: 'croo' },
  { delay: 1600, message: 'Verifier delivered — on-chain checks complete' },
  { delay: 800, message: 'History delivered — signals gathered' },
  { delay: 400, message: 'Hiring Synthesizer agent — escrow locked', withTx: true, tone: 'croo' },
  { delay: 1400, message: 'Synthesizer delivered — verdict generated' },
  { delay: 300, message: 'Pipeline complete · total cost $0.80 USDC', tone: 'croo' },
]

export function runMockPipeline(
  onEvent: (e: LogEvent) => void,
  onDone: () => void
): () => void {
  let cancelled = false
  let id = 0
  let acc = 0

  const timers: ReturnType<typeof setTimeout>[] = []

  PIPELINE_STEPS.forEach((step) => {
    acc += step.delay
    const t = setTimeout(() => {
      if (cancelled) return
      onEvent({
        id: id++,
        timestamp: new Date().toLocaleTimeString('en-GB'),
        message: step.message,
        txHash: step.withTx ? tx() : undefined,
        tone: step.tone ?? 'default',
      })
    }, acc)
    timers.push(t)
  })

  const doneTimer = setTimeout(() => {
    if (!cancelled) onDone()
  }, acc + 400)
  timers.push(doneTimer)

  return () => {
    cancelled = true
    timers.forEach(clearTimeout)
  }
}
