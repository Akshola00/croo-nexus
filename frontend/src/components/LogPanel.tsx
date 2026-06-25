'use client'

import type { LogEvent } from '@/lib/types'

const TONE: Record<LogEvent['tone'], string> = {
  default: 'text-text-muted',
  croo: 'text-croo',
  avoid: 'text-verdict-avoid',
}

export function LogPanel({ events, running }: { events: LogEvent[]; running: boolean }) {
  if (events.length === 0 && !running) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-surface p-8 text-sm text-text-muted">
        Submit a contract to watch the agent pipeline run in real time.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-muted">
        {running && <span className="h-2 w-2 rounded-full bg-indigo animate-pulse-dot" />}
        Agent Pipeline
      </div>

      <div className="space-y-2 font-mono text-[13px] leading-relaxed">
        {events.map((e) => (
          <div key={e.id} className="animate-fade-in">
            <div className="flex gap-2">
              <span className="text-text-muted/60">[{e.timestamp}]</span>
              <span className={TONE[e.tone]}>{e.message}</span>
            </div>
            {e.txHash && (
              <a
                href={`https://basescan.org/tx/${e.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="ml-6 inline-flex items-center gap-1 text-xs text-croo/70 hover:text-croo"
              >
                └─ {e.txHash.slice(0, 18)}… ↗ Basescan
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
