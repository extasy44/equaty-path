'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const doesHideChrome = pathname?.startsWith('/builder-visualizer/launch')

  if (doesHideChrome) {
    return <>{children}</>
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100dvh-64px-120px)] bg-[color:var(--color-background)]">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
