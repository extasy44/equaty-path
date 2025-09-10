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
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[var(--shadow-medium)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/equaty-path-logo.png"
            alt="EquityPath logo"
            width={200}
            height={44}
            className="h-9 w-auto md:h-11"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-sm font-medium cursor-pointer">
            Home
          </Link>
          <Link href="/features" className="text-sm font-medium cursor-pointer">
            Features
          </Link>
          <Link href="/analysis" className="text-sm font-medium cursor-pointer">
            AI Analysis
          </Link>
          <div
            className="relative"
            onMouseEnter={openCalc}
            onMouseLeave={closeCalcDelayed}
            onFocus={openCalc}
            onBlur={closeCalcDelayed}
          >
            <span className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer font-medium">
              Tools & Services <ChevronDown className="h-4 w-4" />
            </span>
            <div
              className="absolute left-0 top-full z-50 pt-2 transition-opacity duration-150"
              style={{ opacity: isCalcOpen ? 1 : 0, pointerEvents: isCalcOpen ? 'auto' : 'none' }}
              aria-hidden={!isCalcOpen}
            >
              <div className="w-80 rounded-xl border bg-[color:var(--surface)] p-4 shadow-[var(--shadow-large)]">
                {/* AI-Powered Tools */}
                <div className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-sm font-medium text-[color:var(--color-foreground)] uppercase tracking-wide">
                    🤖 AI-Powered Tools
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/builder-visualizer"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)] text-sm font-medium text-[color:var(--color-foreground)]">
                          Builder Visualizer
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        Transform 2D plans into 3D models with AI
                      </span>
                    </Link>
                    <Link
                      href="/landscaping-visualizer"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)] text-sm font-medium text-[color:var(--color-foreground)]">
                          Landscaping Visualizer
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        Design outdoor spaces with AI assistance
                      </span>
                    </Link>
                    <Link
                      href="/analysis"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)] text-sm font-medium text-[color:var(--color-foreground)]">
                          Property Analysis
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        Comprehensive property analysis with AI
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Financial Calculators */}
                <div className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-[color:var(--color-foreground)] uppercase tracking-wide">
                    🧮 Financial Calculators
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/build-roi"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Build ROI Calculator
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Construction & development ROI analysis
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/rental-roi"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Rental ROI Calculator
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Rental income and cashflow analysis
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/negative-gearing"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Gearing Simulator
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Negative & positive gearing analysis
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Planning & Strategy */}
                <div className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-[color:var(--color-primary)] uppercase tracking-wide">
                    📊 Planning & Strategy
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/pathways"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Financial Pathways
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Roadmap planning and savings strategy
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/compare"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Project Comparator
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Compare suburbs, builders, or projects
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Reports & Export */}
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-[color:var(--color-foreground)] uppercase tracking-wide">
                    📄 Reports & Export
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/reports"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Premium Reports
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Generate lender-ready PDFs & exports
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/build-roi?tab=upgrades"
                      className="block rounded-sm px-3 py-2 hover:bg-[color:var(--color-muted-hover)] transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                          Upgrade ROI Guide
                        </span>
                        <span className="text-xs text-[color:var(--color-muted-foreground)]">
                          Property upgrade investment guide
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/pricing"
            className="text-[color:var(--color-muted-foreground)] hover:text-foreground cursor-pointer"
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
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-[color:var(--surface)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* Mobile menu */}
      {isMobileOpen ? (
        <div className="md:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[var(--shadow-medium)]">
          <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2 text-sm">
            <Link
              href="/"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/analysis"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>AI Analysis</span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                AI
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Dashboard
            </Link>
            {/* AI-Powered Tools */}
            <div className="mt-2 px-1 text-xs font-semibold text-[color:var(--color-primary)]">
              🤖 AI-Powered Tools
            </div>
            <Link
              href="/builder-visualizer"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Builder Visualizer</span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                AI
              </span>
            </Link>
            <Link
              href="/landscaping-visualizer"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Landscaping Visualizer</span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                AI
              </span>
            </Link>
            <Link
              href="/analysis"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Property Analysis</span>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                AI
              </span>
            </Link>

            {/* Financial Calculators */}
            <div className="mt-2 px-1 text-xs font-semibold text-[color:var(--color-primary)]">
              🧮 Financial Calculators
            </div>
            <Link
              href="/build-roi"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Build ROI Calculator
            </Link>
            <Link
              href="/rental-roi"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Rental ROI Calculator
            </Link>
            <Link
              href="/negative-gearing"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Gearing Simulator
            </Link>

            {/* Planning & Strategy */}
            <div className="mt-2 px-1 text-xs font-semibold text-[color:var(--color-primary)]">
              📊 Planning & Strategy
            </div>
            <Link
              href="/pathways"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Financial Pathways
            </Link>
            <Link
              href="/compare"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Project Comparator
            </Link>

            {/* Reports & Export */}
            <div className="mt-2 px-1 text-xs font-semibold text-[color:var(--color-primary)]">
              📄 Reports & Export
            </div>
            <Link
              href="/reports"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Premium Reports
            </Link>
            <Link
              href="/build-roi?tab=upgrades"
              className="px-1 py-2 rounded hover:bg-[color:var(--color-muted-hover)] transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Upgrade ROI Guide
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
