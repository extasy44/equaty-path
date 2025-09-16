'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'
import { TreePine, Upload, Ruler, Calculator, Clock } from 'lucide-react'

function LandscapingVisualizerContent() {
  const meta = pageMetadata.landscapingVisualizer

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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-transparent to-emerald-600/5"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-medium mb-8">
                <Clock className="h-4 w-4" />
                Feature Under Development
              </div>

              <h1>
                <span className="text-gradient">Landscaping</span>
                <br />
                Visualizer
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                Upload a floor plan or site sketch, calibrate to scale and sketch your design. We
                calculate areas and lengths and prepare a tradie-ready quote.
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 max-w-2xl mx-auto mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-orange-800">Coming Soon</span>
                </div>
                <p className="text-sm text-orange-700">
                  Our Landscaping Visualizer is being built to help you design and visualize outdoor
                  spaces. This feature will include plan upload, scale calibration, design tools,
                  and automated cost calculations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button
                  disabled
                  size="lg"
                  className="bg-gray-400 text-white cursor-not-allowed text-lg px-8 py-4 h-auto"
                  title="Landscaping Visualizer coming soon"
                >
                  <TreePine className="h-5 w-5 mr-2" />
                  Start Designing (Coming Soon)
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="btn-outline-modern text-lg px-8 py-4 h-auto"
                >
                  <Link href="/build-roi?tab=landscaping">
                    <Calculator className="h-5 w-5 mr-2" />
                    Try Calculator
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">Auto</div>
                  <div className="text-sm text-gray-600">Scale Detection</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">3D</div>
                  <div className="text-sm text-gray-600">Visualization</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Live</div>
                  <div className="text-sm text-gray-600">Cost Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">PDF</div>
                  <div className="text-sm text-gray-600">Export Reports</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2>Planned Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for professional landscaping design
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg ring-1 ring-gray-200/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    Plan Upload & Calibration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">
                    Upload floor plans or site sketches and automatically calibrate to scale for
                    accurate measurements.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• PDF and image upload support</li>
                    <li>• Automatic scale detection</li>
                    <li>• Manual calibration tools</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg ring-1 ring-gray-200/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-emerald-500" />
                    Design Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">
                    Professional design tools for creating detailed landscaping plans with precise
                    measurements.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Drawing and sketching tools</li>
                    <li>• Plant and material libraries</li>
                    <li>• Area and length calculations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg ring-1 ring-gray-200/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-500" />
                    Cost Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">
                    Automated cost calculations based on materials, labor, and project
                    specifications.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Material cost database</li>
                    <li>• Labor rate calculations</li>
                    <li>• Quote generation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2>How It Will Work</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple steps to professional landscaping design
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3>Upload Your Plan</h3>
                <p className="text-gray-600">
                  Upload floor plans or site sketches and let our AI automatically calibrate the
                  scale.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3>Design Your Space</h3>
                <p className="text-gray-600">
                  Use professional design tools to sketch your landscaping vision with precise
                  measurements.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3>Get Your Quote</h3>
                <p className="text-gray-600">
                  Receive detailed cost estimates and professional reports ready for contractors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2>Ready to Design Your Landscape?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the waitlist to be notified when our Landscaping Visualizer launches.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                disabled
                size="lg"
                className="bg-white text-green-600 cursor-not-allowed text-lg px-8 py-4 h-auto"
                title="Landscaping Visualizer coming soon"
              >
                <TreePine className="h-5 w-5 mr-2" />
                Join Waitlist (Coming Soon)
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4 h-auto"
              >
                <Link href="/landscaping-calculator">
                  <Calculator className="h-5 w-5 mr-2" />
                  Try Calculator Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default function LandscapingVisualizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading Landscaping Visualizer...
          </span>
        </div>
      }
    >
      <LandscapingVisualizerContent />
    </Suspense>
  )
}
