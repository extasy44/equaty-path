'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { CalculatorClient } from './calculator-client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpgradeRoiGuide } from '@/components/upgrade/upgrade-roi-guide'
import { LandscapingCalculator } from '@/components/calculator/landscaping-calculator'
import { CalculatorLoader } from '@/components/ui/feature-loader'

export default function BuildRoiContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'feasibility' | 'landscaping' | 'upgrades'>(
    'feasibility'
  )
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle search params after hydration to avoid server/client mismatches
  useEffect(() => {
    if (searchParams) {
      const tabParam = searchParams.get('tab')
      const initialTab =
        tabParam === 'feasibility' || tabParam === 'landscaping' || tabParam === 'upgrades'
          ? (tabParam as 'feasibility' | 'landscaping' | 'upgrades')
          : 'feasibility'

      setActiveTab(initialTab)
      setIsHydrated(true)
    }
  }, [searchParams])

  // Don't render until hydrated to prevent hydration mismatches
  if (!isHydrated) {
    return (
      <CalculatorLoader>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-[color:var(--color-muted)] rounded w-1/3 mx-auto mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-[color:var(--color-muted)] rounded w-2/3 mx-auto mb-6 sm:mb-8"></div>
            <div className="h-10 sm:h-12 bg-[color:var(--color-muted)] rounded w-full mb-4 sm:mb-6"></div>
            <div className="h-80 sm:h-96 bg-[color:var(--color-muted)] rounded"></div>
          </div>
        </div>
      </CalculatorLoader>
    )
  }

  return (
    <CalculatorLoader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <header className="mb-4 sm:mb-6 md:mb-8 text-center md:text-left mx-auto max-w-3xl md:max-w-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
            EquityPath Build ROI
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[color:var(--color-muted-foreground)] md:max-w-2xl mx-auto md:mx-0">
            Estimate total project cost, resale value and ROI for your next knockdown rebuild or
            land purchase. Work through the sections below, click Calculate, then review the
            Snapshot on the right. Export a lender-friendly PDF when you&apos;re ready.
          </p>
          {/* Link removed; Upgrades are now available as a tab below */}
        </header>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'feasibility' | 'landscaping' | 'upgrades')
          }
        >
          <TabsList className="w-full md:w-auto mx-auto grid grid-cols-3 bg-[color:var(--surface)] shadow-[var(--shadow-soft)] rounded-md p-1 overflow-x-auto text-xs sm:text-sm">
            <TabsTrigger value="feasibility" className="cursor-pointer px-2 sm:px-3">
              Feasibility
            </TabsTrigger>
            <TabsTrigger value="landscaping" className="cursor-pointer px-2 sm:px-3">
              Landscaping
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="cursor-pointer px-2 sm:px-3">
              Upgrades Guide
            </TabsTrigger>
          </TabsList>
          <TabsContent value="feasibility" className="mt-3 sm:mt-4 md:mt-6">
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-[color:var(--color-muted-foreground)]">
              Complete Basics, Construction, Fees and Finance. Press{' '}
              <span className="font-medium">Calculate ROI</span> to refresh the Snapshot.
            </div>
            <CalculatorClient />
          </TabsContent>
          <TabsContent
            value="references"
            className="mt-6 sm:mt-8 text-xs sm:text-sm text-[color:var(--color-muted-foreground)]"
          >
            Schools and Lifestyle information are available under the tabs on the right column.
            These sections currently show placeholder sample data.
          </TabsContent>
          <TabsContent value="upgrades" className="mt-4 sm:mt-6">
            <UpgradeRoiGuide showHeader={false} />
          </TabsContent>
          <TabsContent value="landscaping" className="mt-4 sm:mt-6">
            <div className="mb-2 text-xs sm:text-sm text-[color:var(--color-muted-foreground)]">
              Estimate costs for concrete, turf, paving, fencing, walls, driveway, pool, pergola and
              more.
            </div>
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm">
              Map results back to your form (for example Driveway & landscaping):{' '}
              <a
                className="underline text-[color:var(--color-primary)] break-words"
                href="/build-roi?tab=feasibility#driveway_landscaping_cost"
              >
                Go to Feasibility → Construction & site → Driveway & landscaping
              </a>
            </div>
            <LandscapingCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </CalculatorLoader>
  )
}
