import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TOOLS } from '@/lib/tools'
import { Input } from '@/components/ui/input'
// Icons imported but not used directly now; keeping minimal footprint

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-20%,#1e293b_0%,#0f172a_60%,#0b1220_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
              Actionable insights for property & finance
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight text-white">
              Driving clarity for every property decision
            </h1>
            <p className="mt-4 text-slate-300 text-lg md:text-xl">
              One workspace to model ROI, forecast cashflow and generate lender-ready reports.
            </p>
            <form className="mt-6 md:mt-8 flex w-full max-w-lg items-center gap-2" action="/signup">
              <Input
                name="email"
                type="email"
                required
                placeholder="Enter your work email"
                className="h-11 bg-white/95 text-slate-900 placeholder:text-slate-500"
              />
              <Button
                type="submit"
                className="h-11 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90"
              >
                Create account
              </Button>
            </form>
            <p className="mt-2 text-xs text-slate-400">No credit card required</p>
            <div className="mt-6 flex items-center gap-4 opacity-80">
              <Image src="/vercel.svg" alt="Vercel" width={84} height={18} />
              <Image src="/next.svg" alt="Next.js" width={84} height={18} />
              <Image src="/globe.svg" alt="Global" width={84} height={18} />
            </div>
          </div>
          <div className="relative aspect-[16/10] md:aspect-[4/3] w-full">
            <div className="absolute inset-0 rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-2xl backdrop-blur-sm" />
            <div className="absolute inset-0 m-3 rounded-xl bg-white p-4 shadow-xl">
              <Image src="/window.svg" alt="Dashboard preview" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {Object.values(TOOLS).map((tool) => (
            <Card key={tool.key} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-block h-5 w-5 rounded bg-[color:var(--color-primary)]/10" />
                  {tool.name.replace('EquityPath ', '')}
                </CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline">
                  <Link href={tool.href}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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
  description:
    'Model ROI, forecast cashflow and generate lender-ready reports. Build ROI, Rental ROI, Gearing, Compare and Reports.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'EquityPath — Property & Finance Tools',
    description: 'Model ROI, forecast cashflow and generate lender-ready reports.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EquityPath — Property & Finance Tools',
    description: 'Property calculators, simulators and reports',
  },
}
