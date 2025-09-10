'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BuilderClient from './viewer'
import { VisualizerLoader } from '@/components/ui/feature-loader'
import { Suspense } from 'react'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'

function BuilderVisualizerContent() {
  const meta = pageMetadata.builderVisualizer

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
              <Button asChild>
                <Link href="#app">Launch visualizer</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/features">See features</Link>
              </Button>
            </div>
          </section>

          <section id="app" className="mt-10">
            <div className="rounded-xl border bg-white shadow-sm ring-1 ring-black/5 p-4 md:p-6">
              <BuilderClient />
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
