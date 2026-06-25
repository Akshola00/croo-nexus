export interface VerifierRequest {
  contract: string
  chain: 'base'
}

export interface VerifierOutput {
  sourceVerified: boolean
  sourceVerifiedProof: string
  isProxy: boolean
  proxyAdmin: string | null
  dangerousFunctions: string[]
  lpLocked: boolean
  lpLockExpiry: string | null
  honeypotResult: 'PASS' | 'FAIL' | 'INCONCLUSIVE'
  honeypotSimulationTx: string | null
}

export interface HistoryRequest {
  contract: string
  protocolName: string
}

export interface ExploitRecord {
  date: string
  description: string
  amountLost: string
  source: string
}

export interface AuditRecord {
  auditor: string | null
  date: string | null
  criticalFindings: number | null
  source: string | null
}

export interface HistoryOutput {
  exploits: ExploitRecord[]
  audit: AuditRecord
  githubActivity: 'active' | 'stale' | 'abandoned' | 'unknown'
  githubRepo: string | null
  socialFlags: string[]
  rugProbability: 'low' | 'medium' | 'high'
}

export interface SynthesizerRequest {
  contract: string
  verifier: string
  history: string
}

export interface PaymentRecord {
  orchestratorToVerifier: string
  orchestratorToHistory: string
  orchestratorToSynthesizer: string
}

export interface VerdictOutput {
  verdict: 'SAFE' | 'CAUTION' | 'AVOID'
  confidence: 'high' | 'medium' | 'low'
  contract: string
  chain: 'base'
  onchainChecks: VerifierOutput
  history: HistoryOutput
  rationale: string
  payments: PaymentRecord
}

export type SynthesizerDelivery = Omit<VerdictOutput, 'payments'>

export interface PipelineEvent {
  type: 'log' | 'done' | 'error'
  message?: string
  txHash?: string
  verdict?: VerdictOutput
}
