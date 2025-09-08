import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Calculator,
  School,
  FileDown,
  TrendingUp,
  Route as RouteIcon,
  GitCompare,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[color:var(--color-primary)]">
              EquityPath — your journey to wealth
            </h1>
            <p className="mt-3 md:mt-4 text-muted-foreground text-lg md:text-xl">
              Property and finance tools for every step: Build ROI, Rental ROI, Gearing, Reports.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90"
              >
                <Link href="/build-roi">Try Build ROI</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/9] md:aspect-[4/3] w-full rounded-xl md:rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
            <Image src="/window.svg" alt="Modern house" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[color:var(--color-primary)]" />
                Build ROI
              </CardTitle>
              <CardDescription>Knockdown/Rebuild & construction ROI</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/build-roi">Explore</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[color:var(--color-primary)]" />
                Rental ROI
              </CardTitle>
              <CardDescription>Rental income, yield and cashflow analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/rental-roi">Explore</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-[color:var(--color-primary)]" />
                Gearing
              </CardTitle>
              <CardDescription>Negative & positive gearing simulator</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/negative-gearing">Explore</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5 text-[color:var(--color-primary)]" />
                Pathways
              </CardTitle>
              <CardDescription>Financial roadmap and savings strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/pathways">Explore</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-[color:var(--color-primary)]" />
                Compare
              </CardTitle>
              <CardDescription>Compare suburbs, builders or projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/compare">Explore</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-[color:var(--color-primary)]" />
                Reports
              </CardTitle>
              <CardDescription>Generate lender- or investor-ready PDFs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/reports">Explore</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">What families and investors say</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            “The report saved us weeks of research and gave us confidence.”
          </p>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'EquityPath — Property & Finance Tools',
  description: 'EquityPath: Build ROI, Rental ROI, Gearing, and lender-ready reports.',
}
