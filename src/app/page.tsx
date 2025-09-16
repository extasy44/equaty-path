'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TOOLS } from '@/lib/tools'
import { Input } from '@/components/ui/input'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'
import { Clock } from 'lucide-react'

function HomeContent() {
  const meta = pageMetadata.home
  return (
    <>
      <Head>
        <title>{meta.title} | EquityPath</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>
      <div className="font-sans">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-20%,#1e293b_0%,#0f172a_60%,#0b1220_100%)]" />
          {/* Tech background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 border border-blue-500/20 rounded-lg rotate-12"></div>
            <div className="absolute top-40 right-20 w-24 h-24 border border-purple-500/20 rounded-lg -rotate-12"></div>
            <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-green-500/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-orange-500/20 rounded-lg -rotate-45"></div>
          </div>

          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-16 md:pt-24 pb-12 md:pb-20">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium ring-1 ring-blue-500/20 mb-6 text-[color:var(--color-muted)]">
                AI-Powered Property Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  EquityPath
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-white">
                  AI Financial Engine
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
                Advanced machine learning algorithms analyze property markets, predict cash flows,
                and generate institutional-grade reports for informed investment decisions.
              </p>

              {/* Tech stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.7%</div>
                  <div className="text-sm text-white">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-white">Data Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white">AI Processing</div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                    <Clock className="h-4 w-4" />
                    Sign Up Coming Soon
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    We&apos;re building something amazing for property investors.
                    <br />
                    Get notified when we launch!
                  </p>
                </div>

                <form
                  className="flex flex-col sm:flex-row w-full max-w-lg mx-auto items-center gap-3 mb-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    alert("Sign up coming soon! We'll notify you when it's ready.")
                  }}
                >
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your professional email"
                    className="h-12 bg-white/95 text-gray-900 placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-orange-400 flex-1"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8"
                  >
                    🚀 Get Notified
                  </Button>
                </form>
                <p className="text-sm text-white/80 text-center">
                  We&apos;ll email you when sign up is ready
                </p>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-75">
                <div className="flex items-center gap-2 text-xs text-white">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Next.js 15
                </div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  TypeScript
                </div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  AI-Powered
                </div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Real-time Data
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="bg-white border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
            <div className="text-center mb-8">
              <div className="text-3xl font-bold tracking-tight mb-4">
                AI-Powered Financial Tools
              </div>
              <p className="text-lg text-[color:var(--color-muted-foreground)] max-w-2xl mx-auto">
                Advanced algorithms and machine learning for property investment decisions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(TOOLS).map((tool) => (
                <Card
                  key={tool.key}
                  className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-[color:var(--color-foreground)]">
                        {tool.name.replace('EquityPath ', '')}
                      </CardTitle>
                      {tool.tier === 'premium' && (
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                        >
                          💎 Premium
                        </Badge>
                      )}
                      {tool.tier === 'free' && (
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          ✓ Free
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm text-[color:var(--color-muted-foreground)]">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-xs text-[color:var(--color-muted-foreground)]">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {tool.category === 'calculator' && 'Calculator'}
                        {tool.category === 'visualizer' && 'AI Visualizer'}
                        {tool.category === 'analysis' && 'AI Analysis'}
                        {tool.category === 'reports' && 'Premium Reports'}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full"
                      variant={tool.tier === 'premium' ? 'default' : 'outline'}
                    >
                      <Link href={tool.href}>
                        {tool.tier === 'premium' ? '🚀 Try Premium' : '📊 Launch Tool'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white border-t">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
              What families and investors say
            </h2>
            <p className="text-[color:var(--color-muted-foreground)] mt-3 text-lg">
              &quot;The report saved us weeks of research and gave us confidence.&quot;
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default function Home() {
  return <HomeContent />
}
