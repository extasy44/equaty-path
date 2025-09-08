import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TOOLS } from '@/lib/tools'

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
        {Object.values(TOOLS).map((tool) => (
          <Card key={tool.key} className="flex flex-col">
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link
                href={tool.href}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm text-[color:var(--color-primary)] hover:underline"
              >
                Open Tool
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
export type DashboardPageProps = object
