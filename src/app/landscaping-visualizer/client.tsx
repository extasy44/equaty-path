'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DrawnItemArea {
  kind: 'area'
  label: string
  points: Array<{ x: number; y: number }>
}
interface DrawnItemLine {
  kind: 'line'
  label: string
  points: Array<{ x: number; y: number }>
}
type DrawnItem = DrawnItemArea | DrawnItemLine

export default function VisualizerClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [planUrl, setPlanUrl] = useState<string | null>(null)
  const [scaleMetersPerPixel, setScaleMetersPerPixel] = useState<number | null>(null)
  const [activeTool, setActiveTool] = useState<'area' | 'line'>('area')
  const [label, setLabel] = useState('')
  const [items, setItems] = useState<DrawnItem[]>([])
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([])

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPlanUrl(url)
  }

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCurrentPoints((pts) => [...pts, { x, y }])
  }

  function completeShape() {
    if (!label.trim() || currentPoints.length < (activeTool === 'area' ? 3 : 2)) return
    const item: DrawnItem =
      activeTool === 'area'
        ? { kind: 'area', label: label.trim(), points: currentPoints }
        : { kind: 'line', label: label.trim(), points: currentPoints }
    setItems((prev) => [...prev, item])
    setCurrentPoints([])
    setLabel('')
  }

  function resetCanvas() {
    setItems([])
    setCurrentPoints([])
  }

  const summaries = useMemo(
    () => computeSummaries(items, scaleMetersPerPixel),
    [items, scaleMetersPerPixel]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Plan & Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Input type="file" accept="image/*,.pdf" onChange={onUpload} className="max-w-xs" />
              <Input
                placeholder="Meters per 100 pixels (e.g. 1.0)"
                onChange={(e) => setScaleMetersPerPixel(Number(e.target.value || 0) / 100)}
                className="max-w-xs"
              />
              <Button
                variant={activeTool === 'area' ? 'default' : 'outline'}
                onClick={() => setActiveTool('area')}
              >
                Area
              </Button>
              <Button
                variant={activeTool === 'line' ? 'default' : 'outline'}
                onClick={() => setActiveTool('line')}
              >
                Wall/Edge
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. 30m² Artificial Grass"
              />
              <Button onClick={completeShape}>Add</Button>
              <Button variant="outline" onClick={resetCanvas}>
                Reset
              </Button>
            </div>
            <div className="relative w-full overflow-auto">
              <canvas
                ref={canvasRef}
                onClick={onCanvasClick}
                width={1000}
                height={600}
                className="w-full rounded-md border bg-slate-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {summaries.map((s) => (
              <li key={s.label} className="flex items-center justify-between">
                <span>{s.label}</span>
                <span className="font-medium">{s.measurement}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button onClick={() => downloadMarkdownQuote({ planUrl, summaries })}>
              Generate Quote (Markdown)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function computeSummaries(
  items: DrawnItem[],
  metersPerPixel: number | null
): Array<{ label: string; measurement: string }> {
  if (!items.length) return []
  return items.map((it) => {
    if (it.kind === 'area') {
      const areaPx = polygonArea(it.points)
      const areaSqM = metersPerPixel ? Math.abs(areaPx) * metersPerPixel * metersPerPixel : null
      return {
        label: it.label,
        measurement: areaSqM ? `${areaSqM.toFixed(2)} m²` : `${Math.abs(areaPx).toFixed(0)} px²`,
      }
    }
    const lengthPx = polylineLength(it.points)
    const lengthM = metersPerPixel ? lengthPx * metersPerPixel : null
    return {
      label: it.label,
      measurement: lengthM ? `${lengthM.toFixed(2)} m` : `${lengthPx.toFixed(0)} px`,
    }
  })
}

function polygonArea(points: Array<{ x: number; y: number }>): number {
  if (points.length < 3) return 0
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    sum += a.x * b.y - b.x * a.y
  }
  return 0.5 * sum
}

