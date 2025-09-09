import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NegativeGearingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
        Negative Gearing & Strategy
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl">
        Understand the tax impact of negative/positive gearing, how rate changes and rent affect
        cashflow, and practical options to improve outcomes.
      </p>

      <div className="grid gap-6 mt-6">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>How gearing affects tax</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground grid gap-2">
            <div>
              - Negative gearing: deductible net loss reduces taxable income at your marginal tax
              rate.
            </div>
            <div>
              - Positive gearing: net profit increases taxable income; consider buffers for rate and
              expense changes.
            </div>
            <div>- Depreciation: non-cash deduction that improves after-tax cashflow.</div>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Key levers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm grid gap-2">
            <div className="flex justify-between">
              <span>Rent</span>
              <span>Vacancy, lease term, reviews</span>
            </div>
            <div className="flex justify-between">
              <span>Interest</span>
              <span>Rate, IO vs P&I, offsets</span>
            </div>
            <div className="flex justify-between">
              <span>Capex</span>
              <span>Timing and ROI of upgrades</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Depreciation, structure, timing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Strategy ideas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm grid gap-2">
            <Idea
              label="Tighten vacancy"
              tip="Renew early, market broadly, flexible inspections."
            />
            <Idea
              label="Negotiate lending"
              tip="Review rate, IO terms, maintain buffers/offsets."
            />
            <Idea
              label="Optimize structure"
              tip="Seek advice on ownership split and trust/company use."
            />
            <Idea
              label="Maximize deductions"
              tip="Order tax depreciation schedule; track expenses."
            />
            <Idea label="Target ROI upgrades" tip="Low-cost improvements to lift rent and yield." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export type NegativeGearingPageProps = object

export const metadata: Metadata = {
  title: 'EquityPath Gearing',
  description: 'Model negative & positive gearing scenarios and tax impacts.',
}

function Idea({ label, tip }: { label: string; tip: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{tip}</div>
    </div>
  )
}
