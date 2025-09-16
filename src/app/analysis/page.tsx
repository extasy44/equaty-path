'use client'

import { Suspense, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AnalysisClient from './client'
import { AnalyzerLoader } from '@/components/ui/feature-loader'
import { pageMetadata } from '@/lib/metadata'
import {
  Brain,
  TrendingUp,
  MapPin,
  FileText,
  Download,
  BarChart3,
  Zap,
  Play,
  ArrowRight,
  Sparkles,
  Eye,
  Share2,
  Clock,
} from 'lucide-react'

function AnalysisContent() {
  const meta = pageMetadata.analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleAnalyze = () => {
    window.open('/analysis/launch', '_blank')
  }

  const handlePreview = () => {
    window.open('/analysis/preview', '_blank')
  }

  const handleExitAnalysis = () => {
    setIsAnalyzing(false)
  }

  if (isAnalyzing) {
    return (
      <>
        <Head>
          <title>{meta.title} | EquityPath</title>
          <meta name="description" content={meta.description} />
          {meta.keywords && <meta name="keywords" content={meta.keywords.join(', ')} />}
          <meta property="og:title" content={meta.openGraph?.title || meta.title} />
          <meta
            property="og:description"
            content={meta.openGraph?.description || meta.description}
          />
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
        <div className="fixed inset-0 z-50 bg-white">
          <AnalysisClient onExit={handleExitAnalysis} previewMode={false} />
        </div>
      </>
    )
  }

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
      <AnalyzerLoader>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-teal-600/5"></div>
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-medium mb-8">
                  <Clock className="h-4 w-4" />
                  Feature Under Development
                </div>

                <h1>
                  <span className="text-gradient">AI Property</span>
                  <br />
                  Analysis
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Generate comprehensive property intelligence using advanced AI algorithms. Combine
                  geospatial data, market analysis, zoning information, and comparable sales for
                  institutional-grade insights.
                </p>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 max-w-2xl mx-auto mb-12">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-orange-800">Coming Soon</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Our AI Property Analysis tool is being built to provide comprehensive property
                    intelligence. This feature will include market analysis, zoning insights,
                    comparable sales data, and automated report generation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="btn-modern text-lg px-8 py-4 h-auto"
                    title="Opens in new tab - Feature under development"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Analysis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                  <Button
                    onClick={handlePreview}
                    variant="outline"
                    size="lg"
                    className="btn-outline-modern text-lg px-8 py-4 h-auto"
                    title="Opens in new tab - Feature under development"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Preview Demo
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
                    <div className="text-sm text-gray-600">Analysis Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">12,847</div>
                    <div className="text-sm text-gray-600">Properties Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2.3s</div>
                    <div className="text-sm text-gray-600">Avg. Processing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">1,429</div>
                    <div className="text-sm text-gray-600">Reports Generated</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2>Powerful Analysis Features</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need for comprehensive property intelligence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3>AI-Powered Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced machine learning algorithms analyze thousands of data points for
                    accurate property valuations.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Market trend analysis</li>
                    <li>• Comparable sales data</li>
                    <li>• Zoning regulation insights</li>
                  </ul>
                </div>

                {/* Feature 2 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3>Real-Time Data</h3>
                  <p className="text-gray-600 mb-4">
                    Access up-to-date market data, property records, and geospatial information for
                    accurate analysis.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Live market updates</li>
                    <li>• Property history tracking</li>
                    <li>• Geospatial boundaries</li>
                  </ul>
                </div>

                {/* Feature 3 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3>Professional Reports</h3>
                  <p className="text-gray-600 mb-4">
                    Generate comprehensive PDF reports with detailed analysis, charts, and
                    investment recommendations.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• PDF export</li>
                    <li>• Interactive charts</li>
                    <li>• Investment insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2>How It Works</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Simple steps to comprehensive property analysis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    1
                  </div>
                  <h3>Enter Property Details</h3>
                  <p className="text-gray-600">
                    Provide the property address, type, and key characteristics for comprehensive
                    analysis.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    2
                  </div>
                  <h3>AI Analysis Processing</h3>
                  <p className="text-gray-600">
                    Our AI algorithms analyze market data, comparable sales, and zoning information
                    in real-time.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    3
                  </div>
                  <h3>Generate Reports</h3>
                  <p className="text-gray-600">
                    Receive detailed analysis reports with valuations, market insights, and
                    investment recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h2>Ready to Analyze Your Property?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of investors and agents who trust our AI-powered property analysis
                platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 h-auto"
                  title="Opens in new tab - Feature under development"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis Now
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
                >
                  <Link href="/pricing">
                    <Share2 className="h-5 w-5 mr-2" />
                    View Pricing
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {showPreview && (
            <section className="py-20 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2>Live Preview</h2>
                  <p className="text-xl text-gray-600">Experience the analysis tool in action</p>
                </div>
                <div className="h-[800px] rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  <AnalysisClient previewMode={true} />
                </div>
              </div>
            </section>
          )}
        </div>
      </AnalyzerLoader>
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
