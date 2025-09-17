'use client'

import { useEffect, useState } from 'react'
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

      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm font-medium mb-4">
            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4" />
            Financial Planning Tools
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gradient mb-3">
            EquityPath Pathways
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plan savings, loan readiness and your broader financial roadmap with our comprehensive
            suite of planning tools.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-1">4</div>
            <div className="text-xs sm:text-sm text-blue-700 font-medium">Planning Tools</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm text-purple-700 font-medium">Free to Use</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-1">
              Real-time
            </div>
            <div className="text-xs sm:text-sm text-green-700 font-medium">Calculations</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 sm:gap-6">
          {/* Overview Section */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6 border border-slate-200/50">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">How It Works</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                EquityPath Pathways helps you understand your financial position today and map out
                the steps toward your property and investment goals. It&apos;s more than a
                calculator — it&apos;s a roadmap for how your savings, loan capacity, and investment
                strategies come together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            </div>
          </div>

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
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 grid place-items-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs sm:text-sm font-bold">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            {icon ? (
              <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-md bg-slate-100 text-slate-600 shrink-0">
                {icon}
              </span>
            ) : null}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
            {text}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PathwaysPage() {
  return <PathwaysContent />
}

export type PathwaysPageProps = object
