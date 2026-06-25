'use client'

import type { AgentState, AgentStatus } from '@/lib/types'

const STATUS_META: Record<AgentStatus, { label: string; dot: string; ring: string; text: string }> = {
  idle: { label: 'STANDBY', dot: 'bg-text-faint', ring: 'border-edge', text: 'text-text-faint' },
  active: { label: 'ENGAGED', dot: 'bg-purple shadow-glow-purple animate-pulse-node', ring: 'border-purple/60 shadow-glow-purple', text: 'text-purple-bright' },
  transmitting: { label: 'TRANSMIT', dot: 'bg-acid shadow-glow-acid animate-pulse-node', ring: 'border-acid/60 shadow-glow-acid', text: 'text-acid' },
  delivered: { label: 'DELIVERED', dot: 'bg-acid', ring: 'border-acid/30', text: 'text-acid/80' },
  slashed: { label: 'SLASHED', dot: 'bg-risk-avoid shadow-glow-avoid', ring: 'border-risk-avoid/60 shadow-glow-avoid', text: 'text-risk-avoid' },
}

function Contribution({ agent }: { agent: AgentState }) {
  if (agent.status === 'slashed') {
    return <span className="text-risk-avoid">✕ false report · stake slashed</span>
  }
  if (agent.contribution) {
    return <span className="font-mono text-acid">{agent.contribution}</span>
  }
  if (agent.status === 'active' || agent.status === 'transmitting') {
    return <span className="text-purple-bright">● processing…</span>
  }
  return <span className="text-text-faint">— awaiting dispatch —</span>
}

function AgentNode({ agent }: { agent: AgentState }) {
  const m = STATUS_META[agent.status]

  return (
    <div className={`corner-bracket relative rounded-md border bg-surface-2/70 p-3 transition-all duration-300 ${m.ring}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-sm font-semibold tracking-wider text-text-primary">
            {agent.codename}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-faint">{agent.role}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
          <span className={`font-mono text-[9px] tracking-[0.15em] ${m.text}`}>{m.label}</span>
        </div>
      </div>

      {/* reputation + completed jobs — sourced from AgentRegistry on Base */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-acid/80" style={{ width: `${agent.reputation}%` }} />
        </div>
        <span className="font-mono text-[10px] text-acid">{agent.reputation}</span>
        <span className="font-mono text-[10px] text-text-faint">· {agent.completedJobs} jobs</span>
      </div>

      {/* this-job contribution */}
      <div className="mt-2 flex items-center justify-between border-t border-edge/40 pt-2 text-[11px]">
        <Contribution agent={agent} />
        <span className="font-mono text-[10px] text-text-faint">
          {agent.latencyMs ? `${agent.latencyMs}ms` : ''}
        </span>
      </div>
    </div>
  )
}

export function AgentRoster({ agents }: { agents: AgentState[] }) {
  const live = agents.filter((a) => a.status !== 'idle').length

  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          Agent Roster
        </span>
        <span className="font-mono text-[10px] text-acid">{live}/{agents.length} live</span>
      </div>
      {agents.map((a) => (
        <AgentNode key={a.id} agent={a} />
      ))}
    </aside>
  )
}
