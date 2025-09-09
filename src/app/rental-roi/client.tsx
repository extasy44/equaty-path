/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RentalRoiForm } from '@/components/rental/rental-roi-form'
import {
  calculateRentalRoi,
  defaultRentalInputs,
  type RentalInputs,
  type RentalOutputs,
} from '@/lib/rental-roi-calc'
import { formatCurrencyAUD } from '@/lib/utils'

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return formatCurrencyAUD(value)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '—%'
  return `${value.toFixed(1)}%`
}

export function RentalClient() {
  const [outputs, setOutputs] = useState<RentalOutputs>(() =>
    calculateRentalRoi(defaultRentalInputs)
  )
  const [isCalculating, setIsCalculating] = useState(false)
  const [currentInputs, setCurrentInputs] = useState<RentalInputs>(defaultRentalInputs)

  const memo = useMemo(() => outputs, [outputs])

  async function runCalculation(inputs: RentalInputs) {
    setIsCalculating(true)
    try {
      const res = await fetch('/api/rental-roi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      })
      const data = (await res.json()) as RentalOutputs
      setOutputs(data)
      setCurrentInputs(inputs)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6">
      <div className="space-y-4">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="text-muted-foreground">
              Pick a starting point. We’ll load values into the form and calculate automatically.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Preset
                title="House (metro)"
                subtitle="$1.20m • $1,150/wk"
                onClick={() =>
                  runCalculation({
                    ...defaultRentalInputs,
                    purchase_price: 1200000,
                    stamp_duty: 55000,
                    closing_costs: 6000,
                    rent_per_week: 1150,
                    vacancy_weeks: 2,
                    property_management_pct: 0.055,
                    maintenance_per_year: 1800,
                    insurance_per_year: 1400,
                    rates_per_year: 2800,
                    body_corp_per_year: 0,
                    loan_amount: 960000,
                    interest_rate: 0.064,
                    marginal_tax_rate: 0.37,
                    depreciation_per_year: 3000,
                  })
                }
                disabled={isCalculating}
              />
              <Preset
                title="Unit (body corp)"
                subtitle="$750k • $650/wk"
                onClick={() =>
                  runCalculation({
                    ...defaultRentalInputs,
                    purchase_price: 750000,
                    stamp_duty: 29000,
                    closing_costs: 4500,
                    rent_per_week: 650,
                    vacancy_weeks: 3,
                    property_management_pct: 0.07,
                    maintenance_per_year: 1200,
                    insurance_per_year: 900,
                    rates_per_year: 1800,
                    body_corp_per_year: 3500,
                    loan_amount: 600000,
                    interest_rate: 0.067,
                    marginal_tax_rate: 0.345,
                    depreciation_per_year: 2200,
                  })
                }
                disabled={isCalculating}
              />
              <Preset
                title="Regional"
                subtitle="$560k • $540/wk"
                onClick={() =>
                  runCalculation({
                    ...defaultRentalInputs,
                    purchase_price: 560000,
                    stamp_duty: 22000,
                    closing_costs: 4000,
                    rent_per_week: 540,
                    vacancy_weeks: 3,
                    property_management_pct: 0.08,
                    maintenance_per_year: 1300,
                    insurance_per_year: 950,
                    rates_per_year: 2000,
                    body_corp_per_year: 0,
                    loan_amount: 420000,
                    interest_rate: 0.069,
                    marginal_tax_rate: 0.32,
                    depreciation_per_year: 1800,
                  })
                }
                disabled={isCalculating}
              />
            </div>
          </CardContent>
        </Card>
        <RentalRoiForm
          defaultValues={currentInputs}
          isSubmitting={isCalculating}
          onSubmit={async (values: RentalInputs) => {
            setIsCalculating(true)
            try {
              const res = await fetch('/api/rental-roi/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              })
              const data = (await res.json()) as RentalOutputs
              setOutputs(data)
              setCurrentInputs(values)
            } finally {
              setIsCalculating(false)
            }
          }}
        />
      </div>

      <div className="space-y-4">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Rental ROI — Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm pr-1">
            <div className="flex items-baseline justify-between">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Gross yield
              </div>
              <div className="text-2xl font-semibold text-[color:var(--color-secondary)]">
                {formatPercent(memo.gross_yield_pct)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Gross rental income / purchase price
            </div>
            <div className="h-px bg-black/5" />
            <Row label="Gross rental income" value={formatCurrency(memo.gross_rental_income)} />
            <Row label="Net operating income" value={formatCurrency(memo.net_operating_income)} />
            <Row label="Debt service (interest)" value={formatCurrency(memo.annual_debt_service)} />
            <div className="flex justify-between rounded-md bg-[color:var(--color-secondary)]/10 px-2 py-1 font-semibold">
              <span>Cashflow (pre‑tax)</span>
              <span>{formatCurrency(memo.cashflow_before_tax)}</span>
            </div>
            <Row
              label="Taxable profit"
              value={
                typeof (outputs as any).taxable_profit === 'number'
                  ? formatCurrency((outputs as any).taxable_profit)
                  : '—'
              }
            />
            <Row
              label="Tax effect"
              value={
                typeof (outputs as any).tax_effect === 'number'
                  ? formatCurrency((outputs as any).tax_effect)
                  : '—'
              }
            />
            <div className="flex justify-between rounded-md bg-[color:var(--color-primary)]/10 px-2 py-1 font-semibold">
              <span>Cashflow (after tax)</span>
              <span>
                {typeof (outputs as any).cashflow_after_tax === 'number'
                  ? formatCurrency((outputs as any).cashflow_after_tax)
                  : '—'}
              </span>
            </div>
            <div className="h-px bg-black/5" />
            <div className="grid gap-1 rounded-md bg-[color:var(--color-primary)]/5 px-2 py-2 ring-1 ring-[color:var(--color-primary)]/15">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Taxable income impact
              </div>
              <Row
                label="Before"
                value={
                  typeof (outputs as any).taxable_income_before === 'number'
                    ? formatCurrency((outputs as any).taxable_income_before)
                    : '—'
                }
              />
              <Row
                label="After (incl. property)"
                value={
                  typeof (outputs as any).taxable_income_after === 'number'
                    ? formatCurrency((outputs as any).taxable_income_after)
                    : '—'
                }
              />
            </div>
            <div className="h-px bg-black/5" />
            <Row label="Net yield" value={formatPercent(memo.net_yield_pct)} />
            <Row label="Cash on cash" value={formatPercent(memo.cash_on_cash_pct)} />
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Invest ideas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Idea
              label="Reduce vacancy"
              tip="Target 1–2 weeks by listing early, professional photos and flexible inspections."
            />
            <Idea
              label="Negotiate management"
              tip="Drop agent fee by 0.5–1.0% or switch to fixed fee."
            />
            <Idea
              label="Optimize rent"
              tip="Align to market comparables; consider 12‑month lease with CPI clauses."
            />
            <Idea
              label="Capex scheduling"
              tip="Batch non‑urgent works post‑settlement to preserve cash."
            />
            <Idea
              label="Loan structure"
              tip="Offset account and interest‑only period (advice dependent)."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Idea({ label, tip }: { label: string; tip: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{tip}</div>
    </div>
  )
}

export type RentalClientProps = object

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function Preset({
  title,
  subtitle,
  onClick,
  disabled,
}: {
  title: string
  subtitle: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="justify-start text-left h-auto py-3 px-3"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="grid">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </Button>
  )
}
