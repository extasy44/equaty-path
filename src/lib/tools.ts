export interface ToolMeta {
  key: string
  name: string
  description: string
  href: string
}

export const TOOLS = {
  buildRoi: {
    key: 'build-roi',
    name: 'EquityPath Build ROI',
    description: 'Knockdown/Rebuild & construction ROI',
    href: '/build-roi',
  },
  rentalRoi: {
    key: 'rental-roi',
    name: 'EquityPath Rental ROI',
    description: 'Rental income, yield and cashflow analysis',
    href: '/rental-roi',
  },
  gearing: {
    key: 'gearing',
    name: 'EquityPath Gearing',
    description: 'Negative & positive gearing simulator',
    href: '/negative-gearing',
  },
  pathways: {
    key: 'pathways',
    name: 'EquityPath Pathways',
    description: 'Financial roadmap and savings strategy',
    href: '/pathways',
  },
  compare: {
    key: 'compare',
    name: 'EquityPath Compare',
    description: 'Compare suburbs, builders or projects',
    href: '/compare',
  },
  reports: {
    key: 'reports',
    name: 'EquityPath Reports',
    description: 'Generate lender- or investor-ready PDFs',
    href: '/reports',
  },
} as const

export const toolsList: ToolMeta[] = Object.values(TOOLS)
