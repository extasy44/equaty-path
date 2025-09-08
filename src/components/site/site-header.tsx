'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useRef, useState } from 'react'

export function SiteHeader() {
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
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
            width={200}
            height={44}
            className="h-8 w-auto md:h-10"
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
          {/* <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Dashboard
          </Link> */}
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
        <div className="hidden md:flex items-center gap-2">
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
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white shadow-sm"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* Mobile menu */}
      {isMobileOpen ? (
        <div className="md:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[var(--shadow-soft)]">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2 text-sm">
            <Link
              href="/"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              Dashboard
            </Link>
            <div className="mt-1 px-1 text-xs font-semibold text-muted-foreground">Tools</div>
            <Link
              href="/build-roi"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Build ROI
            </Link>
            <Link
              href="/rental-roi"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Rental ROI
            </Link>
            <Link
              href="/negative-gearing"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Gearing
            </Link>
            <Link
              href="/pathways"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Pathways
            </Link>
            <Link
              href="/compare"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Compare
            </Link>
            <Link
              href="/reports"
              className="px-1 py-2 rounded hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              EquityPath Reports
            </Link>
            <div className="mt-1 flex gap-2">
              <Link
                href="/login"
                className="flex-1 inline-flex items-center justify-center h-9 rounded-md border border-black/10 bg-white shadow-sm"
                onClick={() => setIsMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex-1 inline-flex items-center justify-center h-9 rounded-md bg-[color:var(--color-primary)] text-white shadow-sm"
                onClick={() => setIsMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export type SiteHeaderProps = object
