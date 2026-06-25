'use client'

import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import type { Metrics } from '@/lib/types'

function Stat({ label, value, tone = 'purple' }: { label: string; value: string; tone?: 'purple' | 'acid' }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-[0.2em] text-text-faint">{label}</span>
      <span className={`font-mono text-sm ${tone === 'acid' ? 'text-acid text-glow-acid' : 'text-purple-bright'}`}>
        {value}
      </span>
    </div>
  )
}

export function HudBar({ online, metrics }: { online: boolean; metrics: Metrics }) {
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString('en-GB')), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="relative flex items-center justify-between border-b border-edge bg-surface/60 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Logo size={36} />
        <div className="leading-tight">
          <div className="font-display text-lg font-bold tracking-[0.18em]">
            CROO<span className="text-acid text-glow-acid"> NEXUS</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-faint">
            Agent Operations Layer
          </div>
        </div>
      </div>

      <div className="hidden items-center gap-7 md:flex">
        <Stat label="Progress" value={`${metrics.progress}%`} tone="acid" />
        <Stat label="Confidence" value={`${metrics.confidence}%`} />
        <Stat label="Risk Index" value={String(metrics.riskScore).padStart(2, '0')} tone="acid" />
        <Stat label="Tool Calls" value={String(metrics.toolCalls).padStart(2, '0')} />
        <Stat label="UTC" value={clock} />
      </div>

      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${online ? 'bg-acid shadow-glow-acid animate-pulse-node' : 'bg-text-faint'}`} />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-dim">
          {online ? 'System Online' : 'Standby'}
        </span>
      </div>
    </header>
  )
}
