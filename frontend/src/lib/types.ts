// Local mirror of @croo-nexus/shared types + mission-control view state.
// The mock engine drives these; replaced by the real SSE stream in integration.

export type Verdict = 'SAFE' | 'CAUTION' | 'AVOID'
export type Confidence = 'high' | 'medium' | 'low'

export type AgentId = 'orchestrator' | 'verifier' | 'history' | 'synthesizer'
export type AgentStatus = 'idle' | 'active' | 'transmitting' | 'delivered' | 'slashed'

export interface AgentState {
  id: AgentId
  codename: string
  role: string
  status: AgentStatus
  latencyMs: number | null
  stakeUsdc: number
}

export type StreamKind = 'system' | 'comms' | 'payment' | 'alert' | 'verdict'

export interface StreamMessage {
  id: number
  timestamp: string
  kind: StreamKind
  from: AgentId | 'caller' | 'system'
  to: AgentId | 'caller' | 'system' | null
  text: string
  txHash?: string
}

export interface Handoff {
  id: number
  from: AgentId
  to: AgentId | 'caller'
  label: string
  state: 'done' | 'active' | 'slashed'
}

export interface Metrics {
  progress: number
  confidence: number
  riskScore: number
  latencyMs: number
  toolCalls: number
}

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
