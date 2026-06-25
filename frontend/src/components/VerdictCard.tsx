import type { Verdict, VerdictOutput } from '@/lib/types'
import { PaymentTrail } from './PaymentTrail'

const STYLE: Record<
  Verdict,
  { ring: string; text: string; glow: string; icon: string; label: string }
> = {
  SAFE: {
    ring: 'border-verdict-safe/50',
    text: 'text-verdict-safe',
    glow: 'shadow-glow-safe',
    icon: '✓',
    label: 'SAFE',
  },
  CAUTION: {
    ring: 'border-verdict-caution/50',
    text: 'text-verdict-caution',
    glow: 'shadow-glow-caution',
    icon: '⚠',
    label: 'CAUTION',
  },
  AVOID: {
    ring: 'border-verdict-avoid/50',
    text: 'text-verdict-avoid',
    glow: 'shadow-glow-avoid',
    icon: '✕',
    label: 'AVOID',
  },
}

function Check({ label, ok }: { label: string; ok: boolean | string }) {
  const pass = ok === true
  const fail = ok === false
  return (
    <div className="flex items-center justify-between py-1 text-[13px]">
      <span className="text-text-muted">{label}</span>
      <span
        className={
          pass ? 'text-verdict-safe' : fail ? 'text-verdict-avoid' : 'text-text-mono font-mono'
        }
      >
        {pass ? '✓' : fail ? '✕' : ok}
      </span>
    </div>
  )
}

export function VerdictCard({ v }: { v: VerdictOutput }) {
  const s = STYLE[v.verdict]
  const c = v.onchainChecks

  return (
    <div className={`animate-fade-in rounded-xl border bg-surface ${s.ring} ${s.glow}`}>
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${s.text}`}>{s.icon}</span>
          <div>
            <div className={`text-2xl font-bold tracking-tight ${s.text}`}>{s.label}</div>
            <div className="text-xs text-text-muted">confidence: {v.confidence}</div>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-text-mono">
          {v.contract.slice(0, 10)}…{v.contract.slice(-4)}
          <div className="text-croo">on Base</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 p-5">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            On-Chain Checks
          </div>
          <Check label="Source verified" ok={c.sourceVerified} />
          <Check label="Not a proxy" ok={!c.isProxy} />
          <Check
            label="Owner privileges"
            ok={c.dangerousFunctions.length === 0 ? true : `${c.dangerousFunctions.length} flagged`}
          />
          <Check label="LP locked" ok={c.lpLocked} />
          <Check label="Honeypot sim" ok={c.honeypotResult === 'PASS' ? true : c.honeypotResult} />
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
            History
          </div>
          <Check
            label="Exploits"
            ok={v.history.exploits.length === 0 ? true : `${v.history.exploits.length} found`}
          />
          <Check label="Audit" ok={v.history.audit.auditor ?? 'none'} />
          <Check label="GitHub" ok={v.history.githubActivity} />
          <Check
            label="Social flags"
            ok={v.history.socialFlags.length === 0 ? true : `${v.history.socialFlags.length}`}
          />
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
          Rationale
        </div>
        <p className="text-[13px] leading-relaxed text-text-primary/80">{v.rationale}</p>
      </div>

      <div className="px-5 pb-5">
        <PaymentTrail payments={v.payments} />
      </div>
    </div>
  )
}
