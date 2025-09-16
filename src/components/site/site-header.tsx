'use client'

import Link from 'next/link'
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
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EquityPath
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            Features
          </Link>
          <Link
            href="/analysis"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
          >
            AI Analysis
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-1.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              AI
            </span>
          </Link>
          <div
            className="relative"
            onMouseEnter={openCalc}
            onMouseLeave={closeCalcDelayed}
            onFocus={openCalc}
            onBlur={closeCalcDelayed}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
              Tools & Services <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </span>
            <div
              className="absolute left-0 top-full z-50 pt-2 transition-opacity duration-150"
              style={{ opacity: isCalcOpen ? 1 : 0, pointerEvents: isCalcOpen ? 'auto' : 'none' }}
              aria-hidden={!isCalcOpen}
            >
              <div className="w-80 rounded-xl border border-gray-200/60 bg-white/95 backdrop-blur-md p-4 shadow-lg ring-1 ring-black/5">
                {/* AI-Powered Tools */}
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wide bg-gradient-to-r from-blue-50 to-purple-50 rounded-md border-l-3 border-blue-500">
                    AI-Powered Tools
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/builder-visualizer"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          Builder Visualizer
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">
                        Transform 2D plans into 3D models with AI
                      </span>
                    </Link>
                    <Link
                      href="/landscaping-visualizer"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          Landscaping Visualizer
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">
                        Design outdoor spaces with AI assistance
                      </span>
                    </Link>
                    <Link
                      href="/analysis"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          Property Analysis
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                          AI
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">
                        Comprehensive property analysis with AI
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Financial Calculators */}
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-gradient-to-r from-emerald-50 to-teal-50 rounded-md border-l-3 border-emerald-500">
                    Financial Calculators
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/build-roi"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Build ROI Calculator
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          Construction & development ROI analysis
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/rental-roi"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Rental ROI Calculator
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          Rental income and cashflow analysis
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/negative-gearing"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Gearing Simulator
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          Negative & positive gearing analysis
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Planning & Strategy */}
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-orange-600 uppercase tracking-wide bg-gradient-to-r from-orange-50 to-amber-50 rounded-md border-l-3 border-orange-500">
                    Planning & Strategy
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/pathways"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Financial Pathways
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          Roadmap planning and savings strategy
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/compare"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Project Comparator
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          Compare suburbs, builders, or projects
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Reports & Export */}
                <div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-gradient-to-r from-indigo-50 to-purple-50 rounded-md border-l-3 border-indigo-500">
                    Reports & Export
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/reports"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">Premium Reports</span>
                        <span className="text-xs text-gray-600 mt-1">
                          Generate lender-ready PDFs & exports
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/build-roi?tab=upgrades"
                      className="block rounded-md px-3 py-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Upgrade ROI Guide
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
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
            className="text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            Pricing
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            disabled
            className="text-gray-500 cursor-not-allowed"
            title="Login coming soon"
          >
            Login
          </Button>
          <Button
            variant="default"
            disabled
            className="bg-gray-400 text-white cursor-not-allowed"
            title="Sign up coming soon"
          >
            Sign Up
          </Button>
        </div>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/95 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-200"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4 text-gray-700" />
          ) : (
            <Menu className="h-4 w-4 text-gray-700" />
          )}
        </button>
      </div>
      {/* Mobile menu */}
      {isMobileOpen ? (
        <div className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-md shadow-lg">
          <div className="mx-auto max-w-6xl px-2 py-1.5 grid gap-1 text-xs">
            <Link
              href="/"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/analysis"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900 flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>AI Analysis</span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-1 py-0.5 text-xs font-semibold text-white">
                AI
              </span>
            </Link>
            {/* AI-Powered Tools */}
            <div className="mt-1.5 px-1.5 py-0.5 text-xs font-semibold text-blue-600 uppercase tracking-wide bg-gradient-to-r from-blue-50 to-purple-50 rounded-sm border-l-2 border-blue-500">
              AI-Powered Tools
            </div>
            <Link
              href="/builder-visualizer"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900 flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Builder Visualizer</span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-1 py-0.5 text-xs font-semibold text-white">
                AI
              </span>
            </Link>
            <Link
              href="/landscaping-visualizer"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900 flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Landscaping Visualizer</span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-1 py-0.5 text-xs font-semibold text-white">
                AI
              </span>
            </Link>
            <Link
              href="/analysis"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900 flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Property Analysis</span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-1 py-0.5 text-xs font-semibold text-white">
                AI
              </span>
            </Link>

            {/* Financial Calculators */}
            <div className="mt-1.5 px-1.5 py-0.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-gradient-to-r from-emerald-50 to-teal-50 rounded-sm border-l-2 border-emerald-500">
              Financial Calculators
            </div>
            <Link
              href="/build-roi"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Build ROI Calculator
            </Link>
            <Link
              href="/rental-roi"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Rental ROI Calculator
            </Link>
            <Link
              href="/negative-gearing"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Gearing Simulator
            </Link>

            {/* Planning & Strategy */}
            <div className="mt-1.5 px-1.5 py-0.5 text-xs font-semibold text-orange-600 uppercase tracking-wide bg-gradient-to-r from-orange-50 to-amber-50 rounded-sm border-l-2 border-orange-500">
              Planning & Strategy
            </div>
            <Link
              href="/pathways"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Financial Pathways
            </Link>
            <Link
              href="/compare"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Project Comparator
            </Link>

            {/* Reports & Export */}
            <div className="mt-1.5 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-gradient-to-r from-indigo-50 to-purple-50 rounded-sm border-l-2 border-indigo-500">
              Reports & Export
            </div>
            <Link
              href="/reports"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Premium Reports
            </Link>
            <Link
              href="/build-roi?tab=upgrades"
              className="px-1.5 py-1 rounded-sm hover:bg-gray-50 transition-all duration-200 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileOpen(false)}
            >
              Upgrade ROI Guide
            </Link>
            <div className="mt-2 flex gap-1.5">
              <button
                disabled
                className="flex-1 inline-flex items-center justify-center h-7 rounded-sm border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed text-xs"
                title="Login coming soon"
              >
                Login
              </button>
              <button
                disabled
                className="flex-1 inline-flex items-center justify-center h-7 rounded-sm bg-gray-400 text-white cursor-not-allowed text-xs"
                title="Sign up coming soon"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export type SiteHeaderProps = object
