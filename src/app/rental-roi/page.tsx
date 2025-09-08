import type { Metadata } from 'next'

export default function RentalRoiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
        Rental ROI Calculator
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Estimate rental yield, expenses and cash-on-cash returns. This is a placeholder page for the
        calculator and strategy tools.
      </p>
    </div>
  )
}
export type RentalRoiPageProps = object

export const metadata: Metadata = {
  title: 'EquityPath Rental ROI',
  description: 'Analyze rental yield, expenses, and cash-on-cash returns.',
}
