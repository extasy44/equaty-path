'use client'

import { Card } from '@/components/ui/card'

export function Section({ children }: { children: React.ReactNode }) {
  return <Card className="ring-1 ring-black/5">{children}</Card>
}

export type SectionProps = { children: React.ReactNode }
