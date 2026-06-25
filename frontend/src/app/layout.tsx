import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CROO Nexus — Contract Risk Verdicts',
  description:
    'Trustless settlement layer for agents that hire agents. Pre-signature smart-contract risk checks on Base.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-text-primary font-sans">{children}</body>
    </html>
  )
}
