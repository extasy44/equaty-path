'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface SimulatorInputs {
  currentSavings: number
  monthlySavings: number
  targetDeposit: number
  purchasePrice: number
  annualGrowthRate: number // as fraction, e.g., 0.04
  grossYieldPct: number // percent, e.g., 3.8
  years: number
  lvr: number // as fraction, e.g., 0.8
}

interface SimulatorOutputs {
  depositGap: number
  monthsToDeposit: number
  yearsToDeposit: number
  loanAmount: number
  initialEquity: number
  valueAfterYears: number
  equityAfterYears: number
  rentalIncomeYear: number
}

const DEFAULTS: SimulatorInputs = {
  currentSavings: 120000,
  monthlySavings: 3500,
  targetDeposit: 180000,
  purchasePrice: 900000,
  annualGrowthRate: 0.04,
  grossYieldPct: 3.6,
  years: 5,
  lvr: 0.8,
}

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-AU', { maximumFractionDigits: 1 }).format(value)
}

function computeOutputs(i: SimulatorInputs): SimulatorOutputs {
  const depositGap = Math.max(0, i.targetDeposit - i.currentSavings)
  const monthsToDeposit = i.monthlySavings > 0 ? Math.ceil(depositGap / i.monthlySavings) : Infinity
  const yearsToDeposit = Number.isFinite(monthsToDeposit) ? monthsToDeposit / 12 : Infinity
  const loanAmount = i.purchasePrice * i.lvr
  const initialEquity = i.purchasePrice - loanAmount
  const valueAfterYears = i.purchasePrice * Math.pow(1 + i.annualGrowthRate, Math.max(0, i.years))
  const equityAfterYears = valueAfterYears - loanAmount
  const rentalIncomeYear = i.purchasePrice * (i.grossYieldPct / 100)
  return {
    depositGap,
    monthsToDeposit,
    yearsToDeposit,
    loanAmount,
    initialEquity,
    valueAfterYears,
    equityAfterYears,
    rentalIncomeYear,
  }
}

export interface StrategySnapshot {
  inputs: SimulatorInputs
  outputs: SimulatorOutputs
}

export function StrategySimulator({ onSnapshot }: { onSnapshot?: (s: StrategySnapshot) => void }) {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULTS)
  const outputs = useMemo(() => computeOutputs(inputs), [inputs])
  useEffect(() => {
    if (onSnapshot) onSnapshot({ inputs, outputs })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, outputs])

  function onNum<K extends keyof SimulatorInputs>(key: K, value: string) {
    const next = value.trim() === '' ? 0 : Number(value)
    setInputs((prev) => ({
      ...prev,
      [key]: Number.isFinite(next) ? (next as SimulatorInputs[K]) : prev[key],
    }))
  }

  function applyPreset(preset: 'buy_hold' | 'rentvest' | 'kdr') {
    if (preset === 'buy_hold')
      setInputs({ ...inputs, lvr: 0.8, annualGrowthRate: 0.04, grossYieldPct: 3.6 })
    if (preset === 'rentvest')
      setInputs({ ...inputs, lvr: 0.9, annualGrowthRate: 0.035, grossYieldPct: 4.2 })
    if (preset === 'kdr')
      setInputs({
        ...inputs,
        purchasePrice: 1200000,
        lvr: 0.75,
        annualGrowthRate: 0.045,
        grossYieldPct: 3.4,
      })
  }

  const depositProgress = Math.max(
    0,
    Math.min(100, (inputs.currentSavings / Math.max(1, inputs.targetDeposit)) * 100)
  )
  const equityProgress = Math.max(
    0,
    Math.min(100, (outputs.initialEquity / Math.max(1, outputs.equityAfterYears)) * 100)
  )

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Strategy Simulator
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-7 px-2" onClick={() => setInputs(DEFAULTS)}>
              Reset
            </Button>
            <Button variant="outline" className="h-7 px-2" onClick={() => applyPreset('buy_hold')}>
              Buy + Hold
            </Button>
            <Button variant="outline" className="h-7 px-2" onClick={() => applyPreset('rentvest')}>
              Rentvesting
            </Button>
            <Button variant="outline" className="h-7 px-2" onClick={() => applyPreset('kdr')}>
              KDR
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Field
            label="Current savings"
            id="currentSavings"
            value={inputs.currentSavings}
            onChange={(v) => onNum('currentSavings', v)}
          />
          <Field
            label="Monthly savings"
            id="monthlySavings"
            value={inputs.monthlySavings}
            onChange={(v) => onNum('monthlySavings', v)}
          />
          <Field
            label="Target deposit"
            id="targetDeposit"
            value={inputs.targetDeposit}
            onChange={(v) => onNum('targetDeposit', v)}
          />
          <Field
            label="Purchase price"
            id="purchasePrice"
            value={inputs.purchasePrice}
            onChange={(v) => onNum('purchasePrice', v)}
          />
          <Field
            label="Annual growth (e.g. 0.04)"
            id="annualGrowthRate"
            value={inputs.annualGrowthRate}
            step="any"
            onChange={(v) => onNum('annualGrowthRate', v)}
          />
          <Field
            label="Gross yield % (e.g. 3.6)"
            id="grossYieldPct"
            value={inputs.grossYieldPct}
            step="any"
            onChange={(v) => onNum('grossYieldPct', v)}
          />
          <Field
            label="Years"
            id="years"
            value={inputs.years}
            onChange={(v) => onNum('years', v)}
          />
          <Field
            label="LVR (e.g. 0.8)"
            id="lvr"
            value={inputs.lvr}
            step="any"
            onChange={(v) => onNum('lvr', v)}
          />
        </div>

        <div className="grid gap-4">
          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-base">Deposit runway</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Target</span>
                <span>{formatCurrency(inputs.targetDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current savings</span>
                <span>{formatCurrency(inputs.currentSavings)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-secondary)]"
                  style={{ width: `${depositProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span>Gap</span>
                <span>{formatCurrency(outputs.depositGap)}</span>
              </div>
              <div className="flex justify-between">
                <span>Months to deposit</span>
                <span>
                  {Number.isFinite(outputs.monthsToDeposit) ? `${outputs.monthsToDeposit}` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Years to deposit</span>
                <span>
                  {Number.isFinite(outputs.yearsToDeposit)
                    ? formatNumber(outputs.yearsToDeposit)
                    : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle className="text-base">Equity projection</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Initial equity</span>
                <span>{formatCurrency(outputs.initialEquity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Equity in {inputs.years}y</span>
                <span>{formatCurrency(outputs.equityAfterYears)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[color:var(--color-primary)]"
                  style={{ width: `${equityProgress}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span>Value after {inputs.years}y</span>
                <span>{formatCurrency(outputs.valueAfterYears)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual rent (est.)</span>
                <span>{formatCurrency(outputs.rentalIncomeYear)}</span>
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
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        step={step ?? '1'}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  )
}

export type StrategySimulatorProps = object
