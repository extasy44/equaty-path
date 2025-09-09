'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RentalRoiForm } from '@/components/rental/rental-roi-form'
import {
  calculateRentalRoi,
  defaultRentalInputs,
  type RentalInputs,
  type RentalOutputs,
} from '@/lib/rental-roi-calc'

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
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

  const memo = useMemo(() => outputs, [outputs])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-6">
      <div className="space-y-4">
        <RentalRoiForm
          defaultValues={defaultRentalInputs}
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
          <CardContent className="grid gap-2 text-sm pr-1">
            <div className="text-2xl font-semibold">
              {formatPercent(memo.gross_yield_pct)} gross yield
            </div>
            <div className="text-xs text-muted-foreground">
              Gross rental income / purchase price
            </div>
            <div className="flex justify-between">
              <span>Gross rental income</span>
              <span>{formatCurrency(memo.gross_rental_income)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net operating income</span>
              <span>{formatCurrency(memo.net_operating_income)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt service (interest)</span>
              <span>{formatCurrency(memo.annual_debt_service)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Cashflow (pre‑tax)</span>
              <span>{formatCurrency(memo.cashflow_before_tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxable profit</span>
              <span>{formatCurrency(memo as any).taxable_profit ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax effect</span>
              <span>{formatCurrency((memo as any).tax_effect ?? 0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Cashflow (after tax)</span>
              <span>{formatCurrency((memo as any).cashflow_after_tax ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net yield</span>
              <span>{formatPercent(memo.net_yield_pct)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash on cash</span>
              <span>{formatPercent(memo.cash_on_cash_pct)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Invest ideas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
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
