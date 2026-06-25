import type { VerifierOutput, HistoryOutput } from './types.js'

export type Verdict = 'SAFE' | 'CAUTION' | 'AVOID'
export type Confidence = 'high' | 'medium' | 'low'

export interface ScoredVerdict {
  verdict: Verdict
  confidence: Confidence
}

export function scoreVerdict(
  verifier: VerifierOutput,
  history: HistoryOutput
): ScoredVerdict {
  // AVOID: any one of these is sufficient
  const isAvoid =
    history.exploits.length > 0 ||
    verifier.honeypotResult === 'FAIL' ||
    history.rugProbability === 'high'

  if (isAvoid) {
    return { verdict: 'AVOID', confidence: deriveConfidence(verifier, history) }
  }

  // CAUTION: two or more triggers
  const cautionSignals = [
    !verifier.sourceVerified,
    verifier.isProxy && verifier.dangerousFunctions.length > 0,
    !verifier.lpLocked,
    history.audit.auditor === null,
    history.githubActivity === 'abandoned',
    history.socialFlags.length > 1,
  ].filter(Boolean).length

  if (cautionSignals >= 2) {
    return { verdict: 'CAUTION', confidence: deriveConfidence(verifier, history) }
  }

  return { verdict: 'SAFE', confidence: deriveConfidence(verifier, history) }
}

function deriveConfidence(
  verifier: VerifierOutput,
  history: HistoryOutput
): Confidence {
  const verifierDataPoints = [
    verifier.sourceVerifiedProof !== '',
    verifier.honeypotResult !== 'INCONCLUSIVE',
    verifier.lpLockExpiry !== null || !verifier.lpLocked,
    verifier.dangerousFunctions !== null,
    verifier.proxyAdmin !== undefined,
  ].filter(Boolean).length

  const historyDataPoints = [
    history.exploits !== null,
    history.audit.auditor !== null,
    history.githubActivity !== 'unknown',
    history.socialFlags !== null,
  ].filter(Boolean).length

  if (verifierDataPoints >= 4 && historyDataPoints >= 2) return 'high'
  if (verifierDataPoints >= 3 || historyDataPoints >= 1) return 'medium'
  return 'low'
}
