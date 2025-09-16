'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GearingSimulator } from '@/components/gearing/gearing-simulator'
import { CalculatorLoader } from '@/components/ui/feature-loader'
import { Suspense } from 'react'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'

function NegativeGearingContent() {
  const meta = pageMetadata.gearing

  return (
    <>
      <Head>
        <title>{meta.title} | EquityPath</title>
        <meta name="description" content={meta.description} />
        {meta.keywords && <meta name="keywords" content={meta.keywords.join(', ')} />}
        <meta property="og:title" content={meta.openGraph?.title || meta.title} />
        <meta property="og:description" content={meta.openGraph?.description || meta.description} />
        {meta.openGraph?.images && (
          <meta property="og:image" content={meta.openGraph.images[0].url} />
        )}
        <meta name="twitter:title" content={meta.openGraph?.title || meta.title} />
        <meta
          name="twitter:description"
          content={meta.openGraph?.description || meta.description}
        />
        {meta.openGraph?.images && (
          <meta name="twitter:image" content={meta.openGraph.images[0].url} />
        )}
      </Head>
      <CalculatorLoader>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
              Negative Gearing & Strategy
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto sm:mx-0">
              Understand the tax impact of negative/positive gearing, how rate changes and rent
              affect cashflow, and practical options to improve outcomes.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6">
            <GearingSimulator />
            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Calculator inputs & outputs</CardTitle>
              </CardHeader>
              <CardContent className="text-sm grid gap-3 text-muted-foreground">
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">Inputs</div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div>- Purchase price, stamp duty, closing costs</div>
                      <div>- Loan amount, interest rate (IO/P&I), term</div>
                      <div>- Rent per week, vacancy weeks, agent fee %</div>
                      <div>- Insurance, rates, body corp, maintenance</div>
                      <div>- Depreciation per year</div>
                      <div>- Marginal tax rate, current taxable income</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">Outputs</div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div>- Gross rental income, operating expenses, NOI</div>
                      <div>- Annual debt service, cashflow before tax</div>
                      <div>- Taxable profit/loss, tax effect, cashflow after tax</div>
                      <div>- Taxable income before/after</div>
                      <div>- Gross/net yield %, cash-on-cash %</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Definitions (Victoria context)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-foreground">Negative gearing</span> occurs
                    when deductible property expenses (interest, management, insurance, rates, body
                    corp, maintenance, and depreciation) exceed rental income. The net loss can
                    reduce taxable income at your marginal tax rate.
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Positive gearing</span> occurs
                    when rental income exceeds property expenses. The net profit is added to taxable
                    income and taxed at your marginal rate.
                  </div>
                  <div>
                    In suburbs like{' '}
                    <span className="font-medium text-foreground">Camberwell, Victoria</span>,
                    purchase prices are typically higher and gross yields lower than regional areas.
                    Many investors may be negatively geared initially, improving toward neutral or
                    positive as rents rise and loans are refinanced.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>How gearing affects tax</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    - Negative gearing: deductible net loss reduces taxable income at your marginal
                    tax rate.
                  </div>
                  <div>
                    - Positive gearing: net profit increases taxable income; consider buffers for
                    rate and expense changes.
                  </div>
                  <div>
                    - Depreciation: non-cash deduction (quantity surveyor schedule) that improves
                    after-tax cashflow.
                  </div>
                  <div>
                    - Common deductible expenses: loan interest, agent fees, insurance, council
                    rates, body corporate, repairs and maintenance, and depreciation.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Cash flow dynamics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    - Interest rate ↑ → higher interest expense → cashflow before tax ↓; may turn
                    positive to negative.
                  </div>
                  <div>
                    - Rent ↑ (market reviews, reduced vacancy) → income ↑ → cashflow improves; may
                    turn negative to neutral/positive.
                  </div>
                  <div>
                    - Expenses ↑ (insurance, strata, maintenance) → NOI ↓ → cashflow ↓; monitor and
                    negotiate where possible.
                  </div>
                  <div>
                    - Depreciation doesn&apos;t affect cash in the bank but reduces taxable profit,
                    improving after-tax cashflow.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Key levers</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="font-medium">Rent</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Vacancy, lease term, reviews
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="font-medium">Interest</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Rate, IO vs P&I, offsets
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="font-medium">Capex</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Timing and ROI of upgrades
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="font-medium">Tax</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Depreciation, structure, timing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Strategy ideas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="space-y-3">
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
                  <Idea
                    label="Target ROI upgrades"
                    tip="Low-cost improvements to lift rent and yield."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CalculatorLoader>
    </>
  )
}

export default function NegativeGearingPage() {
  return (
    <Suspense
      fallback={
        <CalculatorLoader>
          <div />
        </CalculatorLoader>
      }
    >
      <NegativeGearingContent />
    </Suspense>
  )
}
export type NegativeGearingPageProps = object
function Idea({ label, tip }: { label: string; tip: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
      <div className="font-medium text-sm sm:text-base">{label}</div>
      <div className="text-muted-foreground text-xs sm:text-sm">{tip}</div>
    </div>
  )
}
