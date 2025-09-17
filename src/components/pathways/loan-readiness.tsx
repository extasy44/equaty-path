'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatCurrencyAUD } from '@/lib/utils'

interface LoanInputs {
  grossAnnualIncome: number
  otherDebtRepaymentsPerMonth: number
  livingExpensesPerMonth: number
  interestRate: number // e.g. 0.065
  assessmentBufferPct: number // e.g. 3 means 3%
  loanTermYears: number
  lvr: number // e.g. 0.8
  purchasePrice: number
  depositAvailable: number
}

interface LoanOutputs {
  assessmentRate: number
  monthlyRate: number
  repaymentFactor: number
  serviceableIncomePerMonth: number
  availableForDebtPerMonth: number
  borrowingCapacity: number
  maxLoanByLvr: number
  eligibleLoan: number
  depositRequired: number
  depositGap: number
  dti: number
}

const DEFAULTS: LoanInputs = {
  grossAnnualIncome: 180000,
  otherDebtRepaymentsPerMonth: 800,
  livingExpensesPerMonth: 3800,
  interestRate: 0.065,
  assessmentBufferPct: 3,
  loanTermYears: 30,
  lvr: 0.8,
  purchasePrice: 900000,
  depositAvailable: 180000,
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return formatCurrencyAUD(value)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '—%'
  return `${value.toFixed(1)}%`
}

function compute(i: LoanInputs): LoanOutputs {
  const assessmentRate = i.interestRate + i.assessmentBufferPct / 100
  const n = Math.max(1, i.loanTermYears) * 12
  const monthlyRate = assessmentRate / 12
  const repaymentFactor = monthlyRate > 0 ? monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)) : 0
  // conservative: assume 70% of gross available for all expenses, remainder for debt after living costs & other debts
  const serviceableIncomePerMonth = (i.grossAnnualIncome / 12) * 0.7
  const availableForDebtPerMonth = Math.max(
    0,
    serviceableIncomePerMonth - i.livingExpensesPerMonth - i.otherDebtRepaymentsPerMonth
  )
  const borrowingCapacity = repaymentFactor > 0 ? availableForDebtPerMonth / repaymentFactor : 0
  const maxLoanByLvr = i.purchasePrice * i.lvr
  const eligibleLoan = Math.max(0, Math.min(borrowingCapacity, maxLoanByLvr))
  const depositRequired = i.purchasePrice * (1 - i.lvr)
  const depositGap = Math.max(0, depositRequired - i.depositAvailable)
  const dti = i.grossAnnualIncome > 0 ? eligibleLoan / i.grossAnnualIncome : 0
  return {
    assessmentRate,
    monthlyRate,
    repaymentFactor,
    serviceableIncomePerMonth,
    availableForDebtPerMonth,
    borrowingCapacity,
    maxLoanByLvr,
    eligibleLoan,
    depositRequired,
    depositGap,
    dti,
  }
}

export interface LoanSnapshot {
  inputs: LoanInputs
  outputs: LoanOutputs
}

