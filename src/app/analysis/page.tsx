'use client'

import { Suspense } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ServiceLayout } from '@/components/layouts/service-layout'
import { ServiceSidebar } from '@/components/layouts/service-sidebar'
import AnalysisClient from './client'
import { AnalyzerLoader } from '@/components/ui/feature-loader'
import { pageMetadata } from '@/lib/metadata'
import { Brain, TrendingUp, MapPin, FileText, Download, BarChart3, Zap } from 'lucide-react'

function AnalysisContent() {
  const meta = pageMetadata.analysis

  const metrics = [
    {
      title: 'Analysis Accuracy',
      value: '94.2%',
      description: 'Based on 10,000+ properties',
      icon: <BarChart3 className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+2.1%',
    },
    {
      title: 'Properties Analyzed',
      value: '12,847',
      description: 'This month',
      icon: <MapPin className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+18%',
    },
    {
      title: 'Avg. Processing Time',
      value: '2.3s',
      description: 'AI-powered analysis',
      icon: <Zap className="h-5 w-5" />,
      trend: 'down' as const,
      trendValue: '-0.5s',
    },
    {
      title: 'Reports Generated',
      value: '1,429',
      description: 'Professional PDFs',
      icon: <FileText className="h-5 w-5" />,
      trend: 'up' as const,
      trendValue: '+15%',
    },
  ]

  const sidebar = (
    <ServiceSidebar
      quickActions={[
        {
          label: 'Run New Analysis',
          href: '#run',
          icon: <Brain className="h-4 w-4" />,
        },
        {
          label: 'View Recent Reports',
          href: '/reports',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          label: 'Export Results',
          icon: <Download className="h-4 w-4" />,
          onClick: () => console.log('Export clicked'),
        },
      ]}
      status={[
        {
          label: 'AI Model Status',
          status: 'success' as const,
          value: 'Online',
        },
        {
          label: 'Data Freshness',
          status: 'success' as const,
          value: 'Updated',
        },
        {
          label: 'Analysis Queue',
          status: 'pending' as const,
          value: '2 pending',
        },
      ]}
      progress={[
        {
          label: 'Monthly Usage',
          value: 67,
          max: 100,
        },
        {
          label: 'Analysis Quality',
          value: 94,
          max: 100,
        },
      ]}
      stats={[
        {
          label: 'Avg. Property Value',
          value: '$892K',
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          label: 'Market Confidence',
          value: 'High',
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ]}
    />
  )

  const actions = (
    <div className="flex items-center gap-3">
      <Button asChild className="btn-tech">
        <Link href="#run">Run Analysis</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/pricing">Upgrade Plan</Link>
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
      <ServiceLayout
        title="AI Property Analysis"
        description="Generate comprehensive property intelligence using advanced AI algorithms. Combine geospatial data, market analysis, zoning information, and comparable sales for institutional-grade insights."
        icon={<Brain className="h-6 w-6" />}
        badge="AI Powered"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        metrics={metrics}
        actions={actions}
        sidebar={sidebar}
      >
        <AnalyzerLoader>
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-secondary)]/10 text-[color:var(--color-secondary)]">
                  <Brain className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-[color:var(--color-secondary)]">
                  Advanced AI Technology
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[color:var(--color-primary)] mb-3">
                Comprehensive Property Intelligence
              </h2>
              <p className="text-[color:var(--color-muted-foreground)] max-w-2xl mx-auto">
                Our AI analyzes thousands of data points including market trends, zoning
                regulations, comparable sales, and geospatial boundaries to provide you with
                accurate property valuations and investment insights.
              </p>
            </div>

            {/* Analysis Form */}
            <section id="run">
              <AnalysisClient />
            </section>
          </div>
        </AnalyzerLoader>
      </ServiceLayout>
    </>
  )
}

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <AnalyzerLoader>
          <div />
        </AnalyzerLoader>
      }
    >
      <AnalysisContent />
    </Suspense>
  )
}
