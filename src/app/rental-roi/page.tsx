'use client'

import { Suspense } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ServiceLayout } from '@/components/layouts/service-layout'
import { ServiceSidebar } from '@/components/layouts/service-sidebar'
import { RentalClient } from './client'
import { CalculatorLoader } from '@/components/ui/feature-loader'
import { pageMetadata } from '@/lib/metadata'
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  Download,
  BarChart3,
  Target,
} from 'lucide-react'

function RentalRoiContent() {
  const meta = pageMetadata.rentalRoi

  const metrics = [
    {
      title: 'Avg. Rental Yield',
      value: '5.2%',
      description: 'Market average across suburbs',
      icon: <TrendingUp className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+0.8%',
    },
    {
      title: 'Calculations Today',
      value: '1,247',
      description: 'Properties analyzed',
      icon: <Calculator className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+23%',
    },
    {
      title: 'Avg. Cash Flow',
      value: '$1,892',
      description: 'Monthly positive cash flow',
      icon: <DollarSign className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+$142',
    },
    {
      title: 'Tax Efficiency',
      value: '78%',
      description: 'Average tax benefits',
      icon: <PieChart className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+3%',
    },
  ]

  const sidebar = (
    <ServiceSidebar
      quickActions={[
        {
          label: 'New Calculation',
          href: '#calculator',
          icon: <Calculator className="h-4 w-4" />,
        },
        {
          label: 'View Reports',
          href: '/reports',
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: 'Export Results',
          icon: <Download className="h-4 w-4" />,
          onClick: () => console.log('Export clicked'),
        },
      ]}
      status={[
        {
          label: 'Market Data',
          status: 'success' as const,
          value: 'Updated',
        },
        {
          label: 'Tax Rates',
          status: 'success' as const,
          value: 'Current',
        },
        {
          label: 'Interest Rates',
          status: 'warning' as const,
          value: 'Review',
        },
      ]}
      progress={[
        {
          label: 'ROI Accuracy',
          value: 92,
          max: 100,
        },
        {
          label: 'Data Completeness',
          value: 98,
          max: 100,
        },
      ]}
      stats={[
        {
          label: 'Avg. Property Price',
          value: '$1.2M',
          icon: <DollarSign className="h-4 w-4" />,
        },
        {
          label: 'Investment Returns',
          value: '6.8%',
          icon: <Target className="h-4 w-4" />,
        },
      ]}
    />
  )

  const actions = (
    <div className="flex items-center gap-3">
      <Button asChild className="btn-tech">
        <Link href="#calculator">Calculate ROI</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/pricing">Premium Features</Link>
      </Button>
    </div>
  )

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

      <CalculatorLoader>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-[color:var(--color-accent)]">
                Smart Investment Analysis
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-3">
              Maximize Your Rental Returns
            </h2>
            <p className="text-[color:var(--color-muted-foreground)] max-w-2xl mx-auto">
              Calculate comprehensive rental yields, factor in all expenses including taxes,
              maintenance, and vacancy rates. Get accurate cash flow projections and ROI analysis to
              make confident investment decisions.
            </p>
          </div>

          {/* Calculator Form */}
          <section id="calculator">
            <RentalClient />
          </section>
        </div>
      </CalculatorLoader>
    </>
  )
}

export default function RentalRoiPage() {
  return (
    <Suspense
      fallback={
        <CalculatorLoader>
          <div />
        </CalculatorLoader>
      }
    >
      <RentalRoiContent />
    </Suspense>
  )
}
export type RentalRoiPageProps = object