export function LoanReadiness({ onSnapshot }: { onSnapshot?: (s: LoanSnapshot) => void }) {
  const [inputs, setInputs] = useState<LoanInputs>(DEFAULTS)
  const o = useMemo(() => compute(inputs), [inputs])
  useEffect(() => {
    if (onSnapshot) onSnapshot({ inputs, outputs: o })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, o])

  function onNum<K extends keyof LoanInputs>(key: K, value: string) {
    const next = value.trim() === '' ? 0 : Number(value)
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(next) ? (next as LoanInputs[K]) : prev[key],
    }))
  }

  const capacityFill = Math.max(
    0,
    Math.min(100, (o.eligibleLoan / Math.max(1, o.maxLoanByLvr)) * 100)
  )
  const lvrPct = inputs.lvr * 100
  const depositFill = Math.max(
    0,
    Math.min(100, (inputs.depositAvailable / Math.max(1, o.depositRequired)) * 100)
  )

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          Loan Readiness
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              className="h-6 px-2 text-xs"
              onClick={() => setInputs(DEFAULTS)}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              className="h-6 px-2 text-xs"
              onClick={() =>
                setInputs({
                  ...inputs,
                  grossAnnualIncome: 240000,
                  otherDebtRepaymentsPerMonth: 600,
                  livingExpensesPerMonth: 4200,
                })
              }
            >
              Dual income
            </Button>
            <Button
              variant="outline"
              className="h-6 px-2 text-xs"
              onClick={() =>
                setInputs({
                  ...inputs,
                  grossAnnualIncome: 120000,
                  otherDebtRepaymentsPerMonth: 900,
                  livingExpensesPerMonth: 3200,
                })
              }
            >
              Single income
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4 sm:gap-6 pt-0">
        <div className="grid gap-3">
          <Field
            label="Gross annual income"
            id="li_income"
            value={inputs.grossAnnualIncome}
            onChange={(v) => onNum('grossAnnualIncome', v)}
          />
          <Field
            label="Other debt / mo"
            id="li_other"
            value={inputs.otherDebtRepaymentsPerMonth}
            onChange={(v) => onNum('otherDebtRepaymentsPerMonth', v)}
          />
          <Field
            label="Living expenses / mo"
            id="li_exp"
            value={inputs.livingExpensesPerMonth}
            onChange={(v) => onNum('livingExpensesPerMonth', v)}
          />
          <Field
            label="Interest rate (e.g. 0.065)"
            id="li_rate"
            value={inputs.interestRate}
            step="any"
            onChange={(v) => onNum('interestRate', v)}
          />
          <Field
            label="Assessment buffer % (e.g. 3)"
            id="li_buf"
            value={inputs.assessmentBufferPct}
            step="any"
            onChange={(v) => onNum('assessmentBufferPct', v)}
          />
          <Field
            label="Loan term (years)"
            id="li_term"
            value={inputs.loanTermYears}
            onChange={(v) => onNum('loanTermYears', v)}
          />
          <Field
            label="LVR (e.g. 0.8)"
            id="li_lvr"
            value={inputs.lvr}
            step="any"
            onChange={(v) => onNum('lvr', v)}
          />
          <Field
            label="Purchase price"
            id="li_pp"
            value={inputs.purchasePrice}
            onChange={(v) => onNum('purchasePrice', v)}
          />
          <Field
            label="Deposit available"
            id="li_dep"
            value={inputs.depositAvailable}
            onChange={(v) => onNum('depositAvailable', v)}
          />
        </div>

        <div className="grid gap-3">
          <Card className="ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">Capacity & buffers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1.5 text-xs sm:text-sm pt-0">
              <div className="flex justify-between">
                <span>Assessment rate</span>
                <span>{formatPercent(o.assessmentRate * 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Serviceable income / mo</span>
                <span>{formatCurrency(o.serviceableIncomePerMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Available for debt / mo</span>
                <span>{formatCurrency(o.availableForDebtPerMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>Borrowing capacity</span>
                <span>{formatCurrency(o.borrowingCapacity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan at LVR</span>
                <span>{formatCurrency(o.maxLoanByLvr)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Eligible loan</span>
                <span>{formatCurrency(o.eligibleLoan)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-primary)]"
                  style={{ width: `${capacityFill}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>DTI (eligible loan / income)</span>
                <span>{o.dti.toFixed(2)}×</span>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">Deposit & LVR</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1.5 text-xs sm:text-sm pt-0">
              <div className="flex justify-between">
                <span>Required deposit</span>
                <span>{formatCurrency(o.depositRequired)}</span>
              </div>
              <div className="flex justify-between">
                <span>Deposit available</span>
                <span>{formatCurrency(inputs.depositAvailable)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-secondary)]"
                  style={{ width: `${depositFill}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Target LVR</span>
                <span>{formatPercent(lvrPct)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Deposit gap</span>
                <span>{formatCurrency(o.depositGap)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  step,
}: {
  label: string
  id: string
  value: number
  onChange: (v: string) => void
  step?: string
}) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        step={step ?? '1'}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="h-8 text-sm"
      />
    </div>
  )
}

export type LoanReadinessProps = object
