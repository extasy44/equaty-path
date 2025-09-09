import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GearingSimulator } from '@/components/gearing/gearing-simulator'

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
        <GearingSimulator />
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Calculator inputs & outputs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm grid gap-2 text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <div className="font-medium text-foreground mb-1">Inputs</div>
                <div>- Purchase price, stamp duty, closing costs</div>
                <div>- Loan amount, interest rate (IO/P&I), term</div>
                <div>- Rent per week, vacancy weeks, agent fee %</div>
                <div>- Insurance, rates, body corp, maintenance</div>
                <div>- Depreciation per year</div>
                <div>- Marginal tax rate, current taxable income</div>
              </div>
              <div>
                <div className="font-medium text-foreground mb-1">Outputs</div>
                <div>- Gross rental income, operating expenses, NOI</div>
                <div>- Annual debt service, cashflow before tax</div>
                <div>- Taxable profit/loss, tax effect, cashflow after tax</div>
                <div>- Taxable income before/after</div>
                <div>- Gross/net yield %, cash-on-cash %</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Definitions (Victoria context)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground grid gap-2">
            <div>
              <span className="font-medium text-foreground">Negative gearing</span> occurs when
              deductible property expenses (interest, management, insurance, rates, body corp,
              maintenance, and depreciation) exceed rental income. The net loss can reduce taxable
              income at your marginal tax rate.
            </div>
            <div>
              <span className="font-medium text-foreground">Positive gearing</span> occurs when
              rental income exceeds property expenses. The net profit is added to taxable income and
              taxed at your marginal rate.
            </div>
            <div>
              In suburbs like{' '}
              <span className="font-medium text-foreground">Camberwell, Victoria</span>, purchase
              prices are typically higher and gross yields lower than regional areas. Many investors
              may be negatively geared initially, improving toward neutral or positive as rents rise
              and loans are refinanced.
            </div>
          </CardContent>
        </Card>

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
            <div>
              - Depreciation: non-cash deduction (quantity surveyor schedule) that improves
              after-tax cashflow.
            </div>
            <div>
              - Common deductible expenses: loan interest, agent fees, insurance, council rates,
              body corporate, repairs and maintenance, and depreciation.
            </div>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Cash flow dynamics</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground grid gap-2">
            <div>
              - Interest rate ↑ → higher interest expense → cashflow before tax ↓; may turn positive
              to negative.
            </div>
            <div>
              - Rent ↑ (market reviews, reduced vacancy) → income ↑ → cashflow improves; may turn
              negative to neutral/positive.
            </div>
            <div>
              - Expenses ↑ (insurance, strata, maintenance) → NOI ↓ → cashflow ↓; monitor and
              negotiate where possible.
            </div>
            <div>
              - Depreciation doesn’t affect cash in the bank but reduces taxable profit, improving
              after-tax cashflow.
            </div>
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
