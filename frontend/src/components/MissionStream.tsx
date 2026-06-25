'use client'

import { useEffect, useRef, useState } from 'react'
import type { AgentId, StreamKind, StreamMessage } from '@/lib/types'

const KIND_META: Record<StreamKind, { tag: string; color: string; bar: string }> = {
  system: { tag: 'SYS', color: 'text-text-dim', bar: 'bg-text-faint' },
  comms: { tag: 'A2A', color: 'text-purple-bright', bar: 'bg-purple' },
  payment: { tag: 'PAY', color: 'text-acid', bar: 'bg-acid' },
  alert: { tag: 'ALERT', color: 'text-risk-avoid', bar: 'bg-risk-avoid' },
  verdict: { tag: 'VERDICT', color: 'text-acid text-glow-acid', bar: 'bg-acid' },
}

const NAME: Record<string, string> = {
  orchestrator: 'NEXUS-0',
  verifier: 'VERIDIAN',
  history: 'ARCHIVE',
  synthesizer: 'ORACLE',
  caller: 'CALLER',
  system: 'SYSTEM',
}

function Row({ m }: { m: StreamMessage }) {
  const k = KIND_META[m.kind]
  return (
    <div className={`flex animate-stream-in gap-3 ${m.kind === 'alert' ? 'animate-glitch' : ''}`}>
      <span className="mt-[3px] w-12 shrink-0 font-mono text-[10px] text-text-faint">{m.timestamp}</span>
      <span className={`mt-[2px] h-3 w-[2px] shrink-0 rounded ${k.bar}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[9px] font-bold tracking-wider ${k.color}`}>{k.tag}</span>
          {m.to && (
            <span className="font-mono text-[10px] text-text-faint">
              {NAME[m.from] ?? m.from} <span className="text-purple">→</span> {NAME[m.to] ?? m.to}
            </span>
          )}
        </div>
        <div className="text-[13px] leading-snug text-text-primary/90">{m.text}</div>
        {m.txHash && (
          <a
            href={`https://basescan.org/tx/${m.txHash}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-acid/70 hover:text-acid"
          >
            ⛓ {m.txHash.slice(0, 22)}… ↗ basescan
          </a>
        )}
      </div>
    </div>
  )
}

export function MissionStream({
  messages,
  running,
  onLaunch,
  preview,
  onPreview,
}: {
  messages: StreamMessage[]
  running: boolean
  onLaunch: (contract: string) => void
  preview: 'SAFE' | 'CAUTION' | 'AVOID'
  onPreview: (v: 'SAFE' | 'CAUTION' | 'AVOID') => void
}) {
  const [value, setValue] = useState('0x4200000000000000000000000000000000000006')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <section className="corner-bracket relative flex h-full flex-col rounded-lg border border-edge bg-surface/50 shadow-panel">
      {/* command bar */}
      <div className="border-b border-edge p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
            Command Channel
          </span>
          <div className="flex items-center gap-1 rounded border border-edge bg-surface-2 p-0.5">
            {(['SAFE', 'CAUTION', 'AVOID'] as const).map((v) => (
              <button
                key={v}
                onClick={() => onPreview(v)}
                className={`rounded px-2 py-0.5 font-mono text-[10px] tracking-wider transition-colors ${
                  preview === v ? 'bg-purple/20 text-purple-bright' : 'text-text-faint hover:text-text-dim'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded border border-edge bg-bg-deep px-3">
            <span className="font-mono text-acid">▸</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              placeholder="0x target contract"
              className="w-full bg-transparent py-2.5 font-mono text-[13px] text-text-primary outline-none placeholder:text-text-faint"
            />
            <span className="rounded border border-acid/30 px-1.5 py-0.5 font-mono text-[9px] text-acid">BASE</span>
          </div>
          <button
            onClick={() => onLaunch(value)}
            disabled={running}
            className="rounded border border-purple/60 bg-purple/15 px-5 font-display text-xs font-semibold uppercase tracking-[0.15em] text-purple-bright transition-all hover:bg-purple/30 hover:shadow-glow-purple disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? 'Running' : 'Execute'}
          </button>
        </div>
      </div>

      {/* live stream */}
      <div className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px animate-scan-sweep bg-gradient-to-r from-transparent via-acid/50 to-transparent" />
        <div className="hud-grid absolute inset-0 opacity-30" />
        <div className="relative h-full space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-faint animate-flicker">
                ▦ awaiting mission directive ▦
              </span>
              <span className="max-w-xs text-[11px] text-text-faint/60">
                Submit a contract to dispatch the agent network. Each specialist is hired and paid on-chain in real time.
              </span>
            </div>
          ) : (
            messages.map((m) => <Row key={m.id} m={m} />)
          )}
          <div ref={endRef} />
        </div>
      </div>
    </section>
  )
}
