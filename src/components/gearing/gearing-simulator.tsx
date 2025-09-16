'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export function GearingSimulator() {
  const [inputs, setInputs] = useState<RentalInputs>(defaultRentalInputs)
  const [outputs, setOutputs] = useState<RentalOutputs>(() =>
    calculateRentalRoi(defaultRentalInputs)
  )

  function prefillFromSearch(search: string) {
    if (!search) return
    const params = new URLSearchParams(search)
    const next: Partial<RentalInputs> = {}
    const keys: Array<keyof RentalInputs> = [
      'purchase_price',
      'stamp_duty',
      'closing_costs',
      'rent_per_week',
      'vacancy_weeks',
      'property_management_pct',
      'maintenance_per_year',
      'insurance_per_year',
      'rates_per_year',
      'body_corp_per_year',
      'loan_amount',
      'interest_rate',
      'marginal_tax_rate',
      'depreciation_per_year',
      'current_taxable_income',
    ]
    for (const key of keys) {
      const raw = params.get(String(key))
      if (raw == null) continue
      const n = Number(raw)
      if (Number.isFinite(n)) next[key] = n as never
    }
    if (Object.keys(next).length) setInputs((prev) => ({ ...prev, ...(next as RentalInputs) }))
  }

  useEffect(() => {
    setOutputs(calculateRentalRoi(inputs))
  }, [inputs])

  useEffect(() => {
    if (typeof window === 'undefined') return
    prefillFromSearch(window.location.search)
  }, [])

  function onChangeNumber(name: keyof RentalInputs, value: string) {
    const n = Number(value)
    setInputs((prev) => ({ ...prev, [name]: Number.isFinite(n) ? n : (prev[name] as number) }))
  }

  // const isNegativelyGeared = useMemo(() => outputs.taxable_profit < 0, [outputs.taxable_profit])

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Quick gearing simulator
          <div className="flex items-center gap-2">
            <div className="text-xs font-normal text-muted-foreground">
              Based on Rental ROI engine
            </div>
            <Button
              variant="outline"
              onClick={() => setInputs(defaultRentalInputs)}
              className="h-7 px-2"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  prefillFromSearch(window.location.search)
                }
              }}
              className="h-7 px-2"
            >
              Prefill from URL
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="purchase_price">Purchase price</Label>
              <Input
                id="purchase_price"
                type="number"
                value={inputs.purchase_price}
                onChange={(e) => onChangeNumber('purchase_price', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="loan_amount">Loan amount</Label>
              <Input
                id="loan_amount"
                type="number"
                value={inputs.loan_amount}
                onChange={(e) => onChangeNumber('loan_amount', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="interest_rate">Interest rate (e.g. 0.065)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="any"
                value={inputs.interest_rate}
                onChange={(e) => onChangeNumber('interest_rate', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rent_per_week">Rent per week</Label>
              <Input
                id="rent_per_week"
                type="number"
                value={inputs.rent_per_week}
                onChange={(e) => onChangeNumber('rent_per_week', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="vacancy_weeks">Vacancy weeks</Label>
              <Input
                id="vacancy_weeks"
                type="number"
                value={inputs.vacancy_weeks}
                onChange={(e) => onChangeNumber('vacancy_weeks', e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="property_management_pct">Agent fee (e.g. 0.06)</Label>
              <Input
                id="property_management_pct"
                type="number"
                step="any"
                value={inputs.property_management_pct}
                onChange={(e) => onChangeNumber('property_management_pct', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="insurance_per_year">Insurance per year</Label>
              <Input
                id="insurance_per_year"
                type="number"
                value={inputs.insurance_per_year}
                onChange={(e) => onChangeNumber('insurance_per_year', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="rates_per_year">Rates per year</Label>
              <Input
                id="rates_per_year"
                type="number"
                value={inputs.rates_per_year}
                onChange={(e) => onChangeNumber('rates_per_year', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="depreciation_per_year">Depreciation per year</Label>
              <Input
                id="depreciation_per_year"
                type="number"
                value={inputs.depreciation_per_year}
                onChange={(e) => onChangeNumber('depreciation_per_year', e.currentTarget.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="marginal_tax_rate">Marginal tax rate (e.g. 0.37)</Label>
              <Input
                id="marginal_tax_rate"
                type="number"
                step="any"
                value={inputs.marginal_tax_rate}
                onChange={(e) => onChangeNumber('marginal_tax_rate', e.currentTarget.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-base">Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <Row label="Gross income" value={formatCurrency(outputs.gross_rental_income)} />
              <Row
                label="Operating income (NOI)"
                value={formatCurrency(outputs.net_operating_income)}
              />
              <Row label="Debt service" value={formatCurrency(outputs.annual_debt_service)} />
              <Row
                label="Cashflow before tax"
                value={formatCurrency(outputs.cashflow_before_tax)}
              />
              <Row label="Taxable profit/loss" value={formatCurrency(outputs.taxable_profit)} />
              <Row label="Tax effect" value={formatCurrency(outputs.tax_effect)} />
              <Row
                label="Cashflow after tax"
                value={formatCurrency(outputs.cashflow_after_tax)}
                highlight
              />
              <Row label="Gross yield" value={formatPercent(outputs.gross_yield_pct)} />
              <Row label="Net yield" value={formatPercent(outputs.net_yield_pct)} />
              <Row label="Cash-on-cash" value={formatPercent(outputs.cash_on_cash_pct)} />
            </CardContent>
          </Card>

          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-base">Examples</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="grid gap-2">
                <Button onClick={() => setInputs({ ...inputs, interest_rate: 0.08 })}>
                  Rate shock: 8% interest
                </Button>
                <Button
                  onClick={() => setInputs({ ...inputs, rent_per_week: inputs.rent_per_week + 50 })}
                >
                  Lift rent by $50/week
                </Button>
                <Button
                  onClick={() =>
                    setInputs({ ...inputs, vacancy_weeks: Math.max(0, inputs.vacancy_weeks - 1) })
                  }
                >
                  Reduce vacancy by 1 week
                </Button>
                <Button onClick={() => setInputs(defaultRentalInputs)}>Reset</Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Tip: Use Rental ROI for full detail. This quick simulator focuses on gearing
                cashflow & tax.
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${highlight ? 'font-semibold text-[color:var(--color-secondary)]' : ''}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

export type GearingSimulatorProps = object
