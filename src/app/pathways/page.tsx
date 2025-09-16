'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PiggyBank, TrendingUp, LineChart, Map } from 'lucide-react'
import { StrategySimulator, type StrategySnapshot } from '@/components/pathways/strategy-simulator'
import { SavingsPlanner, type SavingsSnapshot } from '@/components/pathways/savings-planner'
import { LoanReadiness, type LoanSnapshot } from '@/components/pathways/loan-readiness'
import { FinancialRoadmap } from '@/components/pathways/financial-roadmap'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'

function PathwaysContent() {
  const [showToast, setShowToast] = useState(false)
  const [savingsSnapshot, setSavingsSnapshot] = useState<SavingsSnapshot | null>(null)
  const [loanSnapshot, setLoanSnapshot] = useState<LoanSnapshot | null>(null)
  const [strategySnapshot, setStrategySnapshot] = useState<StrategySnapshot | null>(null)

  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 2200)
    return () => clearTimeout(t)
  }, [showToast])

  const meta = pageMetadata.pathways

  return (
    <>
      <Head>
        <title>{meta.title} | EquityPath</title>
        <meta name="description" content={meta.description} />
        {meta.keywords && <meta name="keywords" content={meta.keywords.join(', ')} />}
        <meta property="og:title" content={meta.openGraph?.title || meta.title} />
        <meta property="og:description" content={meta.openGraph?.description || meta.description} />
        {meta.openGraph?.images && (
          <meta property="og:image" content={meta.openGraph.images[0].url} />
        )}
        <meta name="twitter:title" content={meta.openGraph?.title || meta.title} />
        <meta
          name="twitter:description"
          content={meta.openGraph?.description || meta.description}
        />
        {meta.openGraph?.images && (
          <meta name="twitter:image" content={meta.openGraph.images[0].url} />
        )}
      </Head>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
            EquityPath Pathways
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Plan savings, loan readiness and your broader financial roadmap.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6">
          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground">
              EquityPath Pathways helps you understand your financial position today and map out the
              steps toward your property and investment goals. It&apos;s more than a calculator —
              it&apos;s a roadmap for how your savings, loan capacity, and investment strategies
              come together.
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
                <ol className="grid gap-3 sm:gap-4">
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
        </div>

        {showToast ? (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-50 mx-4">
            <div className="rounded-md bg-black text-white px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-[var(--shadow-soft)]">
              Feature coming soon. Stay tuned!
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

function Section({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function Step({ index, text, icon }: { index: number; text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 grid place-items-center rounded-full bg-[color:var(--color-primary)] text-white text-xs font-semibold">
        {index}
      </div>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon ? (
          <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-muted text-foreground shrink-0">
            {icon}
          </span>
        ) : null}
        <div className="text-xs sm:text-sm leading-relaxed">{text}</div>
      </div>
    </div>
  )
}

export default function PathwaysPage() {
  return <PathwaysContent />
}

export type PathwaysPageProps = object
