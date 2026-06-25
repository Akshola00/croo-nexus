import { z } from 'zod'

export const VerifierRequestSchema = z.object({
  contract: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid 0x address'),
  chain: z.literal('base'),
})

export const VerifierOutputSchema = z.object({
  sourceVerified: z.boolean(),
  sourceVerifiedProof: z.string(),
  isProxy: z.boolean(),
  proxyAdmin: z.string().nullable(),
  dangerousFunctions: z.array(z.string()),
  lpLocked: z.boolean(),
  lpLockExpiry: z.string().nullable(),
  honeypotResult: z.enum(['PASS', 'FAIL', 'INCONCLUSIVE']),
  honeypotSimulationTx: z.string().nullable(),
})

export const HistoryRequestSchema = z.object({
  contract: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid 0x address'),
  protocolName: z.string(),
})

export const HistoryOutputSchema = z.object({
  exploits: z.array(z.object({
    date: z.string(),
    description: z.string(),
    amountLost: z.string(),
    source: z.string(),
  })),
  audit: z.object({
    auditor: z.string().nullable(),
    date: z.string().nullable(),
    criticalFindings: z.number().nullable(),
    source: z.string().nullable(),
  }),
  githubActivity: z.enum(['active', 'stale', 'abandoned', 'unknown']),
  githubRepo: z.string().nullable(),
  socialFlags: z.array(z.string()),
  rugProbability: z.enum(['low', 'medium', 'high']),
})

export const SynthesizerRequestSchema = z.object({
  contract: z.string(),
  verifier: z.string(),
  history: z.string(),
})

export const VerdictOutputSchema = z.object({
  verdict: z.enum(['SAFE', 'CAUTION', 'AVOID']),
  confidence: z.enum(['high', 'medium', 'low']),
  contract: z.string(),
  chain: z.literal('base'),
  onchainChecks: VerifierOutputSchema,
  history: HistoryOutputSchema,
  rationale: z.string(),
  payments: z.object({
    orchestratorToVerifier: z.string(),
    orchestratorToHistory: z.string(),
    orchestratorToSynthesizer: z.string(),
  }),
})

export const OrchestratorRequestSchema = z.object({
  contract: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid 0x address'),
  chain: z.literal('base').default('base'),
})
