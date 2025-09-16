'use client'

import { useEffect } from 'react'
import HouseVisualizer from '../components/HouseVisualizer'
import Head from 'next/head'
import { pageMetadata } from '@/lib/metadata'

export default function BuilderVisualizerLaunch() {
  const meta = pageMetadata.builderVisualizer

  useEffect(() => {
    // Prevent scrolling on the body when in fullscreen mode
    document.body.style.overflow = 'hidden'

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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
      <div className="fixed inset-0 z-50 bg-white">
        <HouseVisualizer />
      </div>
    </>
  )
}
