import type { Metadata } from 'next'

export default function NegativeGearingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
        Negative Gearing & Strategy
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Model taxable income impact, interest costs, and strategy scenarios. This is a placeholder
        page for the calculator and strategy builder.
      </p>
    </div>
  )
}
export type NegativeGearingPageProps = object

export const metadata: Metadata = {
  title: 'EquityPath Gearing',
  description: 'Model negative & positive gearing scenarios and tax impacts.',
}
