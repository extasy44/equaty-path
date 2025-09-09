'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PiggyBank, TrendingUp, LineChart, Map } from 'lucide-react'
import { m } from 'framer-motion'
import { StrategySimulator, type StrategySnapshot } from '@/components/pathways/strategy-simulator'
import { SavingsPlanner, type SavingsSnapshot } from '@/components/pathways/savings-planner'
import { LoanReadiness, type LoanSnapshot } from '@/components/pathways/loan-readiness'
import { FinancialRoadmap } from '@/components/pathways/financial-roadmap'

export default function PathwaysPage() {
  const [showToast, setShowToast] = useState(false)
  const [savingsSnapshot, setSavingsSnapshot] = useState<SavingsSnapshot | null>(null)
  const [loanSnapshot, setLoanSnapshot] = useState<LoanSnapshot | null>(null)
  const [strategySnapshot, setStrategySnapshot] = useState<StrategySnapshot | null>(null)

  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 2200)
    return () => clearTimeout(t)
  }, [showToast])

  return (
    <div className="mx-auto max-w-3xl p-8 md:p-12">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          EquityPath Pathways
        </h1>
        <p className="mt-3 text-muted-foreground">
          Plan savings, loan readiness and your broader financial roadmap.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            EquityPath Pathways helps you understand your financial position today and map out the
            steps toward your property and investment goals. It’s more than a calculator — it’s a
            roadmap for how your savings, loan capacity, and investment strategies come together.
          </CardContent>
        </Card>

        <Section>
          <SavingsPlanner onSnapshot={(s) => setSavingsSnapshot(s)} />
        </Section>

        <Section>
          <LoanReadiness onSnapshot={(s) => setLoanSnapshot(s)} />
        </Section>

        <Section>
          <StrategySimulator onSnapshot={(s) => setStrategySnapshot(s)} />
        </Section>
        <Section>
          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3 md:gap-4">
                <Step
                  index={1}
                  text="Enter current savings, income, debts and target goals"
                  icon={<PiggyBank className="h-4 w-4" />}
                />
                <Step
                  index={2}
                  text="Estimate loan readiness and buffers"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
                <Step
                  index={3}
                  text="Lay out your roadmap milestones and timelines"
                  icon={<Map className="h-4 w-4" />}
                />
                <Step
                  index={4}
                  text="Simulate strategies and iterate your plan"
                  icon={<LineChart className="h-4 w-4" />}
                />
              </ol>
            </CardContent>
          </Card>
        </Section>

        <Section>
          <FinancialRoadmap
            savings={savingsSnapshot ?? undefined}
            loan={loanSnapshot ?? undefined}
            strategy={strategySnapshot ?? undefined}
          />
        </Section>

        <m.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center pt-4"
        >
          <Button onClick={() => setShowToast(true)}>Start Your Pathway</Button>
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
            Feature coming soon. Stay tuned!
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
      {children}
    </m.div>
  )
}

function Step({ index, text, icon }: { index: number; text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-6 w-6 shrink-0 grid place-items-center rounded-full bg-[color:var(--color-primary)] text-white text-xs font-semibold">
        {index}
      </div>
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-foreground">
            {icon}
          </span>
        ) : null}
        <div className="text-sm">{text}</div>
      </div>
    </div>
  )
}

export type PathwaysPageProps = object
