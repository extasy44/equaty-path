import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Builder Visualizer 3D | EquityPath',
  description:
    'Advanced 3D house visualization tool with AI-powered material selection and real-time rendering.',
  keywords: [
    '3D visualization',
    'house design',
    'material selection',
    'real-time rendering',
    'property visualization',
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
    canonical: '/builder-visualizer',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://equitypath.com/builder-visualizer',
    title: 'Builder Visualizer 3D | EquityPath',
    description:
      'Advanced 3D house visualization tool with AI-powered material selection and real-time rendering.',
    siteName: 'EquityPath',
    images: [
      {
        url: '/og-builder-visualizer.jpg',
        width: 1200,
        height: 630,
        alt: 'Builder Visualizer 3D - EquityPath',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Builder Visualizer 3D | EquityPath',
    description:
      'Advanced 3D house visualization tool with AI-powered material selection and real-time rendering.',
    images: ['/twitter-builder-visualizer.jpg'],
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
}

export default function BuilderVisualizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <main className="h-screen bg-gray-900 text-white overflow-hidden">{children}</main>
    </div>
  )
}
