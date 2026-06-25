'use client'

import type { Handoff } from '@/lib/types'

const NAME: Record<string, string> = {
  orchestrator: 'NEXUS-0',
  verifier: 'VERIDIAN',
  history: 'ARCHIVE',
  synthesizer: 'ORACLE',
  caller: 'CALLER',
}

const STATE_META = {
  done: { node: 'border-acid bg-acid/20 text-acid', line: 'stroke-acid', label: 'text-acid' },
  active: { node: 'border-purple bg-purple/20 text-purple-bright animate-pulse-node', line: 'stroke-purple', label: 'text-purple-bright' },
  slashed: { node: 'border-risk-avoid bg-risk-avoid/20 text-risk-avoid', line: 'stroke-risk-avoid', label: 'text-risk-avoid' },
} as const

export function EventChain({ handoffs }: { handoffs: Handoff[] }) {
  return (
    <div className="corner-bracket relative rounded-lg border border-edge bg-surface/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          Delegation Chain
        </span>
        <span className="font-mono text-[10px] text-text-faint">{handoffs.length} handoffs</span>
      </div>

      {handoffs.length === 0 ? (
        <div className="py-2 font-mono text-[11px] text-text-faint/60">
          ── no agent-to-agent handoffs recorded ──
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-y-3">
          {handoffs.map((h, i) => {
            const m = STATE_META[h.state]
            return (
              <div key={h.id} className="flex animate-stream-in items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 items-center rounded border px-2.5 font-mono text-[10px] font-semibold ${m.node}`}>
                    {NAME[h.from]} → {NAME[h.to]}
                  </div>
                  <span className={`mt-1 font-mono text-[8px] tracking-wider ${m.label}`}>{h.label}</span>
                </div>
                {i < handoffs.length - 1 && (
                  <svg width="34" height="2" className="mx-1 shrink-0">
                    <line
                      x1="0"
                      y1="1"
                      x2="34"
                      y2="1"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className={`${m.line} animate-flow`}
                    />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
