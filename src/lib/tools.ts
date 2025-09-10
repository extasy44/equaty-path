export interface ToolMeta {
  key: string
  name: string
  description: string
  href: string
  tier?: 'free' | 'premium'
  category?: 'calculator' | 'visualizer' | 'analysis' | 'reports'
}

export const TOOLS = {
  buildRoi: {
    key: 'build-roi',
    name: 'EquityPath Build ROI',
    description: 'Knockdown/Rebuild & construction ROI',
    href: '/build-roi',
    tier: 'free',
    category: 'calculator',
  },
  analysis: {
    key: 'analysis',
    name: 'EquityPath Real Estate Analysis',
    description: 'Premium property analysis using REA, CoreLogic & geospatial',
    href: '/analysis',
    tier: 'premium',
    category: 'analysis',
  },
  rentalRoi: {
    key: 'rental-roi',
    name: 'EquityPath Rental ROI',
    description: 'Rental income, yield and cashflow analysis',
    href: '/rental-roi',
    tier: 'free',
    category: 'calculator',
  },
  gearing: {
    key: 'gearing',
    name: 'EquityPath Gearing',
    description: 'Negative & positive gearing simulator',
    href: '/negative-gearing',
    tier: 'free',
    category: 'calculator',
  },
  pathways: {
    key: 'pathways',
    name: 'EquityPath Pathways',
    description: 'Financial roadmap and savings strategy',
    href: '/pathways',
    tier: 'free',
    category: 'calculator',
  },
  compare: {
    key: 'compare',
    name: 'EquityPath Compare',
    description: 'Compare suburbs, builders or projects',
    href: '/compare',
    tier: 'free',
    category: 'calculator',
  },
  landscaping: {
    key: 'landscaping',
    name: 'EquityPath Landscaping Visualizer',
    description: 'Draw areas, estimate costs & generate a tradie quote',
    href: '/landscaping-visualizer',
    tier: 'premium',
    category: 'visualizer',
  },
  reports: {
    key: 'reports',
    name: 'EquityPath Reports',
    description: 'Generate lender- or investor-ready PDFs',
    href: '/reports',
    tier: 'premium',
    category: 'reports',
  },
  builderVisualizer: {
    key: 'builder-visualizer',
    name: 'EquityPath Builder Visualizer',
    description: 'Transform 2D builder plans into interactive 3D previews',
    href: '/builder-visualizer',
    tier: 'premium',
    category: 'visualizer',
  },
} as const

export const toolsList: ToolMeta[] = Object.values(TOOLS)
