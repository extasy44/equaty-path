'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VisualizerLoader } from '@/components/ui/feature-loader'
import { Suspense } from 'react'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'
import { Play, ArrowRight, Sparkles, Zap, Eye, Download, Share2 } from 'lucide-react'

function BuilderVisualizerContent() {
  const meta = pageMetadata.builderVisualizer

  const handleLaunch = () => {
    // Open builder visualizer in a new tab
    window.open('/builder-visualizer/launch', '_blank')
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
      <VisualizerLoader>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-teal-600/5"></div>
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered 3D Visualization
                </div>

                <h1>
                  <span className="text-gradient">Builder</span>
                  <br />
                  Visualizer
                </h1>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Transform your 2D plans into stunning, interactive 3D models. Apply materials,
                  experiment with designs, and create photorealistic renders that bring your vision
                  to life.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <Button
                    onClick={handleLaunch}
                    size="lg"
                    className="btn-modern text-lg px-8 py-4 h-auto"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Launch Visualizer
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
                    <div className="text-sm text-gray-600">Design Generation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">Real-Time</div>
                    <div className="text-sm text-gray-600">Material Application</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">3D Export</div>
                    <div className="text-sm text-gray-600">Multiple Formats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">HD Renders</div>
                    <div className="text-sm text-gray-600">Photorealistic</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2>Powerful Features</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to create stunning 3D visualizations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3>AI Design Generation</h3>
                  <p className="text-gray-600 mb-4">
                    Generate custom house designs from simple text descriptions using advanced AI.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Natural language input</li>
                    <li>• Style variations</li>
                    <li>• Budget-aware suggestions</li>
                  </ul>
                </div>

                {/* Feature 2 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                    <Eye className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3>Real-Time Preview</h3>
                  <p className="text-gray-600 mb-4">
                    See your changes instantly as you apply materials and modify designs.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Live 3D updates</li>
                    <li>• Multiple view angles</li>
                    <li>• Lighting adjustments</li>
                  </ul>
                </div>

                {/* Feature 3 */}
                <div className="card-modern p-8 group">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3>Export & Share</h3>
                  <p className="text-gray-600 mb-4">
                    Export your models in multiple formats and create stunning galleries.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• GLTF/GLB export</li>
                    <li>• HD image renders</li>
                    <li>• Shareable galleries</li>
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
                  Simple steps to create amazing 3D visualizations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    1
                  </div>
                  <h3>Launch & Explore</h3>
                  <p className="text-gray-600">
                    Open the visualizer and explore the unified interface with all options
                    immediately available.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    2
                  </div>
                  <h3>Customize Design</h3>
                  <p className="text-gray-600">
                    Switch between house plans, facades, and materials. All changes update in
                    real-time.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    3
                  </div>
                  <h3>Export & Share</h3>
                  <p className="text-gray-600">
                    Generate renders, export your model, or create galleries to share with clients.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h2>Ready to Transform Your Designs?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of builders and architects who are already using our AI-powered
                visualizer.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={handleLaunch}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 h-auto"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Creating Now
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
                >
                  <Link href="/features">
                    <Share2 className="h-5 w-5 mr-2" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </VisualizerLoader>
    </>
  )
}

export default function BuilderVisualizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-sm text-muted-foreground">Loading AI Visualizer...</span>
        </div>
      }
    >
      <BuilderVisualizerContent />
    </Suspense>
  )
}
