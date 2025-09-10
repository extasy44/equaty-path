'use client'

import { Suspense } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import { CalculatorLoader } from '@/components/ui/feature-loader'
import { pageMetadata } from '@/lib/metadata'

// Dynamically import the client component to avoid hydration issues
const BuildRoiContent = dynamic(() => import('./build-roi-content'), {
  loading: () => (
    <CalculatorLoader>
      <div />
    </CalculatorLoader>
  ),
})

function BuildRoiPage() {
  const meta = pageMetadata.buildRoi

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
      <Suspense
        fallback={
          <CalculatorLoader>
            <div />
          </CalculatorLoader>
        }
      >
        <BuildRoiContent />
      </Suspense>
    </>
  )
}

export default BuildRoiPage
export type BuildRoiPageProps = object
