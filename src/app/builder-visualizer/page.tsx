'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BuilderClient from './viewer'
import { VisualizerLoader } from '@/components/ui/feature-loader'
import { Suspense, useState } from 'react'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'
import { Play, Maximize } from 'lucide-react'

function BuilderVisualizerContent() {
  const meta = pageMetadata.builderVisualizer
  const [isLaunched, setIsLaunched] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleLaunch = () => {
    setIsLaunched(true)
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleExitFullscreen = () => {
    setIsLaunched(false)
  }

  if (isLaunched) {
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
          <BuilderClient onExitFullscreen={handleExitFullscreen} defaultFullscreen={true} />
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
      <VisualizerLoader>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10">
          <section className="rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--color-primary)]">
              Builder Plan Visualizer
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Transform 2D plans into interactive 3D previews. Apply finishes and export a gallery
              for your stakeholders.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Button onClick={handleLaunch} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Launch Visualizer
              </Button>
              <Button onClick={handlePreview} variant="outline">
                <Maximize className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button asChild variant="outline">
                <Link href="/features">See features</Link>
              </Button>
            </div>
          </section>

          {/* Description and Features */}
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* What is Builder Visualizer */}
            <div className="rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[color:var(--color-primary)]">
                What is Builder Visualizer?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Builder Visualizer is an advanced 3D visualization tool that transforms your 2D
                  architectural plans into interactive, photorealistic 3D models. Perfect for
                  builders, architects, and property developers who need to showcase their designs
                  to clients and stakeholders.
                </p>
                <p>
                  Our AI-powered platform allows you to experiment with different materials,
                  finishes, and architectural styles in real-time, creating stunning visualizations
                  that help close deals and secure approvals.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[color:var(--color-primary)]">
                Key Features
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium">AI-Powered Design Generation</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate custom house designs from simple text descriptions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium">Real-Time Material Application</h3>
                    <p className="text-sm text-muted-foreground">
                      Apply different materials and finishes instantly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium">Multiple View Modes</h3>
                    <p className="text-sm text-muted-foreground">
                      Switch between exterior and interior views seamlessly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium">Export & Share</h3>
                    <p className="text-sm text-muted-foreground">
                      Export 3D models and generate render galleries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mt-8 rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-primary)]">
              How to Use Builder Visualizer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <h3 className="font-semibold">Launch or Preview</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Choose between <strong>Launch Visualizer</strong> for full-screen editing or{' '}
                  <strong>Preview</strong> for a quick look at the interface.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <h3 className="font-semibold">Select Materials</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Use the collapsible materials panel to choose finishes for roof, walls, trim,
                  doors, and windows. Each selection updates the 3D model in real-time.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <h3 className="font-semibold">AI Design Assistant</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Describe your dream house using our AI assistant. Specify architectural style,
                  budget range, and design preferences to generate custom designs.
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <h3 className="font-semibold">Navigate Views</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Use the view controls to explore different angles: front, back, left, right,
                  aerial, and interior views. Switch between exterior and interior modes.
                </p>
              </div>

              {/* Step 5 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    5
                  </div>
                  <h3 className="font-semibold">Enhance & Export</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Generate enhanced renders and variations. Export your final 3D model or create a
                  gallery of renders to share with clients and stakeholders.
                </p>
              </div>

              {/* Step 6 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    6
                  </div>
                  <h3 className="font-semibold">Share & Collaborate</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Share your designs via links, download materials for presentations, or collaborate
                  with team members on design iterations.
                </p>
              </div>
            </div>
          </section>

          {/* Tips and Best Practices */}
          <section className="mt-8 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[color:var(--color-primary)]">
              Tips for Best Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800">For AI Generation</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>
                    • Be specific about architectural style (modern, traditional, contemporary)
                  </li>
                  <li>• Mention key features (large windows, metal roof, two-story)</li>
                  <li>• Include budget range for material suggestions</li>
                  <li>• Keep descriptions under 500 characters for best results</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800">For Material Selection</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Start with roof materials as they have the biggest visual impact</li>
                  <li>• Consider color harmony between different material categories</li>
                  <li>• Use the cost calculator to stay within budget</li>
                  <li>• Preview different combinations before finalizing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-8 rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[color:var(--color-primary)]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What file formats can I export?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You can export 3D models in GLTF format, high-resolution images in PNG/JPG, and
                  create PDF presentations with multiple render views.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a limit to the number of renders I can generate?
                </h3>
                <p className="text-muted-foreground text-sm">
                  No limits! Generate as many renders as you need from different viewpoints and
                  lighting conditions to create comprehensive presentation galleries.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I collaborate with team members?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Share your designs via secure links, and team members can view, comment, and
                  suggest modifications to your 3D models.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How accurate are the material cost estimates?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our cost calculator provides market-rate estimates based on current material
                  prices. Costs are updated regularly and include regional variations.
                </p>
              </div>
            </div>
          </section>

          {showPreview && (
            <section id="app" className="mt-10">
              <div className="h-[800px] rounded-xl border bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                <BuilderClient previewMode={true} />
              </div>
            </section>
          )}
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
