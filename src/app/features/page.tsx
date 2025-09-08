import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TOOLS } from '@/lib/tools'

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
        Features
      </h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        EquityPath brings calculators and reports together to help you plan, compare and act with
        confidence.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                Explore
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export type FeaturesPageProps = object
