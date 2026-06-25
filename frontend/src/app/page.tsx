'use client'

import { useRef, useState } from 'react'
import { Logo } from '@/components/Logo'
import { ContractInput } from '@/components/ContractInput'
import { LogPanel } from '@/components/LogPanel'
import { VerdictCard } from '@/components/VerdictCard'
import { MOCK_VERDICTS, runMockPipeline } from '@/lib/mock'
import type { LogEvent, Verdict, VerdictOutput } from '@/lib/types'

export default function Home() {
  const [events, setEvents] = useState<LogEvent[]>([])
  const [running, setRunning] = useState(false)
  const [verdict, setVerdict] = useState<VerdictOutput | null>(null)
  const [preview, setPreview] = useState<Verdict>('CAUTION')
  const cancelRef = useRef<(() => void) | null>(null)

  function handleSubmit() {
    cancelRef.current?.()
    setEvents([])
    setVerdict(null)
    setRunning(true)

    cancelRef.current = runMockPipeline(
      (e) => setEvents((prev) => [...prev, e]),
      () => {
        setRunning(false)
        setVerdict(MOCK_VERDICTS[preview])
      }
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <div className="text-lg font-light tracking-[0.15em]">
              CROO <span className="font-semibold text-indigo">NEXUS</span>
            </div>
            <div className="text-xs text-text-muted">Pre-signature contract risk verdicts</div>
          </div>
        </div>

        {/* Dev-only verdict preview switch — remove when SSE is wired */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {(['SAFE', 'CAUTION', 'AVOID'] as Verdict[]).map((v) => (
            <button
              key={v}
              onClick={() => {
                setPreview(v)
                setVerdict((cur) => (cur ? MOCK_VERDICTS[v] : cur))
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                preview === v
                  ? 'bg-surface-raised text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
        <section className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <ContractInput onSubmit={handleSubmit} running={running} />
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 text-sm text-text-muted">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-text-primary">
              How it works
            </div>
            <ul className="space-y-2 leading-relaxed">
              <li>· The Orchestrator hires 3 independent agents on CROO.</li>
              <li>· Each is paid in USDC, escrowed on Base.</li>
              <li>· Provably-wrong output gets the agent's stake slashed.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <LogPanel events={events} running={running} />
          {verdict && <VerdictCard v={verdict} />}
        </section>
      </div>
    </main>
  )
}
