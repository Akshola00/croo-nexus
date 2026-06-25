import type { VerdictOutput } from '@/lib/types'

const ROWS = [
  { label: 'Verifier', key: 'orchestratorToVerifier', amount: '$0.30' },
  { label: 'History', key: 'orchestratorToHistory', amount: '$0.30' },
  { label: 'Synthesizer', key: 'orchestratorToSynthesizer', amount: '$0.20' },
] as const

export function PaymentTrail({ payments }: { payments: VerdictOutput['payments'] }) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised/40 p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
        Payment Trail · A2A on Base
      </div>
      <div className="space-y-2">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between text-[13px]">
            <span className="text-text-muted">{row.label}</span>
            <div className="flex items-center gap-3 font-mono">
              <a
                href={`https://basescan.org/tx/${payments[row.key]}`}
                target="_blank"
                rel="noreferrer"
                className="text-croo/80 hover:text-croo"
              >
                {payments[row.key].slice(0, 12)}… ↗
              </a>
              <span className="w-12 text-right text-text-mono">{row.amount}</span>
            </div>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[13px] font-semibold">
          <span className="text-text-primary">Total settled</span>
          <span className="font-mono text-croo">$0.80</span>
        </div>
      </div>
    </div>
  )
}
