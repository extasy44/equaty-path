import type { Metadata } from 'next'

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: {
    default: 'EquityPath - AI-Powered Property Intelligence',
    template: '%s | EquityPath',
  },
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
    yandex: 'your-yandex-verification',
  },
}

// Page-specific metadata configurations
export const pageMetadata = {
  home: {
    title: 'Home',
    description:
      'AI-powered property intelligence platform. Transform 2D plans into 3D models, analyze markets, and generate institutional-grade reports.',
    openGraph: {
      title: 'Build ROI Calculator - EquityPath',
      description:
        'Estimate total project cost, resale value and ROI for your next knockdown rebuild or land purchase.',
      images: [{ url: '/og-build-roi.jpg', width: 1200, height: 630 }],
    },
  },

  // Free Tools
  buildRoi: {
    title: 'Build ROI Calculator',
    description:
      'Estimate total project cost, resale value and ROI for your next knockdown rebuild or land purchase. Free ROI calculator with professional-grade analysis.',
    keywords: [
      'build ROI',
      'construction calculator',
      'property development',
      'ROI analysis',
      'rebuild calculator',
    ],
    openGraph: {
      title: 'Build ROI Calculator - EquityPath',
      description:
        'Estimate total project cost, resale value and ROI for your next knockdown rebuild or land purchase.',
      images: [{ url: '/og-build-roi.jpg', width: 1200, height: 630 }],
    },
  },

  rentalRoi: {
    title: 'Rental ROI Calculator',
    description:
      'Calculate rental yield, expenses, tax impact and cash-on-cash returns. Free rental property analysis and investment calculator.',
    keywords: [
      'rental ROI',
      'rental yield calculator',
      'property investment',
      'rental analysis',
      'cash flow calculator',
    ],
    openGraph: {
      title: 'Rental ROI Calculator - EquityPath',
      description: 'Calculate rental yield, expenses, tax impact and cash-on-cash returns.',
      images: [{ url: '/og-rental-roi.jpg', width: 1200, height: 630 }],
    },
  },

  gearing: {
    title: 'Negative Gearing Calculator',
    description:
      'Understand negative/positive gearing tax impacts, cash flow dynamics, and practical strategies for property investors.',
    keywords: [
      'negative gearing',
      'positive gearing',
      'tax calculator',
      'investment strategy',
      'property gearing',
    ],
    openGraph: {
      title: 'Gearing Strategy Calculator - EquityPath',
      description: 'Understand negative/positive gearing tax impacts and cash flow dynamics.',
      images: [{ url: '/og-gearing.jpg', width: 1200, height: 630 }],
    },
  },

  pathways: {
    title: 'Financial Pathways',
    description:
      'Plan your savings, loan readiness and financial roadmap. Interactive financial planning tool for property investors.',
    keywords: [
      'financial planning',
      'savings calculator',
      'loan readiness',
      'financial roadmap',
      'investment planning',
    ],
    openGraph: {
      title: 'Financial Pathways - EquityPath',
      description: 'Plan your savings, loan readiness and financial roadmap.',
      images: [{ url: '/og-pathways.jpg', width: 1200, height: 630 }],
    },
  },

  compare: {
    title: 'Property Comparison Tool',
    description:
      'Compare multiple projects, suburbs, builders and investment strategies side by side with visual comparisons.',
    keywords: [
      'property comparison',
      'investment comparison',
      'suburb comparison',
      'builder comparison',
      'investment analysis',
    ],
    openGraph: {
      title: 'Property Comparison Tool - EquityPath',
      description:
        'Compare multiple projects, suburbs, builders and investment strategies side by side.',
      images: [{ url: '/og-compare.jpg', width: 1200, height: 630 }],
    },
  },

  // Premium Tools
  builderVisualizer: {
    title: '3D Builder Visualizer',
    description:
      'Transform 2D builder plans into interactive 3D previews with material application. Premium AI-powered visualization tool.',
    keywords: [
      '3D visualization',
      'builder plans',
      'material application',
      '3D modeling',
      'architectural visualization',
    ],
    openGraph: {
      title: '3D Builder Visualizer - EquityPath Premium',
      description:
        'Transform 2D builder plans into interactive 3D previews with material application.',
      images: [{ url: '/og-visualizer.jpg', width: 1200, height: 630 }],
    },
  },

  landscapingVisualizer: {
    title: 'Landscaping Visualizer',
    description:
      'Upload plans, draw areas, estimate costs and generate tradie-ready quotes. Premium landscaping design and costing tool.',
    keywords: [
      'landscaping design',
      'cost estimation',
      'landscape planning',
      'tradie quotes',
      'outdoor design',
    ],
    openGraph: {
      title: 'Landscaping Visualizer - EquityPath Premium',
      description: 'Upload plans, draw areas, estimate costs and generate tradie-ready quotes.',
      images: [{ url: '/og-landscaping.jpg', width: 1200, height: 630 }],
    },
  },

  analysis: {
    title: 'Real Estate Analysis',
    description:
      'Premium property analysis combining geospatial data, market values, zoning and comparable sales. Institutional-grade reports.',
    keywords: [
      'property analysis',
      'market analysis',
      'geospatial data',
      'comparable sales',
      'property valuation',
    ],
    openGraph: {
      title: 'Real Estate Analysis - EquityPath Premium',
      description:
        'Premium property analysis with geospatial data, market values, and comparable sales.',
      images: [{ url: '/og-analysis.jpg', width: 1200, height: 630 }],
    },
  },

  reports: {
    title: 'Premium Reports',
    description:
      'Generate lender-ready PDFs and professional reports from your calculations and analyses. Export functionality for premium users.',
    keywords: [
      'property reports',
      'PDF reports',
      'lender reports',
      'professional reports',
      'export reports',
    ],
    openGraph: {
      title: 'Premium Reports - EquityPath',
      description: 'Generate lender-ready PDFs and professional reports from your analyses.',
      images: [{ url: '/og-reports.jpg', width: 1200, height: 630 }],
    },
  },

  // Other pages
  pricing: {
    title: 'Pricing & Plans',
    description:
      'Choose the perfect EquityPath plan for your property investment needs. Free tools available, premium features unlocked.',
    keywords: ['pricing', 'plans', 'subscription', 'premium features', 'free tools'],
    openGraph: {
      title: 'Pricing & Plans - EquityPath',
      description: 'Choose the perfect EquityPath plan for your property investment needs.',
      images: [{ url: '/og-pricing.jpg', width: 1200, height: 630 }],
    },
  },

  features: {
    title: 'Features & Capabilities',
    description:
      "Explore EquityPath's comprehensive suite of AI-powered property tools and analysis capabilities.",
    keywords: ['features', 'capabilities', 'tools', 'property analysis', 'AI tools'],
    openGraph: {
      title: 'Features & Capabilities - EquityPath',
      description: 'Explore comprehensive AI-powered property tools and analysis capabilities.',
      images: [{ url: '/og-features.jpg', width: 1200, height: 630 }],
    },
  },

  about: {
    title: 'About EquityPath',
    description:
      "Learn about EquityPath's mission to democratize property intelligence through advanced AI and machine learning.",
    keywords: ['about', 'company', 'mission', 'AI', 'property intelligence'],
    openGraph: {
      title: 'About EquityPath',
      description: 'Democratizing property intelligence through advanced AI and machine learning.',
      images: [{ url: '/og-about.jpg', width: 1200, height: 630 }],
    },
  },

  contact: {
    title: 'Contact Us',
    description:
      "Get in touch with the EquityPath team. We're here to help with your property investment questions and support.",
    keywords: ['contact', 'support', 'help', 'customer service', 'questions'],
    openGraph: {
      title: 'Contact EquityPath',
      description: 'Get in touch with our team for property investment support and questions.',
      images: [{ url: '/og-contact.jpg', width: 1200, height: 630 }],
    },
  },

  privacy: {
    title: 'Privacy Policy',
    description:
      'EquityPath privacy policy and data protection information. Learn how we protect your property data and personal information.',
    keywords: ['privacy', 'data protection', 'GDPR', 'privacy policy', 'data security'],
  },

  terms: {
    title: 'Terms of Service',
    description:
      'EquityPath terms of service and usage agreement. Legal terms for using our property intelligence platform.',
    keywords: ['terms', 'service agreement', 'legal terms', 'usage policy', 'terms of service'],
  },

  signup: {
    title: 'Sign Up - Start Your Free Trial',
    description:
      'Create your EquityPath account and start your 14-day free trial. Access all free tools and explore premium features.',
    keywords: ['signup', 'register', 'free trial', 'account creation', 'get started'],
    openGraph: {
      title: 'Sign Up for EquityPath - Free Trial',
      description: 'Create your account and start your 14-day free trial today.',
      images: [{ url: '/og-signup.jpg', width: 1200, height: 630 }],
    },
  },

  login: {
    title: 'Login to EquityPath',
    description:
      'Access your EquityPath account to continue using our property intelligence tools and analysis platform.',
    keywords: ['login', 'signin', 'account access', 'authentication', 'user login'],
  },

  dashboard: {
    title: 'Dashboard',
    description:
      'Your personal EquityPath dashboard. Access saved analyses, recent calculations, and premium features.',
    keywords: ['dashboard', 'account', 'saved analyses', 'recent calculations', 'user dashboard'],
  },
}

// Helper function to generate metadata for a page
export function generatePageMetadata(pageKey: keyof typeof pageMetadata): Metadata {
  const pageMeta = pageMetadata[pageKey]
  return {
    ...baseMetadata,
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta?.keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      title: pageMeta?.openGraph?.title || pageMeta.title,
      description: pageMeta?.openGraph?.description || pageMeta.description,
      images: pageMeta?.openGraph?.images || baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: pageMeta.openGraph?.title || pageMeta.title,
      description: pageMeta.openGraph?.description || pageMeta.description,
      images: pageMeta.openGraph?.images || baseMetadata.twitter?.images,
    },
  }
}

// Helper function for dynamic page metadata
export function generateDynamicMetadata(
  title: string,
  description: string,
  options?: {
    keywords?: string[]
    image?: string
    url?: string
  }
): Metadata {
  return {
    ...baseMetadata,
    title,
    description,
    keywords: options?.keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      images: options?.image
        ? [{ url: options.image, width: 1200, height: 630 }]
        : baseMetadata.openGraph?.images,
      url: options?.url,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: options?.image ? [options.image] : baseMetadata.twitter?.images,
    },
  }
}
