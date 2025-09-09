'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileText, BarChart3, Calculator, TrendingUp } from 'lucide-react'
import { m } from 'framer-motion'

export default function ReportsPage() {
  const [showToast, setShowToast] = useState(false)
  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 2200)
    return () => clearTimeout(t)
  }, [showToast])

  return (
    <div className="mx-auto max-w-4xl p-8 md:p-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          EquityPath Reports
        </h1>
        <p className="mt-3 text-muted-foreground">
          Generate and export professional property and finance reports.
        </p>
      </div>

      <div className="mt-8 grid gap-8">
        <Section>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            EquityPath Reports helps you turn calculations and strategies into professional-grade
            reports. Whether for lenders, advisors, or personal tracking, reports make your numbers
            actionable.
          </CardContent>
        </Section>

        <Section>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportCard icon={<FileText className="h-5 w-5" />} title="Build ROI Report" />
              <ReportCard icon={<Calculator className="h-5 w-5" />} title="Rental ROI Report" />
              <ReportCard
                icon={<TrendingUp className="h-5 w-5" />}
                title="Gearing Strategy Report"
              />
              <ReportCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="Financial Pathways Report"
              />
            </div>
          </CardContent>
        </Section>

        <Section>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>PDF (default)</li>
              <li>Excel</li>
              <li>CSV</li>
            </ul>
            <Separator className="my-4" />
            <div className="text-xs text-muted-foreground">More formats coming soon.</div>
          </CardContent>
        </Section>

        <m.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center"
        >
          <Button onClick={() => setShowToast(true)}>Generate Report</Button>
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
            Report generation coming soon.
          </div>
        </m.div>
      ) : null}
    </div>
  )
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      suppressHydrationWarning
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="ring-1 ring-black/5">{children}</Card>
    </m.div>
  )
}

function ReportCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Card className="ring-1 ring-black/5">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
          {icon}
        </div>
        <div className="font-medium">{title}</div>
      </CardContent>
    </Card>
  )
}

export type ReportsPageProps = object