function polylineLength(points: Array<{ x: number; y: number }>): number {
  if (points.length < 2) return 0
  let len = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    len += Math.hypot(b.x - a.x, b.y - a.y)
  }
  return len
}

function downloadMarkdownQuote({
  planUrl,
  summaries,
}: {
  planUrl: string | null
  summaries: Array<{ label: string; measurement: string }>
}) {
  const materials = estimateMaterials(summaries)
  const labor = estimateLabor(materials)
  const totalMaterials = sum(Object.values(materials).map((m) => m.cost))
  const totalLabor = sum(Object.values(labor).map((l) => l.cost))
  const total = totalMaterials + totalLabor

  const md = `### Landscaping Project Quotation\n---\n#### **Project Overview**\n- **Plan Reference:** ${planUrl ?? 'Uploaded plan'}\n- **Summary:** Concept landscaping including surfaces and walls as drawn.\n---\n#### **Visual Preview**\n- **![Visualized Landscape](https://placehold.co/1200x700?text=AI+Render+Preview)**\n---\n#### **Materials & Cost Breakdown**\n| Item | Area/Length | Estimated Cost (Materials) |\n|---|---|---|\n${formatMaterialsTable(materials)}| **Total Estimated Material Cost** | | **$${totalMaterials.toFixed(0)}** |\n---\n#### **Labor Estimate**\n${formatLabor(labor)}\n---\n**Total Project Estimate:** **$${total.toFixed(0)}**\n`

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'landscaping-quote.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function estimateMaterials(summaries: Array<{ label: string; measurement: string }>) {
  const result: Record<string, { measurement: string; cost: number }> = {}
  for (const s of summaries) {
    const key = normalizeKey(s.label)
    const area = parseFloat(s.measurement)
    const isArea = s.measurement.includes('m²')
    const rate = getMaterialRate(key, isArea)
    const cost = isFinite(area) ? area * rate : 0
    result[key] = { measurement: s.measurement, cost }
  }
  return result
}

function getMaterialRate(key: string, isArea: boolean): number {
  if (key.includes('concrete')) return isArea ? 95 : 120
  if (key.includes('artificial') || key.includes('grass')) return isArea ? 65 : 40
  if (key.includes('retaining') || key.includes('wall')) return isArea ? 300 : 380
  if (key.includes('garden')) return isArea ? 45 : 30
  return isArea ? 50 : 50
}

function estimateLabor(materials: Record<string, { measurement: string; cost: number }>) {
  const result: Record<string, { hours: number; rate: number; cost: number }> = {}
  for (const [key, val] of Object.entries(materials)) {
    const qty = parseFloat(val.measurement)
    const isArea = val.measurement.includes('m²')
    const rate = 85
    const hours = isFinite(qty) ? qty * (isArea ? 0.2 : 0.15) : 0
    result[key] = { hours, rate, cost: hours * rate }
  }
  return result
}

function formatMaterialsTable(
  materials: Record<string, { measurement: string; cost: number }>
): string {
  return (
    Object.entries(materials)
      .map(([key, v]) => `| ${titleCase(key)} | ${v.measurement} | $${v.cost.toFixed(0)} |`)
      .join('\n') + '\n'
  )
}

function formatLabor(labor: Record<string, { hours: number; rate: number; cost: number }>): string {
  const lines = Object.entries(labor).map(
    ([key, v]) =>
      `- **${titleCase(key)}:** ${v.hours.toFixed(1)} hours @ $${v.rate}/hr = $${v.cost.toFixed(0)}`
  )
  const total = sum(Object.values(labor).map((l) => l.cost))
  return lines.join('\n') + `\n- **Total Estimated Labor Cost** | | **$${total.toFixed(0)}** |`
}

function normalizeKey(s: string): string {
  return s.toLowerCase()
}

function titleCase(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + (isFinite(b) ? b : 0), 0)
}
