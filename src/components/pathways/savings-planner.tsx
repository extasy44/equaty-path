'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface PlannerInputs {
  currentSavings: number
  monthlySavings: number
  targetAmount: number
  months: number
  annualInterestPct: number // simple compounding assumption
}

interface PlannerOutputs {
  projectedBalance: number
  monthsToTarget: number
  progressNowPct: number
  progressProjectedPct: number
}

const DEFAULTS: PlannerInputs = {
  currentSavings: 120000,
  monthlySavings: 3500,
  targetAmount: 180000,
  months: 12,
  annualInterestPct: 2.0,
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

function projectBalance(i: PlannerInputs): PlannerOutputs {
  const monthlyRate = Math.max(0, i.annualInterestPct) / 100 / 12
  let balance = Math.max(0, i.currentSavings)
  for (let m = 0; m < Math.max(0, i.months); m++) {
    balance = balance * (1 + monthlyRate) + i.monthlySavings
  }
  // estimate months to target via loop (cap at 1000 months)
  let monthsToTarget = 0
  if (i.monthlySavings <= 0 && i.currentSavings < i.targetAmount) monthsToTarget = Infinity
  else {
    let b = Math.max(0, i.currentSavings)
    while (b < i.targetAmount && monthsToTarget < 1000) {
      b = b * (1 + monthlyRate) + i.monthlySavings
      monthsToTarget++
    }
    if (monthsToTarget >= 1000 && b < i.targetAmount) monthsToTarget = Infinity
  }

  const progressNowPct = Math.max(
    0,
    Math.min(100, (i.currentSavings / Math.max(1, i.targetAmount)) * 100)
  )
  const progressProjectedPct = Math.max(
    0,
    Math.min(100, (balance / Math.max(1, i.targetAmount)) * 100)
  )
  return { projectedBalance: balance, monthsToTarget, progressNowPct, progressProjectedPct }
}

export interface SavingsSnapshot {
  inputs: PlannerInputs
  outputs: PlannerOutputs
}

export function SavingsPlanner({ onSnapshot }: { onSnapshot?: (s: SavingsSnapshot) => void }) {
  const [inputs, setInputs] = useState<PlannerInputs>(DEFAULTS)
  const outputs = useMemo(() => projectBalance(inputs), [inputs])
  useEffect(() => {
    if (onSnapshot) onSnapshot({ inputs, outputs })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, outputs])

  function onNum<K extends keyof PlannerInputs>(key: K, value: string) {
    const next = value.trim() === '' ? 0 : Number(value)
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(next) ? (next as PlannerInputs[K]) : prev[key],
    }))
  }

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Savings Planner
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-7 px-2" onClick={() => setInputs(DEFAULTS)}>
              Reset
            </Button>
            <Button
              variant="outline"
              className="h-7 px-2"
              onClick={() => setInputs((p) => ({ ...p, monthlySavings: p.monthlySavings + 500 }))}
            >
              +$500/mo
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Field
            label="Current savings"
            id="sp_currentSavings"
            value={inputs.currentSavings}
            onChange={(v) => onNum('currentSavings', v)}
          />
          <Field
            label="Monthly savings"
            id="sp_monthlySavings"
            value={inputs.monthlySavings}
            onChange={(v) => onNum('monthlySavings', v)}
          />
          <Field
            label="Target amount"
            id="sp_targetAmount"
            value={inputs.targetAmount}
            onChange={(v) => onNum('targetAmount', v)}
          />
          <Field
            label="Months (projection)"
            id="sp_months"
            value={inputs.months}
            onChange={(v) => onNum('months', v)}
          />
          <Field
            label="Annual interest % (simple)"
            id="sp_interest"
            value={inputs.annualInterestPct}
            step="any"
            onChange={(v) => onNum('annualInterestPct', v)}
          />
        </div>

        <div className="grid gap-4">
          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-base">Progress to target</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Target</span>
                <span>{formatCurrency(inputs.targetAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Now</span>
                <span>{formatCurrency(inputs.currentSavings)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-secondary)]"
                  style={{ width: `${outputs.progressNowPct}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Projected in {inputs.months} mo</span>
                <span>{formatCurrency(outputs.projectedBalance)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-primary)]"
                  style={{ width: `${outputs.progressProjectedPct}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Months to reach target</span>
                <span>
                  {Number.isFinite(outputs.monthsToTarget) ? outputs.monthsToTarget : '—'}
                </span>
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
  const [displayValue, setDisplayValue] = useState(value.toString())

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(value.toString())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value
    setDisplayValue(inputValue)
    onChange(inputValue)
  }

  const handleFocus = () => {
    // Clear "0" when focusing on the input
    if (value === 0) {
      setDisplayValue('')
    }
  }

  const handleBlur = () => {
    // If empty, set back to 0
    if (displayValue === '') {
      setDisplayValue('0')
      onChange('0')
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={displayValue}
        step={step ?? '1'}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}

export type SavingsPlannerProps = object
