'use client'

import { m } from 'framer-motion'
import { Card } from '@/components/ui/card'

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      suppressHydrationWarning
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="ring-1 ring-black/5">{children}</Card>
    </m.div>
  )
}

export type SectionProps = { children: React.ReactNode }
