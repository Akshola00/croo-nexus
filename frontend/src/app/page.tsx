'use client'

import { useRef, useState } from 'react'
import { HudBar } from '@/components/HudBar'
import { AgentRoster } from '@/components/AgentRoster'
import { MissionStream } from '@/components/MissionStream'
import { ThreatPanel } from '@/components/ThreatPanel'
import { EventChain } from '@/components/EventChain'
import { INITIAL_AGENTS, INITIAL_METRICS, runMission } from '@/lib/mock'
import type { AgentId, AgentState, Handoff, Metrics, StreamMessage, Verdict, VerdictOutput } from '@/lib/types'

export default function Home() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS)
  const [messages, setMessages] = useState<StreamMessage[]>([])
  const [handoffs, setHandoffs] = useState<Handoff[]>([])
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS)
  const [verdict, setVerdict] = useState<VerdictOutput | null>(null)
  const [running, setRunning] = useState(false)
  const [preview, setPreview] = useState<Verdict>('CAUTION')

  const idRef = useRef(0)
  const cancelRef = useRef<(() => void) | null>(null)

  function launch() {
    cancelRef.current?.()
    idRef.current = 0
    setAgents(INITIAL_AGENTS.map((a) => ({ ...a })))
    setMessages([])
    setHandoffs([])
    setMetrics(INITIAL_METRICS)
    setVerdict(null)
    setRunning(true)

    cancelRef.current = runMission(preview, {
      onStream: (m) =>
        setMessages((prev) => [
          ...prev,
          { ...m, id: idRef.current++, timestamp: new Date().toLocaleTimeString('en-GB') },
        ]),
      onAgent: (id: AgentId, patch) =>
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))),
      onHandoff: (hh) => setHandoffs((prev) => [...prev, { ...hh, id: idRef.current++ }]),
      onMetrics: (patch) => setMetrics((prev) => ({ ...prev, ...patch })),
      onDone: (v) => {
        setVerdict(v)
        setRunning(false)
      },
    })
  }

  return (
    <>
      <div className="env-gradient" />
      <div className="env-grain" />
      <div className="env-scanlines" />
      <div className="env-vignette" />

      <div className="flex min-h-screen flex-col">
        <HudBar online metrics={metrics} />

        <main className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[260px_1fr_300px]">
          <AgentRoster agents={agents} />

          <div className="flex min-h-[560px] flex-col gap-3">
            <div className="flex-1">
              <MissionStream
                messages={messages}
                running={running}
                onLaunch={launch}
                preview={preview}
                onPreview={(v) => {
                  setPreview(v)
                  setVerdict((cur) => (cur ? null : cur))
                }}
              />
            </div>

            {verdict && (
              <div
                className={`corner-bracket relative animate-stream-in rounded-lg border bg-surface/50 p-4 ${
                  verdict.verdict === 'SAFE'
                    ? 'border-risk-safe/40'
                    : verdict.verdict === 'CAUTION'
                      ? 'border-risk-caution/40'
                      : 'border-risk-avoid/40'
                }`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
                    Mission Summary
                  </span>
                  <span className="h-px flex-1 bg-edge" />
                  <span className="font-mono text-[10px] text-acid">$0.80 settled · {metrics.toolCalls} tool calls</span>
                </div>
                <p className="font-sans text-[13.5px] leading-relaxed text-text-primary">{verdict.summary}</p>
              </div>
            )}
          </div>

          <ThreatPanel verdict={verdict} riskScore={metrics.riskScore} />
        </main>

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-4">
          <EventChain handoffs={handoffs} />
        </div>
      </div>
    </>
  )
}
