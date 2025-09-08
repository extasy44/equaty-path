'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'

export function SiteHeader() {
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)

  function openCalc() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setIsCalcOpen(true)
  }

  function closeCalcDelayed() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setIsCalcOpen(false), 140)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[var(--shadow-soft)]">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/equaty-path-logo.png"
            alt="EquityPath logo"
            width={260}
            height={55}
            className="h-14 w-42"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground cursor-pointer">
            Home
          </Link>
          <Link
            href="/features"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Features
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Dashboard
          </Link>
          <div
            className="relative"
            onMouseEnter={openCalc}
            onMouseLeave={closeCalcDelayed}
            onFocus={openCalc}
            onBlur={closeCalcDelayed}
          >
            <span className="inline-flex items-center gap-1 text-[color:var(--color-primary)] cursor-pointer hover:underline font-medium">
              Tools <ChevronDown className="h-4 w-4" />
            </span>
            <div
              className="absolute left-0 top-full z-50 pt-2 transition-opacity duration-150"
              style={{ opacity: isCalcOpen ? 1 : 0, pointerEvents: isCalcOpen ? 'auto' : 'none' }}
              aria-hidden={!isCalcOpen}
            >
              <div className="w-72 rounded-md border bg-white p-2 shadow-[var(--shadow-soft)]">
                <Link href="/build-roi" className="block rounded-sm px-3 py-2 hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Build ROI</span>
                    <span className="text-xs text-muted-foreground">
                      Knockdown/Rebuild & construction ROI
                    </span>
                  </div>
                </Link>
                <Link href="/rental-roi" className="block rounded-sm px-3 py-2 hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Rental ROI</span>
                    <span className="text-xs text-muted-foreground">
                      Rental income, yield and cashflow analysis
                    </span>
                  </div>
                </Link>
                <Link
                  href="/negative-gearing"
                  className="block rounded-sm px-3 py-2 hover:bg-muted"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Gearing</span>
                    <span className="text-xs text-muted-foreground">
                      Negative & positive gearing simulator
                    </span>
                  </div>
                </Link>
                <Link href="/pathways" className="block rounded-sm px-3 py-2 hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Pathways</span>
                    <span className="text-xs text-muted-foreground">
                      Financial roadmap and savings strategy
                    </span>
                  </div>
                </Link>
                <Link href="/compare" className="block rounded-sm px-3 py-2 hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Compare</span>
                    <span className="text-xs text-muted-foreground">
                      Compare suburbs, builders or projects
                    </span>
                  </div>
                </Link>
                <Link href="/reports" className="block rounded-sm px-3 py-2 hover:bg-muted">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">EquityPath Reports</span>
                    <span className="text-xs text-muted-foreground">
                      Generate lender- or investor-ready PDFs
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Link
            href="/pricing"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export type SiteHeaderProps = object
