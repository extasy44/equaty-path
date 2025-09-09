'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { m } from 'framer-motion'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { formatCurrencyAUD } from '@/lib/utils'
import type { SavingsSnapshot } from './savings-planner'
import type { LoanSnapshot } from './loan-readiness'
import type { StrategySnapshot } from './strategy-simulator'

export function FinancialRoadmap({
  savings,
  loan,
  strategy,
}: {
  savings?: SavingsSnapshot
  loan?: LoanSnapshot
  strategy?: StrategySnapshot
}) {
  async function generatePdf() {
    const doc = await PDFDocument.create()
    const page = doc.addPage([595.28, 841.89])
    const { width, height } = page.getSize()
    const margin = 48
    const font = await doc.embedFont(StandardFonts.Helvetica)
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

    let y = height - margin
    const line = (text: string, bold = false, size = 12, color = rgb(0, 0, 0)) => {
      page.drawText(text, {
        x: margin,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      })
      y -= size + 8
    }

    // Header
    line('EquityPath Financial Roadmap', true, 20, rgb(0.1, 0.1, 0.1))
    y -= 6
    line(
      'A concise snapshot to share with brokers, accountants, or advisors.',
      false,
      11,
      rgb(0.35, 0.35, 0.35)
    )
    y -= 10

    // Sections (pulling from snapshots when provided)
    line('1) Savings & Runway', true, 14)
    if (savings) {
      line(
        `- Current: ${formatCurrencyAUD(savings.inputs.currentSavings)}  Monthly: ${formatCurrencyAUD(savings.inputs.monthlySavings)}`
      )
      line(
        `- Target: ${formatCurrencyAUD(savings.inputs.targetAmount)}  Months to target: ${Number.isFinite(savings.outputs.monthsToTarget) ? savings.outputs.monthsToTarget : '—'}`
      )
    } else {
      line('- Current savings, monthly savings, target deposit, months to target')
    }
    y -= 6
    line('2) Loan Readiness', true, 14)
    if (loan) {
      line(
        `- Assess: ${(loan.outputs.assessmentRate * 100).toFixed(2)}%  Eligible loan: ${formatCurrencyAUD(loan.outputs.eligibleLoan)}`
      )
      line(
        `- Deposit req: ${formatCurrencyAUD(loan.outputs.depositRequired)}  Gap: ${formatCurrencyAUD(loan.outputs.depositGap)}  DTI: ${loan.outputs.dti.toFixed(2)}x`
      )
    } else {
      line('- Assessment rate, borrowing capacity, deposit/LVR checks, DTI')
    }
    y -= 6
    line('3) Strategy Simulator', true, 14)
    if (strategy) {
      line(
        `- Purchase: ${formatCurrencyAUD(strategy.inputs.purchasePrice)}  Growth: ${(strategy.inputs.annualGrowthRate * 100).toFixed(1)}%  Years: ${strategy.inputs.years}`
      )
      line(
        `- Equity now: ${formatCurrencyAUD(strategy.outputs.initialEquity)}  In ${strategy.inputs.years}y: ${formatCurrencyAUD(strategy.outputs.equityAfterYears)}`
      )
      line(`- Est. annual rent: ${formatCurrencyAUD(strategy.outputs.rentalIncomeYear)}`)
    } else {
      line('- Purchase price, growth assumptions, equity projection, annual rent')
    }
    y -= 6
    line('4) Action Plan (Next 90 Days)', true, 14)
    line('- Tasks, buffers, review dates, and supporting documents')

    const pdfBytes = await doc.save()
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'equitypath-financial-roadmap.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // uses shared formatCurrencyAUD

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">Financial Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground grid gap-2">
        <div>Summarize your Savings, Loan Readiness, and Strategy into a shareable report.</div>
        <div>Use Export PDF to generate a simple roadmap you can send to stakeholders.</div>
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-2"
        >
          <Button onClick={generatePdf}>Export your Financial Roadmap as PDF</Button>
        </m.div>
      </CardContent>
    </Card>
  )
}

export type FinancialRoadmapProps = object
