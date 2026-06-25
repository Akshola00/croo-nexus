'use client'

import { useState } from 'react'

export function ContractInput({
  onSubmit,
  running,
}: {
  onSubmit: (contract: string) => void
  running: boolean
}) {
  const [value, setValue] = useState('0x4200000000000000000000000000000000000006')

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-croo/10 px-2 py-0.5 text-xs font-medium text-croo border border-croo/30">
          Base
        </span>
        <span className="text-xs text-text-muted">~$1.00 USDC per check</span>
      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="0x contract address"
        spellCheck={false}
        className="w-full rounded-lg border border-border bg-surface-raised px-4 py-3 font-mono text-sm text-text-mono outline-none transition-colors focus:border-indigo placeholder:text-text-muted/50"
      />

      <button
        onClick={() => onSubmit(value)}
        disabled={running}
        className="w-full rounded-lg bg-indigo px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-hover hover:shadow-glow-indigo disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? 'Running risk check…' : 'Check Contract'}
      </button>
    </div>
  )
}
