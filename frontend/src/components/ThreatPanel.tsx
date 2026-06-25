'use client'

import type { Verdict, VerdictOutput } from '@/lib/types'
import { RiskGauge } from './RiskGauge'

const VMETA: Record<Verdict, { text: string; glow: string; border: string; icon: string }> = {
  SAFE: { text: 'text-risk-safe', glow: 'shadow-glow-acid', border: 'border-risk-safe/50', icon: '✓' },
  CAUTION: { text: 'text-risk-caution', glow: 'shadow-glow-caution', border: 'border-risk-caution/50', icon: '⚠' },
  AVOID: { text: 'text-risk-avoid', glow: 'shadow-glow-avoid', border: 'border-risk-avoid/50', icon: '✕' },
}

function Check({ label, ok }: { label: string; ok: boolean | string }) {
  const pass = ok === true
  const fail = ok === false
  return (
    <div className="flex items-center justify-between border-b border-edge/40 py-1.5 text-[12px] last:border-0">
      <span className="text-text-dim">{label}</span>
      <span className={`font-mono ${pass ? 'text-acid' : fail ? 'text-risk-avoid' : 'text-text-primary'}`}>
        {pass ? 'PASS' : fail ? 'FAIL' : ok}
      </span>
    </div>
  )
}

export function ThreatPanel({
  verdict,
  riskScore,
}: {
  verdict: VerdictOutput | null
  riskScore: number
}) {
  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          Threat Assessment
        </span>
        {verdict && (
          <span className={`font-mono text-[10px] ${VMETA[verdict.verdict].text}`}>
            {verdict.confidence.toUpperCase()} CONF
          </span>
        )}
      </div>

      <div
        className={`corner-bracket relative rounded-lg border bg-surface/60 p-4 transition-all duration-500 ${
          verdict ? VMETA[verdict.verdict].border + ' ' + VMETA[verdict.verdict].glow : 'border-edge'
        }`}
      >
        <RiskGauge score={riskScore} verdict={verdict?.verdict ?? null} />

        {verdict ? (
          <div className="mt-2 text-center">
            <div className={`font-display text-3xl font-bold tracking-[0.1em] ${VMETA[verdict.verdict].text}`}>
              {VMETA[verdict.verdict].icon} {verdict.verdict}
            </div>
            <div className="mt-1 font-mono text-[10px] text-text-faint">
              {verdict.contract.slice(0, 12)}…{verdict.contract.slice(-6)}
            </div>
          </div>
        ) : (
          <div className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-text-faint">
            no verdict yet
          </div>
        )}
      </div>

      {verdict && (
        <>
          <div className="rounded-lg border border-edge bg-surface/60 p-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">On-Chain</div>
            <Check label="Source verified" ok={verdict.onchainChecks.sourceVerified} />
            <Check label="Non-proxy" ok={!verdict.onchainChecks.isProxy} />
            <Check
              label="Owner powers"
              ok={verdict.onchainChecks.dangerousFunctions.length === 0 ? true : `${verdict.onchainChecks.dangerousFunctions.length} FLAG`}
            />
            <Check label="LP locked" ok={verdict.onchainChecks.lpLocked} />
            <Check
              label="Honeypot sim"
              ok={verdict.onchainChecks.honeypotResult === 'PASS' ? true : verdict.onchainChecks.honeypotResult === 'FAIL' ? false : 'N/A'}
            />
          </div>

          <div className="rounded-lg border border-edge bg-surface/60 p-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">Intel</div>
            <Check label="Exploits" ok={verdict.history.exploits.length === 0 ? true : `${verdict.history.exploits.length} HIT`} />
            <Check label="Audit" ok={verdict.history.audit.auditor ?? 'NONE'} />
            <Check label="Repo" ok={verdict.history.githubActivity.toUpperCase()} />
            <Check label="Social flags" ok={verdict.history.socialFlags.length === 0 ? true : String(verdict.history.socialFlags.length)} />
          </div>

          <div className="rounded-lg border border-edge bg-surface/60 p-3">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint">Rationale</div>
            <p className="text-[11px] leading-relaxed text-text-primary/75">{verdict.rationale}</p>
          </div>
        </>
      )}
    </aside>
  )
}
