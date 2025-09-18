import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SiteChrome } from '@/components/layouts/site-chrome'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EquityPath - AI-Powered Property Intelligence',
  description:
    'Advanced machine learning algorithms for property investment decisions. Transform 2D plans into 3D models, analyze markets, and generate institutional-grade reports.',
  keywords: [
    'property investment',
    'real estate analysis',
    'ROI calculator',
    '3D visualization',
    'financial planning',
    'property development',
  ],
  authors: [{ name: 'EquityPath Team' }],
  creator: 'EquityPath',
  publisher: 'EquityPath',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://equitypath.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://equitypath.com',
    title: 'EquityPath - AI-Powered Property Intelligence',
    description:
      'Advanced machine learning algorithms for property investment decisions. Transform 2D plans into 3D models, analyze markets, and generate institutional-grade reports.',
    siteName: 'EquityPath',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EquityPath - Property Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EquityPath - AI-Powered Property Intelligence',
    description: 'Advanced machine learning algorithms for property investment decisions.',
    images: ['/twitter-image.jpg'],
    creator: '@equitypath',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
