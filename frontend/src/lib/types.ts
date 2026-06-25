// Local mirror of @croo-nexus/shared types. Replaced by the real import
// once the orchestrator SSE endpoint is wired (Phase 6/7 integration).

export type Verdict = 'SAFE' | 'CAUTION' | 'AVOID'
export type Confidence = 'high' | 'medium' | 'low'

export interface VerdictOutput {
  verdict: Verdict
  confidence: Confidence
  contract: string
  chain: 'base'
  onchainChecks: {
    sourceVerified: boolean
    isProxy: boolean
    proxyAdmin: string | null
    dangerousFunctions: string[]
    lpLocked: boolean
    honeypotResult: 'PASS' | 'FAIL' | 'INCONCLUSIVE'
    honeypotSimulationTx: string | null
  }
  history: {
    exploits: { date: string; description: string; amountLost: string; source: string }[]
    audit: { auditor: string | null; date: string | null; criticalFindings: number | null }
    githubActivity: 'active' | 'stale' | 'abandoned' | 'unknown'
    socialFlags: string[]
  }
  rationale: string
  payments: {
    orchestratorToVerifier: string
    orchestratorToHistory: string
    orchestratorToSynthesizer: string
  }
}

export interface LogEvent {
  id: number
  timestamp: string
  message: string
  txHash?: string
  tone: 'default' | 'croo' | 'avoid'
}
