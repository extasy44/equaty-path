import Link from 'next/link'
import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TOOLS, toolsList } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'EquityPath Features – Property ROI, Cashflow & Reports',
  description:
    'Explore EquityPath tools: Build ROI, Rental ROI, Gearing simulator, Pathways, Compare and Reports. Plan projects, model cashflow and generate investor-ready PDFs.',
  alternates: { canonical: '/features' },
  openGraph: {
    title: 'EquityPath Features',
    description:
      'Plan, compare and act with confidence using calculators, simulators and reports built for property decisions.',
    url: '/features',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EquityPath Features',
    description: 'Calculators and reports for property ROI and strategy',
  },
}

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10">
      <section className="rounded-xl border bg-white shadow-sm ring-1 ring-black/5">
        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[color:var(--color-primary)]">
              Make smarter property decisions
            </h1>
            <p className="mt-4 text-muted-foreground max-w-prose">
              Model ROI, cashflow and strategies before you commit. EquityPath combines calculators,
              simulators and lender-ready reports so you can compare options and move forward with
              clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/build-roi"
                className="inline-flex items-center rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-white"
              >
                Start with Build ROI
              </Link>
              <Link
                href="/rental-roi"
                className="inline-flex items-center rounded-md border px-4 py-2 text-[color:var(--color-primary)]"
              >
                Explore Rental ROI
              </Link>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Built for</dt>
                <dd className="font-medium">Investors, homeowners, builders</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Outcomes</dt>
                <dd className="font-medium">ROI clarity, lender-ready docs</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg bg-gradient-to-b from-amber-100 to-orange-200 p-4">
            <div className="h-full w-full rounded-md border border-orange-300 bg-white/70 p-4">
              <p className="text-sm text-muted-foreground">
                Visualise scenarios similar to the map + gradient card in the reference design.
              </p>
              <div className="mt-4 aspect-video w-full rounded-md bg-[url('/globe.svg')] bg-center bg-no-repeat opacity-70" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">What you can do with EquityPath</h2>
        <p className="mt-2 text-muted-foreground max-w-3xl">
          From feasibility to financing, these purpose-built tools help you stress-test numbers,
          understand risk and present your plan to stakeholders.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Object.values(TOOLS).map((tool) => (
            <Card key={tool.key} className="flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="leading-tight">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {getBulletsForTool({ key: tool.key }).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Link
                    href={tool.href}
                    className="inline-flex items-center justify-center rounded-md bg-[color:var(--color-primary)] px-3 py-2 text-sm text-white hover:opacity-95"
                  >
                    Open {tool.name}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: buildItemListJsonLd({ items: toolsList }) }}
      />
    </div>
  )
}

function getBulletsForTool({ key }: { key: string }): string[] {
  if (!key) return []
  if (key === 'build-roi')
    return [
      'Estimate costs and timelines',
      'Model resale and equity uplift',
      'Stress-test contingencies',
    ]
  if (key === 'rental-roi')
    return [
      'Forecast yield and cashflow',
      'Model rates, insurance, strata',
      'See vacancy and buffers',
    ]
  if (key === 'gearing')
    return ['Simulate tax impacts', 'Compare negative vs positive', 'Understand after‑tax cashflow']
  if (key === 'pathways')
    return ['Set savings milestones', 'Plan deposits and buffers', 'Track readiness to buy']
  if (key === 'compare')
    return ['Compare suburbs or builders', 'Benchmark scenarios', 'Spot best risk‑adjusted ROI']
  if (key === 'reports')
    return ['Generate branded PDFs', 'Share lender‑ready summaries', 'Export CSVs for analysis']
  return []
}

function buildItemListJsonLd({ items }: { items: { name: string; href: string }[] }): string {
  if (!items?.length) return ''
  const base = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: it.name,
      url: it.href,
    })),
  }
  return JSON.stringify(base)
}

export type FeaturesPageProps = object
