'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChartHorizontal } from 'lucide-react'
import { m } from 'framer-motion'

export default function ComparePage() {
  const [showToast, setShowToast] = useState(false)
  const [options, setOptions] = useState<OptionState>({
    A: {
      label: 'Option A',
      landPrice: 900000,
      buildCost: 750000,
      roiPct: 18,
      yieldPct: 3.6,
      loanImpact: 'Medium',
      projection5y: 1950000,
    },
    B: {
      label: 'Option B',
      landPrice: 850000,
      buildCost: 700000,
      roiPct: 22,
      yieldPct: 3.9,
      loanImpact: 'Lower',
      projection5y: 1980000,
    },
    C: {
      label: 'Option C',
      landPrice: 920000,
      buildCost: 780000,
      roiPct: 16,
      yieldPct: 3.5,
      loanImpact: 'Higher',
      projection5y: 1920000,
    },
  })
  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 2200)
    return () => clearTimeout(t)
  }, [showToast])

  function updateOption(key: OptionKey, patch: Partial<OptionData>) {
    setOptions((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
  }

  return (
    <div className="mx-auto max-w-5xl p-8 md:p-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          EquityPath Compare
        </h1>
        <p className="mt-3 text-muted-foreground">
          Evaluate and compare multiple projects, suburbs, or investment strategies.
        </p>
      </div>

      <div className="mt-8 grid gap-8">
        <Section>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            With EquityPath Compare, you can benchmark multiple options side by side — from suburbs
            and builders to rental vs rebuild strategies. Make better decisions with clear visual
            comparisons.
          </CardContent>
        </Section>

        <Section>
          <CardHeader>
            <CardTitle>Comparison Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {(['A', 'B', 'C'] as const).map((key) => (
                <Card key={key} className="ring-1 ring-black/5">
                  <CardHeader>
                    <CardTitle className="text-base">{options[key].label}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <Field
                      label="Land price"
                      value={options[key].landPrice}
                      onChange={(v) => updateOption(key, { landPrice: num(v) })}
                    />
                    <Field
                      label="Build cost"
                      value={options[key].buildCost}
                      onChange={(v) => updateOption(key, { buildCost: num(v) })}
                    />
                    <Field
                      label="ROI %"
                      value={options[key].roiPct}
                      step="any"
                      onChange={(v) => updateOption(key, { roiPct: num(v) })}
                    />
                    <Field
                      label="Rental yield %"
                      value={options[key].yieldPct}
                      step="any"
                      onChange={(v) => updateOption(key, { yieldPct: num(v) })}
                    />
                    <div className="grid gap-1.5">
                      <Label>Loan impact</Label>
                      <Select
                        value={options[key].loanImpact}
                        onValueChange={(val) =>
                          updateOption(key, { loanImpact: val as LoanImpact })
                        }
                      >
                        <SelectTrigger className="h-9 bg-white border border-black/10 shadow-sm cursor-pointer">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-black/10 shadow-[var(--shadow-soft)] cursor-pointer">
                          <SelectItem value="Lower">Lower</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Higher">Higher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Field
                      label="5-year projection"
                      value={options[key].projection5y}
                      onChange={(v) => updateOption(key, { projection5y: num(v) })}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Section>

        <Section>
          <CardHeader>
            <CardTitle>Comparison Matrix</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>{options.A.label}</TableHead>
                  <TableHead>{options.B.label}</TableHead>
                  <TableHead>{options.C.label}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Row
                  label="Land Price"
                  a={fmt(options.A.landPrice)}
                  b={fmt(options.B.landPrice)}
                  c={fmt(options.C.landPrice)}
                />
                <Row
                  label="Build Cost"
                  a={fmt(options.A.buildCost)}
                  b={fmt(options.B.buildCost)}
                  c={fmt(options.C.buildCost)}
                />
                <Row
                  label="ROI %"
                  a={`${options.A.roiPct}%`}
                  b={`${options.B.roiPct}%`}
                  c={`${options.C.roiPct}%`}
                />
                <Row
                  label="Rental Yield %"
                  a={`${options.A.yieldPct}%`}
                  b={`${options.B.yieldPct}%`}
                  c={`${options.C.yieldPct}%`}
                />
                <Row
                  label="Loan Impact"
                  a={options.A.loanImpact}
                  b={options.B.loanImpact}
                  c={options.C.loanImpact}
                />
                <Row
                  label="5-Year Projection"
                  a={fmt(options.A.projection5y)}
                  b={fmt(options.B.projection5y)}
                  c={fmt(options.C.projection5y)}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Section>

        <Section>
          <CardHeader>
            <CardTitle>Visual Comparison</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                <BarChartHorizontal className="h-5 w-5" />
              </div>
              ROI and Projection bars
            </div>
            <div>
              <div className="text-sm font-medium mb-1">ROI %</div>
              <div className="grid gap-2">
                {(['A', 'B', 'C'] as const).map((k) => (
                  <BarRow
                    key={`roi-${k}`}
                    label={options[k].label}
                    value={options[k].roiPct}
                    max={Math.max(options.A.roiPct, options.B.roiPct, options.C.roiPct)}
                    suffix="%"
                    color="bg-[color:var(--color-secondary)]"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">5-Year Projection</div>
              <div className="grid gap-2">
                {(['A', 'B', 'C'] as const).map((k) => (
                  <BarRow
                    key={`proj-${k}`}
                    label={options[k].label}
                    value={options[k].projection5y}
                    max={Math.max(
                      options.A.projection5y,
                      options.B.projection5y,
                      options.C.projection5y
                    )}
                    suffix=""
                    color="bg-[color:var(--color-primary)]"
                    formatter={fmt}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Section>
        <m.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="inline-flex gap-2">
            <Button onClick={() => setShowToast(true)}>Add Comparison</Button>
            <Button variant="outline" onClick={() => downloadCsv(options)}>
              Export CSV
            </Button>
          </div>
        </m.div>
      </div>

      {showToast ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50"
        >
          <div className="rounded-md bg-black text-white px-4 py-2 text-sm shadow-[var(--shadow-soft)]">
            Comparison tool coming soon.
          </div>
        </m.div>
      ) : null}
    </div>
  )
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="ring-1 ring-black/5">{children}</Card>
    </m.div>
  )
}

function Row({ label, a, b, c }: { label: string; a: string; b: string; c: string }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>{a}</TableCell>
      <TableCell>{b}</TableCell>
      <TableCell>{c}</TableCell>
    </TableRow>
  )
}

export type ComparePageProps = object

interface OptionData {
  label: string
  landPrice: number
  buildCost: number
  roiPct: number
  yieldPct: number
  loanImpact: LoanImpact
  projection5y: number
}

type OptionKey = 'A' | 'B' | 'C'
type OptionState = Record<OptionKey, OptionData>
type LoanImpact = 'Lower' | 'Medium' | 'Higher'

function num(v: string): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function fmt(v: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(v)
}

function downloadCsv(options: OptionState) {
  const header = ['Metric', options.A.label, options.B.label, options.C.label]
  const rows: Array<string[]> = []
  rows.push([
    'Land Price',
    fmt(options.A.landPrice),
    fmt(options.B.landPrice),
    fmt(options.C.landPrice),
  ])
  rows.push([
    'Build Cost',
    fmt(options.A.buildCost),
    fmt(options.B.buildCost),
    fmt(options.C.buildCost),
  ])
  rows.push(['ROI %', `${options.A.roiPct}%`, `${options.B.roiPct}%`, `${options.C.roiPct}%`])
  rows.push([
    'Rental Yield %',
    `${options.A.yieldPct}%`,
    `${options.B.yieldPct}%`,
    `${options.C.yieldPct}%`,
  ])
  rows.push(['Loan Impact', options.A.loanImpact, options.B.loanImpact, options.C.loanImpact])
  rows.push([
    '5-Year Projection',
    fmt(options.A.projection5y),
    fmt(options.B.projection5y),
    fmt(options.C.projection5y),
  ])

  const csv = [header, ...rows]
    .map((cols) => cols.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparison.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string
  value: number
  onChange: (v: string) => void
  step?: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        step={step ?? '1'}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  )
}

function BarRow({
  label,
  value,
  max,
  suffix,
  color,
  formatter,
}: {
  label: string
  value: number
  max: number
  suffix: string
  color: string
  formatter?: (v: number) => string
}) {
  const widthPct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0
  return (
    <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="h-2 w-full rounded-full bg-black/10">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
      </div>
      <div className="tabular-nums min-w-[80px] text-right">
        {formatter ? formatter(value) : `${value}${suffix}`}
      </div>
    </div>
  )
}
