'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { downloadCsvFile, formatCurrencyAUD } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface LandscapingInputs {
  projectName: string
  totalLandSize: number
  includeLandCovering: boolean
  includeFencesWalls: boolean
  includeDriveway: boolean
  includeMajorFeatures: boolean
  includeOtherItems: boolean

  concreteArea: number
  concreteType: 'standard' | 'exposed' | 'colored'

  grassArea: number
  grassType: 'short' | 'long' | 'high'

  pavingArea: number
  pavingType: 'stone' | 'pavers' | 'porcelain'

  gardenArea: number
  gardenType: 'topsoil' | 'mix' | 'cypress'

  fenceLength: number
  fenceHeight: number
  fenceMaterial: 'timber' | 'aluminium' | 'colorbond'

  frontFenceLength: number
  frontFenceHeight: number
  frontFenceType: 'brick' | 'rendered' | 'aluminium' | 'steel'

  sideGateCount: number
  frontGateType: 'none' | 'swing' | 'sliding'
  garageGateType: 'none' | 'swing' | 'sliding'

  retainLength: number
  retainHeight: number
  retainMaterial: 'timber' | 'blocks' | 'stone'

  drivewaySize: number
  drivewayMaterial: 'concrete' | 'asphalt' | 'pavers' | 'gravel'

  poolL: number
  poolW: number
  poolD: number
  poolType: 'fiberglass' | 'concrete' | 'above'
  poolFenceType: 'glass' | 'aluminium' | 'steel' | 'timber'
  deckingType: 'travertine' | 'timber' | 'composite'

  pergolaSize: number
  pergolaMaterial: 'timber' | 'aluminium'

  outdoorKitchen: boolean
  firePit: boolean
  lighting: boolean
  lightingType: string
  waterFeatures: boolean
  comments: string
}

interface CostLine {
  item: string
  material: number
  labor: number
  total: number
  section: string
}

const DEFAULTS: LandscapingInputs = {
  projectName: 'Front/Backyard Plan',
  totalLandSize: 512,
  includeLandCovering: true,
  includeFencesWalls: true,
  includeDriveway: true,
  includeMajorFeatures: true,
  includeOtherItems: true,
  concreteArea: 96, // Updated: More realistic 96m² concrete area
  concreteType: 'standard',
  grassArea: 100, // Updated: More realistic 100m² grass area
  grassType: 'short',
  pavingArea: 25, // Updated: More realistic 25m² paving area
  pavingType: 'pavers',
  gardenArea: 50, // Updated: More realistic 50m² garden area
  gardenType: 'mix',
  fenceLength: 60, // Updated: More realistic 60m fence length
  fenceHeight: 1.8,
  fenceMaterial: 'colorbond',
  frontFenceLength: 12, // Updated: More realistic 12m front fence
  frontFenceHeight: 1.5, // Updated: More realistic 1.5m height
  frontFenceType: 'brick',
  sideGateCount: 1,
  frontGateType: 'none',
  garageGateType: 'none',
  retainLength: 15, // Updated: More realistic 15m retaining wall
  retainHeight: 0.8, // Updated: More realistic 0.8m height
  retainMaterial: 'blocks',
  drivewaySize: 40, // Updated: More realistic 40m² driveway
  drivewayMaterial: 'concrete',
  poolL: 8, // Updated: More realistic 8m length
  poolW: 4, // Updated: More realistic 4m width
  poolD: 1.8, // Updated: More realistic 1.8m depth
  poolType: 'fiberglass',
  poolFenceType: 'glass', // Added: Mandatory pool fencing type
  deckingType: 'travertine',
  pergolaSize: 18,
  pergolaMaterial: 'aluminium',
  outdoorKitchen: false,
  firePit: false,
  lighting: true,
  lightingType: 'garden lights package',
  waterFeatures: false,
  comments: '',
}

function currency(n: number): string {
  return formatCurrencyAUD(n)
}

