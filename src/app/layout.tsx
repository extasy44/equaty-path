import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { RouteTransition } from '@/components/transition/route-transition'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EquityPath',
  description: 'Your journey to wealth through property & finance',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader />
        <main className="min-h-[calc(100dvh-56px-120px)] bg-[color:var(--color-background)]">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
