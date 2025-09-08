import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8 md:py-10 grid gap-6">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          EquityPath Dashboard
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Choose a tool to begin. Build ROI, Rental ROI, Gearing, Compare and Reports sit under the
          EquityPath brand for your wealth journey.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Build ROI</CardTitle>
            <CardDescription>Knockdown/Rebuild & construction ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/build-roi" className="text-[color:var(--color-primary)] underline">
              Open Calculator
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rental ROI</CardTitle>
            <CardDescription>Rental income, yield and cashflow analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rental-roi" className="text-[color:var(--color-primary)] underline">
              Open Tool
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gearing</CardTitle>
            <CardDescription>Negative & positive gearing simulator</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/negative-gearing" className="text-[color:var(--color-primary)] underline">
              Open Tool
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pathways</CardTitle>
            <CardDescription>Financial roadmap and savings strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pathways" className="text-[color:var(--color-primary)] underline">
              Open Tool
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compare</CardTitle>
            <CardDescription>Compare suburbs, builders or projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/compare" className="text-[color:var(--color-primary)] underline">
              Open Tool
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generate lender- or investor-ready PDFs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reports" className="text-[color:var(--color-primary)] underline">
              Open Tool
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export type DashboardPageProps = object
