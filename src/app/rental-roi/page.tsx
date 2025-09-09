import type { Metadata } from 'next'
import { RentalClient } from './client'

export default function RentalRoiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
        Rental ROI Calculator
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Estimate rental yield, expenses, tax impact and cash‑on‑cash returns. Review the snapshot
        and invest ideas after calculating.
      </p>
      <RentalClient />
    </div>
  )
}
export type RentalRoiPageProps = object

export const metadata: Metadata = {
  title: 'EquityPath Rental ROI',
  description: 'Analyze rental yield, expenses, tax impact, and cash-on-cash returns.',
}