export function LandscapingCalculator() {
  const [i, setI] = useState<LandscapingInputs>(DEFAULTS)
  const [costs, setCosts] = useState({
    CONCRETE: {
      standard: { material: 60, labor: 45 },
      exposed: { material: 80, labor: 75 },
      colored: { material: 70, labor: 65 },
    },
    GRASS: {
      short: { material: 45, labor: 45 }, // Fixed: $45/m² material only, $45/m² labor
      long: { material: 55, labor: 45 }, // Fixed: $55/m² material only, $55/m² labor
      high: { material: 65, labor: 45 }, // Fixed: $70/m² material only, $70/m² labor
    },
    PAVING: {
      stone: { material: 80, labor: 80 }, // Fixed: $80/m² material only, $80/m² labor
      pavers: { material: 50, labor: 60 }, // Fixed: $50/m² material only, $60/m² labor
      porcelain: { material: 90, labor: 90 }, // Fixed: $90/m² material only, $90/m² labor
    },
    GARDEN: {
      topsoil: { material: 20, labor: 20 }, // Fixed: $20/m² material only, $20/m² labor
      mix: { material: 25, labor: 25 }, // Fixed: $25/m² material only, $25/m² labor
      cypress: { material: 15, labor: 15 }, // Fixed: $15/m² material only, $15/m² labor
    },
    FENCE: {
      timber: { material: 80, labor: 80 }, // Fixed: $80/m material only, $80/m labor
      aluminium: { material: 120, labor: 110 }, // Fixed: $120/m material only, $110/m labor
      colorbond: { material: 100, labor: 90 }, // Fixed: $100/m material only, $90/m labor
    },
    FRONT_FENCE: {
      brick: { material: 250, labor: 280 }, // Fixed: $250/m material only, $280/m labor
      rendered: { material: 280, labor: 320 }, // Fixed: $280/m material only, $320/m labor
      aluminium: { material: 180, labor: 180 }, // Fixed: $180/m material only, $180/m labor
      steel: { material: 200, labor: 200 }, // Fixed: $200/m material only, $200/m labor
    },
    GATE: {
      side: { material: 800, labor: 400 }, // Updated: $800 material, $400 labor (was $250/$250)
      front_swing: { material: 1500, labor: 1200 }, // Fixed: $1,500 material only, $1,200 labor
      front_sliding: { material: 2200, labor: 1600 }, // Fixed: $2,200 material only, $1,600 labor
      garage_swing: { material: 1800, labor: 1300 }, // Fixed: $1,800 material only, $1,300 labor
      garage_sliding: { material: 2500, labor: 1800 }, // Fixed: $2,500 material only, $1,800 labor
    },
    RETAIN: {
      timber: { material: 120, labor: 150 }, // Fixed: $120/m material only, $150/m labor
      blocks: { material: 200, labor: 200 }, // Fixed: $200/m material only, $200/m labor
      stone: { material: 250, labor: 250 }, // Fixed: $250/m material only, $250/m labor
    },
    DRIVE: {
      concrete: { material: 60, labor: 80 }, // Fixed: $60/m² material only, $80/m² labor
      asphalt: { material: 40, labor: 50 }, // Fixed: $40/m² material only, $50/m² labor
      pavers: { material: 60, labor: 100 }, // Fixed: $60/m² material only, $100/m² labor
      gravel: { material: 20, labor: 30 }, // Fixed: $20/m² material only, $30/m² labor
    },
    DECK: {
      travertine: { material: 80, labor: 90 }, // Fixed: $80/m² material only, $90/m² labor
      timber: { material: 60, labor: 90 }, // Fixed: $60/m² material only, $90/m² labor
      composite: { material: 75, labor: 80 }, // Fixed: $75/m² material only, $80/m² labor
    },
    PERG: {
      timber: { material: 120, labor: 180 }, // Fixed: $120/m² material only, $180/m² labor
      aluminium: { material: 140, labor: 150 }, // Fixed: $140/m² material only, $150/m² labor
    },
    POOL_FENCE: {
      glass: { material: 300, labor: 150 }, // Pool fence: $300/m material, $150/m labor
      aluminium: { material: 180, labor: 120 }, // Pool fence: $180/m material, $120/m labor
      steel: { material: 200, labor: 130 }, // Pool fence: $200/m material, $130/m labor
      timber: { material: 120, labor: 100 }, // Pool fence: $120/m material, $100/m labor
    },
  })
  const [showCosts, setShowCosts] = useState<boolean>(false)

  function onNum<K extends keyof LandscapingInputs>(key: K, v: string) {
    const n = Number(v)
    setI((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : (prev[key] as number) }))
  }

  const lines: CostLine[] = useMemo(() => {
    const rows: CostLine[] = []

    // Unit cost tables (materials, labor)
    const CONCRETE: Record<LandscapingInputs['concreteType'], [number, number]> = {
      standard: [costs.CONCRETE.standard.material, costs.CONCRETE.standard.labor],
      exposed: [costs.CONCRETE.exposed.material, costs.CONCRETE.exposed.labor],
      colored: [costs.CONCRETE.colored.material, costs.CONCRETE.colored.labor],
    }
    const GRASS: Record<LandscapingInputs['grassType'], [number, number]> = {
      short: [costs.GRASS.short.material, costs.GRASS.short.labor],
      long: [costs.GRASS.long.material, costs.GRASS.long.labor],
      high: [costs.GRASS.high.material, costs.GRASS.high.labor],
    }
    const PAVING: Record<LandscapingInputs['pavingType'], [number, number]> = {
      stone: [costs.PAVING.stone.material, costs.PAVING.stone.labor],
      pavers: [costs.PAVING.pavers.material, costs.PAVING.pavers.labor],
      porcelain: [costs.PAVING.porcelain.material, costs.PAVING.porcelain.labor],
    }
    const GARDEN: Record<LandscapingInputs['gardenType'], [number, number]> = {
      topsoil: [costs.GARDEN.topsoil.material, costs.GARDEN.topsoil.labor],
      mix: [costs.GARDEN.mix.material, costs.GARDEN.mix.labor],
      cypress: [costs.GARDEN.cypress.material, costs.GARDEN.cypress.labor],
    }
    const FENCE: Record<LandscapingInputs['fenceMaterial'], [number, number]> = {
      timber: [costs.FENCE.timber.material, costs.FENCE.timber.labor],
      aluminium: [costs.FENCE.aluminium.material, costs.FENCE.aluminium.labor],
      colorbond: [costs.FENCE.colorbond.material, costs.FENCE.colorbond.labor],
    }
    const FRONT_FENCE: Record<LandscapingInputs['frontFenceType'], [number, number]> = {
      brick: [costs.FRONT_FENCE.brick.material, costs.FRONT_FENCE.brick.labor],
      rendered: [costs.FRONT_FENCE.rendered.material, costs.FRONT_FENCE.rendered.labor],
      aluminium: [costs.FRONT_FENCE.aluminium.material, costs.FRONT_FENCE.aluminium.labor],
      steel: [costs.FRONT_FENCE.steel.material, costs.FRONT_FENCE.steel.labor],
    }
    const RETAIN: Record<LandscapingInputs['retainMaterial'], [number, number]> = {
      timber: [costs.RETAIN.timber.material, costs.RETAIN.timber.labor],
      blocks: [costs.RETAIN.blocks.material, costs.RETAIN.blocks.labor],
      stone: [costs.RETAIN.stone.material, costs.RETAIN.stone.labor],
    }
    const DRIVE: Record<LandscapingInputs['drivewayMaterial'], [number, number]> = {
      concrete: [costs.DRIVE.concrete.material, costs.DRIVE.concrete.labor],
      asphalt: [costs.DRIVE.asphalt.material, costs.DRIVE.asphalt.labor],
      pavers: [costs.DRIVE.pavers.material, costs.DRIVE.pavers.labor],
      gravel: [costs.DRIVE.gravel.material, costs.DRIVE.gravel.labor],
    }
    const DECK: Record<LandscapingInputs['deckingType'], [number, number]> = {
      travertine: [costs.DECK.travertine.material, costs.DECK.travertine.labor],
      timber: [costs.DECK.timber.material, costs.DECK.timber.labor],
      composite: [costs.DECK.composite.material, costs.DECK.composite.labor],
    }
    const PERG: Record<LandscapingInputs['pergolaMaterial'], [number, number]> = {
      timber: [costs.PERG.timber.material, costs.PERG.timber.labor],
      aluminium: [costs.PERG.aluminium.material, costs.PERG.aluminium.labor],
    }

    // Calculations
    if (i.includeLandCovering && i.concreteArea > 0) {
      const [m, l] = CONCRETE[i.concreteType]
      rows.push(
        makeLine(
          `Concrete (${i.concreteType})`,
          i.concreteArea * m,
          i.concreteArea * l,
          'Land covering'
        )
      )
    }
    if (i.includeLandCovering && i.grassArea > 0) {
      const [m, l] = GRASS[i.grassType]
      rows.push(
        makeLine(
          `Artificial grass (${i.grassType})`,
          i.grassArea * m,
          i.grassArea * l,
          'Land covering'
        )
      )
    }
    if (i.includeLandCovering && i.pavingArea > 0) {
      const [m, l] = PAVING[i.pavingType]
      rows.push(
        makeLine(
          `Paving/Tiles (${i.pavingType})`,
          i.pavingArea * m,
          i.pavingArea * l,
          'Land covering'
        )
      )
    }
    if (i.includeLandCovering && i.gardenArea > 0) {
      const [m, l] = GARDEN[i.gardenType]
      rows.push(
        makeLine(
          `Garden beds (${i.gardenType})`,
          i.gardenArea * m,
          i.gardenArea * l,
          'Land covering'
        )
      )
    }

    if (i.includeFencesWalls && i.fenceLength > 0 && i.fenceHeight > 0) {
      const heightFactor = i.fenceHeight / 1.8
      const [m, l] = FENCE[i.fenceMaterial]
      rows.push(
        makeLine(
          `Fencing ${i.fenceHeight}m (${i.fenceMaterial})`,
          i.fenceLength * m * heightFactor,
          i.fenceLength * l * heightFactor,
          'Fences & walls'
        )
      )
    }

    if (i.includeFencesWalls && i.frontFenceLength > 0 && i.frontFenceHeight > 0) {
      const heightFactor = i.frontFenceHeight / 1.8
      const [m, l] = FRONT_FENCE[i.frontFenceType]
      rows.push(
        makeLine(
          `Front fence ${i.frontFenceHeight}m (${i.frontFenceType})`,
          i.frontFenceLength * m * heightFactor,
          i.frontFenceLength * l * heightFactor,
          'Fences & walls'
        )
      )
    }

    if (i.includeFencesWalls && i.retainLength > 0 && i.retainHeight > 0) {
      const [m, l] = RETAIN[i.retainMaterial]
      rows.push(
        makeLine(
          `Retaining wall ${i.retainHeight}m (${i.retainMaterial})`,
          i.retainLength * i.retainHeight * m,
          i.retainLength * i.retainHeight * l,
          'Fences & walls'
        )
      )
    }

    if (i.includeLandCovering && i.drivewaySize > 0) {
      const [m, l] = DRIVE[i.drivewayMaterial]
      rows.push(
        makeLine(
          `Driveway (${i.drivewayMaterial})`,
          i.drivewaySize * m,
          i.drivewaySize * l,
          'Land covering'
        )
      )
    }

    const poolArea = Math.max(0, i.poolL) * Math.max(0, i.poolW)
    if (i.includeMajorFeatures && poolArea > 0) {
      let m = 0
      let l = 0
      let fixed = 0
      if (i.poolType === 'fiberglass') {
        m = 1200 // Updated: $1,200/m² material cost
        l = 800 // Updated: $800/m² labor cost
        fixed = 15000 // Updated: $15,000 base installation cost
      } else if (i.poolType === 'concrete') {
        m = 1800 // Updated: $1,800/m² material cost
        l = 1200 // Updated: $1,200/m² labor cost
        fixed = 25000 // Updated: $25,000 base installation cost
      } else {
        m = 600 // Updated: $600/m² material cost (above ground)
        l = 400 // Updated: $400/m² labor cost
        fixed = 8000 // Updated: $8,000 base installation cost
      }
      const deckML = DECK[i.deckingType]
      const deckArea = poolArea * 0.5 // rough coping/deck allowance
      rows.push(
        makeLine(
          `Swimming pool (${i.poolType})`,
          poolArea * m + fixed,
          poolArea * l,
          'Major features'
        )
      )
      rows.push(
        makeLine(
          `Pool decking/coping (${i.deckingType})`,
          deckArea * deckML[0],
          deckArea * deckML[1],
          'Major features'
        )
      )

      // Mandatory pool fencing (required by law in Victoria)
      const poolPerimeter = 2 * (i.poolL + i.poolW) // Calculate perimeter for fencing
      const POOL_FENCE: Record<LandscapingInputs['poolFenceType'], [number, number]> = {
        glass: [costs.POOL_FENCE.glass.material, costs.POOL_FENCE.glass.labor],
        aluminium: [costs.POOL_FENCE.aluminium.material, costs.POOL_FENCE.aluminium.labor],
        steel: [costs.POOL_FENCE.steel.material, costs.POOL_FENCE.steel.labor],
        timber: [costs.POOL_FENCE.timber.material, costs.POOL_FENCE.timber.labor],
      }
      const [fenceM, fenceL] = POOL_FENCE[i.poolFenceType]
      rows.push(
        makeLine(
          `Pool safety fence (${i.poolFenceType}) - Mandatory`,
          poolPerimeter * fenceM,
          poolPerimeter * fenceL,
          'Major features'
        )
      )
    }

    if (i.includeMajorFeatures && i.pergolaSize > 0) {
      const [m, l] = PERG[i.pergolaMaterial]
      rows.push(
        makeLine(
          `Pergola/Patio (${i.pergolaMaterial})`,
          i.pergolaSize * m,
          i.pergolaSize * l,
          'Major features'
        )
      )
    }

    if (i.includeOtherItems && i.outdoorKitchen)
      rows.push(makeLine('Outdoor kitchen/BBQ', 12000, 4000, 'Other items')) // Updated: $12,000 material, $4,000 labor
    if (i.includeOtherItems && i.firePit) rows.push(makeLine('Fire pit', 2500, 1200, 'Other items')) // Updated: $2,500 material, $1,200 labor
    if (i.includeOtherItems && i.lighting)
      rows.push(makeLine(`Lighting (${i.lightingType || 'package'})`, 1800, 1200, 'Other items')) // Updated: $1,800 material, $1,200 labor
    if (i.includeOtherItems && i.waterFeatures)
      rows.push(makeLine('Water features', 4500, 2000, 'Other items')) // Updated: $4,500 material, $2,000 labor

    // Front brick/rendered/aluminium/steel fencing
    if (i.includeFencesWalls && i.frontFenceLength > 0 && i.frontFenceHeight > 0) {
      const heightFactor = i.frontFenceHeight / 1.8
      const FRONT_FENCE: Record<LandscapingInputs['frontFenceType'], [number, number]> = {
        brick: [costs.FRONT_FENCE.brick.material, costs.FRONT_FENCE.brick.labor],
        rendered: [costs.FRONT_FENCE.rendered.material, costs.FRONT_FENCE.rendered.labor],
        aluminium: [costs.FRONT_FENCE.aluminium.material, costs.FRONT_FENCE.aluminium.labor],
        steel: [costs.FRONT_FENCE.steel.material, costs.FRONT_FENCE.steel.labor],
      }
      const [m, l] = FRONT_FENCE[i.frontFenceType]
      rows.push(
        makeLine(
          `Front fence ${i.frontFenceHeight}m (${i.frontFenceType})`,
          i.frontFenceLength * m * heightFactor,
          i.frontFenceLength * l * heightFactor,
          'Fences & walls'
        )
      )
    }

    // Gates
    if (i.includeFencesWalls && i.sideGateCount > 0) {
      const u = costs.GATE.side
      rows.push(
        makeLine(
          `Side gate × ${i.sideGateCount}`,
          i.sideGateCount * u.material,
          i.sideGateCount * u.labor,
          'Fences & walls'
        )
      )
    }
    if (i.includeFencesWalls && i.frontGateType !== 'none') {
      const u = i.frontGateType === 'swing' ? costs.GATE.front_swing : costs.GATE.front_sliding
      rows.push(makeLine(`Front gate (${i.frontGateType})`, u.material, u.labor, 'Fences & walls'))
    }
    if (i.includeFencesWalls && i.garageGateType !== 'none') {
      const u = i.garageGateType === 'swing' ? costs.GATE.garage_swing : costs.GATE.garage_sliding
      rows.push(
        makeLine(`Garage gate (${i.garageGateType})`, u.material, u.labor, 'Fences & walls')
      )
    }

    return rows
  }, [i, costs])

  const totals = useMemo(() => {
    const material = lines.reduce((s, r) => s + r.material, 0)
    const labor = lines.reduce((s, r) => s + r.labor, 0)
    return { material, labor, total: material + labor }
  }, [lines])

  function downloadCsv(projectName: string, items: CostLine[]) {
    const header = ['Section', 'Item', 'Material', 'Labor', 'Total']
    const rows = items.map((r) => [
      r.section,
      r.item,
      r.material.toFixed(2),
      r.labor.toFixed(2),
      r.total.toFixed(2),
    ])
    downloadCsvFile(`${projectName || 'estimate'}.csv`, header, rows)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Landscaping Calculator
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate comprehensive landscaping costs for your project with detailed material and
          labor estimates
        </p>
      </div>

      {/* Main Calculator */}
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6 space-y-8">
          {/* Cost Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cost Settings</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCosts((v) => !v)}
                className="text-sm"
              >
                {showCosts ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            {showCosts ? (
              <CardContent className="grid md:grid-cols-2 gap-3 sm:gap-4">
                <CostEditor
                  title="Front fence $/m (× height factor)"
                  entries={[
                    ['brick', costs.FRONT_FENCE.brick],
                    ['rendered', costs.FRONT_FENCE.rendered],
                    ['aluminium', costs.FRONT_FENCE.aluminium],
                    ['steel', costs.FRONT_FENCE.steel],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      FRONT_FENCE: {
                        ...c.FRONT_FENCE,
                        [k]: { ...c.FRONT_FENCE[k as keyof typeof c.FRONT_FENCE], [f]: v },
                      },
                    }))
                  }
                />
                <CostEditor
                  title="Gates (unit cost)"
                  entries={[
                    ['side', costs.GATE.side],
                    ['front_swing', costs.GATE.front_swing],
                    ['front_sliding', costs.GATE.front_sliding],
                    ['garage_swing', costs.GATE.garage_swing],
                    ['garage_sliding', costs.GATE.garage_sliding],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      GATE: { ...c.GATE, [k]: { ...c.GATE[k as keyof typeof c.GATE], [f]: v } },
                    }))
                  }
                />
                <CostEditor
                  title="Concrete $/m²"
                  entries={[
                    ['standard', costs.CONCRETE.standard],
                    ['exposed', costs.CONCRETE.exposed],
                    ['colored', costs.CONCRETE.colored],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      CONCRETE: {
                        ...c.CONCRETE,
                        [k]: { ...c.CONCRETE[k as keyof typeof c.CONCRETE], [f]: v },
                      },
                    }))
                  }
                />
                <CostEditor
                  title="Artificial grass $/m²"
                  entries={[
                    ['short', costs.GRASS.short],
                    ['long', costs.GRASS.long],
                    ['high', costs.GRASS.high],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      GRASS: { ...c.GRASS, [k]: { ...c.GRASS[k as keyof typeof c.GRASS], [f]: v } },
                    }))
                  }
                />
                <CostEditor
                  title="Paving/Tiles $/m²"
                  entries={[
                    ['stone', costs.PAVING.stone],
                    ['pavers', costs.PAVING.pavers],
                    ['porcelain', costs.PAVING.porcelain],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      PAVING: {
                        ...c.PAVING,
                        [k]: { ...c.PAVING[k as keyof typeof c.PAVING], [f]: v },
                      },
                    }))
                  }
                />
                <CostEditor
                  title="Garden beds $/m²"
                  entries={[
                    ['topsoil', costs.GARDEN.topsoil],
                    ['mix', costs.GARDEN.mix],
                    ['cypress', costs.GARDEN.cypress],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      GARDEN: {
                        ...c.GARDEN,
                        [k]: { ...c.GARDEN[k as keyof typeof c.GARDEN], [f]: v },
                      },
                    }))
                  }
                />
                <CostEditor
                  title="Fencing $/m (× height factor)"
                  entries={[
                    ['timber', costs.FENCE.timber],
                    ['aluminium', costs.FENCE.aluminium],
                    ['colorbond', costs.FENCE.colorbond],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      FENCE: { ...c.FENCE, [k]: { ...c.FENCE[k as keyof typeof c.FENCE], [f]: v } },
                    }))
                  }
                />
                <CostEditor
                  title="Retaining wall $/m·h"
                  entries={[
                    ['timber', costs.RETAIN.timber],
                    ['blocks', costs.RETAIN.blocks],
                    ['stone', costs.RETAIN.stone],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      RETAIN: {
                        ...c.RETAIN,
                        [k]: { ...c.RETAIN[k as keyof typeof c.RETAIN], [f]: v },
                      },
                    }))
                  }
                />
                <CostEditor
                  title="Driveway $/m²"
                  entries={[
                    ['concrete', costs.DRIVE.concrete],
                    ['asphalt', costs.DRIVE.asphalt],
                    ['pavers', costs.DRIVE.pavers],
                    ['gravel', costs.DRIVE.gravel],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      DRIVE: { ...c.DRIVE, [k]: { ...c.DRIVE[k as keyof typeof c.DRIVE], [f]: v } },
                    }))
                  }
                />
                <CostEditor
                  title="Decking/coping $/m²"
                  entries={[
                    ['travertine', costs.DECK.travertine],
                    ['timber', costs.DECK.timber],
                    ['composite', costs.DECK.composite],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      DECK: { ...c.DECK, [k]: { ...c.DECK[k as keyof typeof c.DECK], [f]: v } },
                    }))
                  }
                />
                <CostEditor
                  title="Pergola/Patio $/m²"
                  entries={[
                    ['timber', costs.PERG.timber],
                    ['aluminium', costs.PERG.aluminium],
                  ]}
                  onChange={(k, f, v) =>
                    setCosts((c) => ({
                      ...c,
                      PERG: { ...c.PERG, [k]: { ...c.PERG[k as keyof typeof c.PERG], [f]: v } },
                    }))
                  }
                />
              </CardContent>
            ) : null}
          </div>

          {/* Project Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Information</h3>
                <div className="space-y-3">
                  <Field
                    label="Project Name"
                    value={i.projectName}
                    onChange={(v) => setI({ ...i, projectName: v })}
                    text
                    tooltip="Enter a descriptive name for your landscaping project"
                  />
                  <Field
                    label="Total Land Size"
                    value={i.totalLandSize}
                    onChange={(v) => onNum('totalLandSize', v)}
                    unit="m²"
                    tooltip="Total area of your property in square meters"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Land Covering</h3>
                <div className="space-y-3">
                  <ToggleRow
                    label="Include land covering"
                    checked={i.includeLandCovering}
                    onChange={(v) => setI({ ...i, includeLandCovering: v })}
                  />
                  <Field
                    label="Concrete area"
                    value={i.concreteArea}
                    onChange={(v) => onNum('concreteArea', v)}
                    unit="m²"
                    tooltip="Area to be covered with concrete paving"
                  />
                  <SelectRow
                    label="Concrete type"
                    value={i.concreteType}
                    onValueChange={(v) =>
                      setI({ ...i, concreteType: v as LandscapingInputs['concreteType'] })
                    }
                    options={[
                      ['standard', 'Standard'],
                      ['exposed', 'Exposed aggregate'],
                      ['colored', 'Colored'],
                    ]}
                    tooltip="Choose the type of concrete finish"
                  />

                  <Field
                    label="Artificial grass area"
                    value={i.grassArea}
                    onChange={(v) => onNum('grassArea', v)}
                    unit="m²"
                    tooltip="Area to be covered with artificial turf"
                  />
                  <SelectRow
                    label="Grass type"
                    value={i.grassType}
                    onValueChange={(v) =>
                      setI({ ...i, grassType: v as LandscapingInputs['grassType'] })
                    }
                    options={[
                      ['short', 'Short pile'],
                      ['long', 'Long pile'],
                      ['high', 'High density'],
                    ]}
                    tooltip="Different pile heights affect appearance and durability"
                  />

                  <Field
                    label="Paving/Tiles area"
                    value={i.pavingArea}
                    onChange={(v) => onNum('pavingArea', v)}
                    unit="m²"
                    tooltip="Area to be covered with paving stones or tiles"
                  />
                  <SelectRow
                    label="Paving/Tiles type"
                    value={i.pavingType}
                    onValueChange={(v) =>
                      setI({ ...i, pavingType: v as LandscapingInputs['pavingType'] })
                    }
                    options={[
                      ['stone', 'Natural stone'],
                      ['pavers', 'Concrete pavers'],
                      ['porcelain', 'Porcelain'],
                    ]}
                    tooltip="Material type affects cost and appearance"
                  />

                  <Field
                    label="Garden beds area"
                    value={i.gardenArea}
                    onChange={(v) => onNum('gardenArea', v)}
                    unit="m²"
                    tooltip="Area for garden beds and plantings"
                  />
                  <SelectRow
                    label="Soil/mulch"
                    value={i.gardenType}
                    onValueChange={(v) =>
                      setI({ ...i, gardenType: v as LandscapingInputs['gardenType'] })
                    }
                    options={[
                      ['topsoil', 'Topsoil'],
                      ['mix', 'Garden mix'],
                      ['cypress', 'Cypress mulch'],
                    ]}
                    tooltip="Type of soil or mulch for garden beds"
                  />

                  <Field
                    label="Driveway size"
                    value={i.drivewaySize}
                    onChange={(v) => onNum('drivewaySize', v)}
                    unit="m²"
                    tooltip="Total driveway area including parking spaces"
                  />
                  <SelectRow
                    label="Driveway material"
                    value={i.drivewayMaterial}
                    onValueChange={(v) =>
                      setI({ ...i, drivewayMaterial: v as LandscapingInputs['drivewayMaterial'] })
                    }
                    options={[
                      ['concrete', 'Concrete'],
                      ['asphalt', 'Asphalt'],
                      ['pavers', 'Pavers'],
                      ['gravel', 'Gravel'],
                    ]}
                    tooltip="Driveway material affects cost and durability"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Fences & Walls</h3>
                <div className="space-y-3">
                  <ToggleRow
                    label="Include fences & walls"
                    checked={i.includeFencesWalls}
                    onChange={(v) => setI({ ...i, includeFencesWalls: v })}
                  />
                  <Field
                    label="Fencing length"
                    value={i.fenceLength}
                    onChange={(v) => onNum('fenceLength', v)}
                    unit="m"
                    tooltip="Total length of fencing required"
                  />
                  <Field
                    label="Fencing height"
                    value={i.fenceHeight}
                    onChange={(v) => onNum('fenceHeight', v)}
                    unit="m"
                    tooltip="Height of the fence panels"
                  />
                  <SelectRow
                    label="Fencing material"
                    value={i.fenceMaterial}
                    onValueChange={(v) =>
                      setI({ ...i, fenceMaterial: v as LandscapingInputs['fenceMaterial'] })
                    }
                    options={[
                      ['timber', 'Timber'],
                      ['aluminium', 'Aluminium'],
                      ['colorbond', 'Colorbond'],
                    ]}
                    tooltip="Material affects cost, durability, and maintenance"
                  />

                  <Field
                    label="Front fence length"
                    value={i.frontFenceLength}
                    onChange={(v) => onNum('frontFenceLength', v)}
                    unit="m"
                    tooltip="Length of front boundary fence"
                  />
                  <Field
                    label="Front fence height"
                    value={i.frontFenceHeight}
                    onChange={(v) => onNum('frontFenceHeight', v)}
                    unit="m"
                    tooltip="Height of front fence (usually lower than side fences)"
                  />
                  <SelectRow
                    label="Front fence type"
                    value={i.frontFenceType}
                    onValueChange={(v) =>
                      setI({ ...i, frontFenceType: v as LandscapingInputs['frontFenceType'] })
                    }
                    options={[
                      ['brick', 'Brick'],
                      ['rendered', 'Rendered'],
                      ['aluminium', 'Aluminium'],
                      ['steel', 'Steel'],
                    ]}
                    tooltip="Front fence materials are typically more decorative"
                  />

                  <Field
                    label="Side gate count"
                    value={i.sideGateCount}
                    onChange={(v) => onNum('sideGateCount', v)}
                    unit="units"
                    tooltip="Number of side access gates needed"
                  />
                  <SelectRow
                    label="Front gate"
                    value={i.frontGateType}
                    onValueChange={(v) =>
                      setI({ ...i, frontGateType: v as LandscapingInputs['frontGateType'] })
                    }
                    options={[
                      ['none', 'None'],
                      ['swing', 'Swing gate'],
                      ['sliding', 'Sliding gate'],
                    ]}
                    tooltip="Front gate type affects cost and space requirements"
                  />
                  <SelectRow
                    label="Garage gate"
                    value={i.garageGateType}
                    onValueChange={(v) =>
                      setI({ ...i, garageGateType: v as LandscapingInputs['garageGateType'] })
                    }
                    options={[
                      ['none', 'None'],
                      ['swing', 'Swing gate'],
                      ['sliding', 'Sliding gate'],
                    ]}
                    tooltip="Garage gate for vehicle access"
                  />

                  <Field
                    label="Retaining wall length"
                    value={i.retainLength}
                    onChange={(v) => onNum('retainLength', v)}
                    unit="m"
                    tooltip="Total length of retaining walls"
                  />
                  <Field
                    label="Retaining wall height"
                    value={i.retainHeight}
                    onChange={(v) => onNum('retainHeight', v)}
                    unit="m"
                    tooltip="Average height of retaining walls"
                  />
                  <SelectRow
                    label="Retaining material"
                    value={i.retainMaterial}
                    onValueChange={(v) =>
                      setI({ ...i, retainMaterial: v as LandscapingInputs['retainMaterial'] })
                    }
                    options={[
                      ['timber', 'Timber sleepers'],
                      ['blocks', 'Concrete blocks'],
                      ['stone', 'Stone'],
                    ]}
                    tooltip="Retaining wall material affects cost and appearance"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Major Features</h3>
                <div className="space-y-3">
                  <ToggleRow
                    label="Include major features"
                    checked={i.includeMajorFeatures}
                    onChange={(v) => setI({ ...i, includeMajorFeatures: v })}
                  />
                  <Field
                    label="Pool length"
                    value={i.poolL}
                    onChange={(v) => onNum('poolL', v)}
                    unit="m"
                    tooltip="Length of the swimming pool"
                  />
                  <Field
                    label="Pool width"
                    value={i.poolW}
                    onChange={(v) => onNum('poolW', v)}
                    unit="m"
                    tooltip="Width of the swimming pool"
                  />
                  <Field
                    label="Pool depth"
                    value={i.poolD}
                    onChange={(v) => onNum('poolD', v)}
                    unit="m"
                    tooltip="Average depth of the swimming pool"
                  />
                  <SelectRow
                    label="Pool type"
                    value={i.poolType}
                    onValueChange={(v) =>
                      setI({ ...i, poolType: v as LandscapingInputs['poolType'] })
                    }
                    options={[
                      ['fiberglass', 'Fiberglass'],
                      ['concrete', 'Concrete'],
                      ['above', 'Above-ground'],
                    ]}
                    tooltip="Pool type significantly affects installation cost"
                  />
                  <SelectRow
                    label="Pool safety fence (Mandatory)"
                    value={i.poolFenceType}
                    onValueChange={(v) =>
                      setI({ ...i, poolFenceType: v as LandscapingInputs['poolFenceType'] })
                    }
                    options={[
                      ['glass', 'Glass'],
                      ['aluminium', 'Aluminium'],
                      ['steel', 'Steel'],
                      ['timber', 'Timber'],
                    ]}
                    tooltip="Pool fencing is mandatory by law in Victoria for safety compliance"
                  />
                  <SelectRow
                    label="Decking/coping"
                    value={i.deckingType}
                    onValueChange={(v) =>
                      setI({ ...i, deckingType: v as LandscapingInputs['deckingType'] })
                    }
                    options={[
                      ['travertine', 'Travertine'],
                      ['timber', 'Timber'],
                      ['composite', 'Composite'],
                    ]}
                    tooltip="Material for pool surround and coping"
                  />
                  <Field
                    label="Pergola size"
                    value={i.pergolaSize}
                    onChange={(v) => onNum('pergolaSize', v)}
                    unit="m²"
                    tooltip="Area covered by pergola or patio structure"
                  />
                  <SelectRow
                    label="Pergola material"
                    value={i.pergolaMaterial}
                    onValueChange={(v) =>
                      setI({ ...i, pergolaMaterial: v as LandscapingInputs['pergolaMaterial'] })
                    }
                    options={[
                      ['timber', 'Timber'],
                      ['aluminium', 'Aluminium'],
                    ]}
                    tooltip="Pergola frame material affects cost and maintenance"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Other Items</h3>
                <div className="space-y-3">
                  <ToggleRow
                    label="Include other items"
                    checked={i.includeOtherItems}
                    onChange={(v) => setI({ ...i, includeOtherItems: v })}
                  />
                  <ToggleRow
                    label="Outdoor kitchen/BBQ"
                    checked={i.outdoorKitchen}
                    onChange={(v) => setI({ ...i, outdoorKitchen: v })}
                  />
                  <ToggleRow
                    label="Fire pit"
                    checked={i.firePit}
                    onChange={(v) => setI({ ...i, firePit: v })}
                  />
                  <ToggleRow
                    label="Lighting"
                    checked={i.lighting}
                    onChange={(v) => setI({ ...i, lighting: v })}
                  />
                  {i.lighting ? (
                    <Field
                      label="Lighting type"
                      value={i.lightingType}
                      onChange={(v) => setI({ ...i, lightingType: v })}
                      text
                      tooltip="Specify the type of outdoor lighting package"
                    />
                  ) : null}
                  <ToggleRow
                    label="Water features"
                    checked={i.waterFeatures}
                    onChange={(v) => setI({ ...i, waterFeatures: v })}
                  />
                  <Field
                    label="Additional comments"
                    value={i.comments}
                    onChange={(v) => setI({ ...i, comments: v })}
                    text
                    tooltip="Add any additional notes or special requirements"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Cost Estimate</h3>
              <Button
                onClick={() => downloadCsv(i.projectName, lines)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Export CSV
              </Button>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Project: <span className="font-semibold">{i.projectName || 'Untitled'}</span>
            </div>

            {lines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No items entered. Please fill in the form above to see estimates.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Totals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {currency(totals.material)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Materials</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {currency(totals.labor)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Labor</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">
                      {currency(totals.total)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total</div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3">
                  {['Land covering', 'Fences & walls', 'Major features', 'Other items'].map(
                    (section) => {
                      const rows = lines.filter((x) => x.section === section)
                      if (rows.length === 0) return null
                      return (
                        <div key={section} className="bg-white rounded-lg p-3 shadow-sm">
                          <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                            {section}
                          </h4>
                          <div className="space-y-2">
                            {/* Mobile headers */}
                            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 sm:hidden">
                              <div>Item</div>
                              <div className="text-right">Material</div>
                              <div className="text-right">Labor</div>
                              <div className="text-right">Total</div>
                            </div>
                            {rows.map((r, idx) => (
                              <div
                                key={`${r.item}-${idx}`}
                                className="grid grid-cols-4 items-center gap-2 py-2 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="text-xs sm:text-sm text-gray-700 truncate">
                                  {r.item}
                                </div>
                                <div className="text-xs sm:text-sm text-right text-green-600">
                                  {currency(r.material)}
                                </div>
                                <div className="text-xs sm:text-sm text-right text-blue-600">
                                  {currency(r.labor)}
                                </div>
                                <div className="text-xs sm:text-sm text-right font-semibold text-gray-800">
                                  {currency(r.total)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function makeLine(item: string, material: number, labor: number, section: string): CostLine {
  return { item, material, labor, total: material + labor, section }
}

function Field({
  label,
  value,
  onChange,
  text,
  step,
  tooltip,
  unit,
}: {
  label: string
  value: number | string
  onChange: (v: string) => void
  text?: boolean
  step?: string
  tooltip?: string
  unit?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {unit && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{unit}</span>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onClick={(e) => e.preventDefault()}
                >
                  i
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs z-50"
                side="top"
                align="center"
              >
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        type={text ? 'text' : 'number'}
        value={value}
        step={step ?? '1'}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  )
}

function SelectRow({
  label,
  value,
  onValueChange,
  options,
  tooltip,
  unit,
}: {
  label: string
  value: string
  onValueChange: (v: string) => void
  options: Array<[string, string]>
  tooltip?: string
  unit?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {unit && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{unit}</span>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onClick={(e) => e.preventDefault()}
                >
                  i
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-gray-900 text-white border-gray-700 shadow-xl max-w-xs z-50"
                side="top"
                align="center"
              >
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300 shadow-xl">
          {options.map(([val, labelText]) => (
            <SelectItem key={val} value={val} className="text-sm hover:bg-gray-50">
              {labelText}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      {label}
    </label>
  )
}

function CostEditor({
  title,
  entries,
  onChange,
}: {
  title: string
  entries: Array<[string, { material: number; labor: number }]>
  onChange: (key: string, field: 'material' | 'labor', value: number) => void
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([key, val]) => (
          <div key={key} className="space-y-2">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{key}</div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={val.material}
                onChange={(e) => onChange(key, 'material', Number(e.currentTarget.value) || 0)}
                className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs"
                placeholder="Material"
              />
              <Input
                type="number"
                value={val.labor}
                onChange={(e) => onChange(key, 'labor', Number(e.currentTarget.value) || 0)}
                className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs"
                placeholder="Labor"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export type LandscapingCalculatorProps = object
