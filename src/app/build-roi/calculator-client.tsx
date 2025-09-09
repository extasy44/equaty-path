'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BuildRoiCalculatorForm } from '@/components/calculator/building-roi-calculator-form'
// import { ReportExportDialog } from '@/components/calculator/report-export-dialog'
import { FileDown, Landmark } from 'lucide-react'
import {
  calculateFeasibility,
  defaultInputs,
  type CalculatorOutputs,
  type CalculatorInputs,
} from '@/lib/build-roi-calc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrencyAUD } from '@/lib/utils'

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '—'
  return formatCurrencyAUD(value)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return '—%'
  return `${value.toFixed(1)}%`
}

export function CalculatorClient() {
  const [outputs, setOutputs] = useState<CalculatorOutputs>(() =>
    calculateFeasibility(defaultInputs)
  )
  const [isCalculating, setIsCalculating] = useState(false)
  const [latestInputs, setLatestInputs] = useState<CalculatorInputs>(defaultInputs)

  const memoOutputs = useMemo(() => outputs, [outputs])

  return (
    <div className="mx-auto max-w-6xl px-3 md:px-8 py-6 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
      <div className="space-y-4 md:space-y-6 min-w-0">
        <BuildRoiCalculatorForm
          isCalculating={isCalculating}
          onResult={async (values) => {
            setIsCalculating(true)
            try {
              setLatestInputs(values)
              const res = await fetch('/api/build-roi/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              })
              const data = (await res.json()) as CalculatorOutputs
              setOutputs(data)
            } finally {
              setIsCalculating(false)
            }
          }}
        />
      </div>

      <div className="space-y-4 md:space-y-6 min-w-0">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-[color:var(--color-primary)]" />
              EquityPath Build ROI — Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-xs sm:text-sm pr-1 break-words">
            <div className="text-2xl sm:text-3xl font-semibold">
              {formatCurrency(memoOutputs.resale_after_hold_years)}
            </div>
            <div className="text-xs text-muted-foreground">
              Projected resale after hold years
              <span className="ml-1 rounded bg-[color:var(--color-primary)]/10 px-1.5 py-0.5">
                includes new home premium (+
                {formatPercent((latestInputs?.new_home_premium_pct ?? 0) * 100)})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Project Cost (all-in)</span>
              <span>{formatCurrency(memoOutputs.total_project_cost_all_in)}</span>
            </div>
            <div className="hidden sm:flex justify-between">
              <span>Resale after hold years</span>
              <span>{formatCurrency(memoOutputs.resale_after_hold_years)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>{formatCurrency(memoOutputs.estimated_tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[color:var(--color-secondary)]">
              <span>ROI %</span>
              <span>{formatPercent(memoOutputs.roi_percent)}</span>
            </div>
            <div className="mt-1 h-1.5 sm:h-2 w-full rounded-full bg-black/10">
              <div
                className="h-1.5 sm:h-2 rounded-full bg-[color:var(--color-secondary)]"
                style={{ width: `${Math.min(Math.max(memoOutputs.roi_percent, 0), 100)}%` }}
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={async () => {
                  const res = await fetch('/api/export/pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(latestInputs),
                  })
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'equitypath-report.pdf'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                }}
                style={{
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  color: isCalculating ? 'gray' : 'white',
                }}
              >
                <FileDown className="h-4 w-4 mr-2" /> Download PDF Report
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const res = await fetch('/api/export/csv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(latestInputs),
                  })
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'equitypath-export.csv'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  URL.revokeObjectURL(url)
                }}
              >
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="schools">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="schools" className="cursor-pointer" title="Top nearby schools">
              Schools
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="cursor-pointer" title="Commute and amenity">
              Lifestyle
            </TabsTrigger>
          </TabsList>
          <TabsContent value="schools">
            <Card className="ring-1 ring-black/5 mt-4">
              <CardHeader>
                <CardTitle>Nearby Schools</CardTitle>
                <CardDescription>
                  This is placeholder sample data, not real listings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Distance (km)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Greenwood Primary</TableCell>
                      <TableCell>9/10</TableCell>
                      <TableCell>1.2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Riverside Secondary</TableCell>
                      <TableCell>8/10</TableCell>
                      <TableCell>2.4</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>St. Mary’s College</TableCell>
                      <TableCell>9/10</TableCell>
                      <TableCell>3.6</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lifestyle">
            <Card className="ring-1 ring-black/5 mt-4">
              <CardHeader>
                <CardTitle>Lifestyle Highlights</CardTitle>
                <CardDescription>
                  This is placeholder sample data, not real measurements.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div>🚆 Commute to CBD: 22 mins</div>
                <div>🏞️ Parks nearby: 5</div>
                <div>🛒 Shopping centres: 2</div>
                {isCalculating ? (
                  <div className="text-xs text-muted-foreground">Calculating…</div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export type CalculatorClientProps = object
