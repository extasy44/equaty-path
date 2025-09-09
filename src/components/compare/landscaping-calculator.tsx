/* eslint-disable prettier/prettier */
'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  concreteArea: 96,
  concreteType: 'standard',
  grassArea: 128,
  grassType: 'short',
  pavingArea: 30,
  pavingType: 'pavers',
  gardenArea: 64,
  gardenType: 'mix',
  fenceLength: 72,
  fenceHeight: 1.8,
  fenceMaterial: 'colorbond',
  frontFenceLength: 10,
  frontFenceHeight: 1.2,
  frontFenceType: 'brick',
  sideGateCount: 1,
  frontGateType: 'none',
  garageGateType: 'none',
  retainLength: 10,
  retainHeight: 0.6,
  retainMaterial: 'blocks',
  drivewaySize: 35,
  drivewayMaterial: 'concrete',
  poolL: 7,
  poolW: 3,
  poolD: 1.6,
  poolType: 'fiberglass',
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
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function LandscapingCalculator() {
  const [i, setI] = useState<LandscapingInputs>(DEFAULTS)
  const [costs, setCosts] = useState({
    CONCRETE: {
      standard: { material: 110, labor: 60 },
      exposed: { material: 150, labor: 80 },
      colored: { material: 130, labor: 70 },
    },
    GRASS: {
      short: { material: 70, labor: 35 },
      long: { material: 90, labor: 40 },
      high: { material: 120, labor: 50 },
    },
    PAVING: {
      stone: { material: 120, labor: 60 },
      pavers: { material: 80, labor: 45 },
      porcelain: { material: 140, labor: 70 },
    },
    GARDEN: {
      topsoil: { material: 30, labor: 15 },
      mix: { material: 40, labor: 20 },
      cypress: { material: 25, labor: 10 },
    },
    FENCE: {
      timber: { material: 120, labor: 60 },
      aluminium: { material: 180, labor: 90 },
      colorbond: { material: 150, labor: 75 },
    },
    FRONT_FENCE: {
      brick: { material: 380, labor: 220 },
      rendered: { material: 420, labor: 260 },
      aluminium: { material: 260, labor: 140 },
      steel: { material: 300, labor: 160 },
    },
    GATE: {
      side: { material: 350, labor: 180 },
      front_swing: { material: 2200, labor: 900 },
      front_sliding: { material: 3200, labor: 1200 },
      garage_swing: { material: 2400, labor: 1000 },
      garage_sliding: { material: 3600, labor: 1400 },
    },
    RETAIN: {
      timber: { material: 200, labor: 120 },
      blocks: { material: 300, labor: 150 },
      stone: { material: 380, labor: 190 },
    },
    DRIVE: {
      concrete: { material: 110, labor: 60 },
      asphalt: { material: 70, labor: 40 },
      pavers: { material: 100, labor: 80 },
      gravel: { material: 35, labor: 25 },
    },
    DECK: {
      travertine: { material: 130, labor: 70 },
      timber: { material: 100, labor: 70 },
      composite: { material: 120, labor: 60 },
    },
    PERG: {
      timber: { material: 180, labor: 140 },
      aluminium: { material: 200, labor: 120 },
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

    if (i.includeDriveway && i.drivewaySize > 0) {
      const [m, l] = DRIVE[i.drivewayMaterial]
      rows.push(
        makeLine(
          `Driveway (${i.drivewayMaterial})`,
          i.drivewaySize * m,
          i.drivewaySize * l,
          'Driveway'
        )
      )
    }

    const poolArea = Math.max(0, i.poolL) * Math.max(0, i.poolW)
    if (i.includeMajorFeatures && poolArea > 0) {
      let m = 0
      let l = 0
      let fixed = 0
      if (i.poolType === 'fiberglass') {
        m = 800
        l = 400
        fixed = 5000
      } else if (i.poolType === 'concrete') {
        m = 1000
        l = 600
        fixed = 8000
      } else {
        m = 300
        l = 200
        fixed = 2000
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
      rows.push(makeLine('Outdoor kitchen/BBQ', 6000, 2000, 'Other items'))
    if (i.includeOtherItems && i.firePit) rows.push(makeLine('Fire pit', 800, 400, 'Other items'))
    if (i.includeOtherItems && i.lighting)
      rows.push(makeLine(`Lighting (${i.lightingType || 'package'})`, 900, 600, 'Other items'))
    if (i.includeOtherItems && i.waterFeatures)
      rows.push(makeLine('Water features', 1800, 700, 'Other items'))

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
    const csv = [header, ...rows]
      .map((cols) => cols.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'estimate'}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="ring-1 ring-black/5">
      <CardHeader>
        <CardTitle>Landscaping Calculator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Cost settings (per unit)</CardTitle>
              <Button variant="secondary" className="h-8" onClick={() => setShowCosts((v) => !v)}>
                {showCosts ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showCosts ? (
            <CardContent className="grid md:grid-cols-2 gap-4">
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
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <SectionLabel>Project</SectionLabel>
            <Field
              label="Project name"
              value={i.projectName}
              onChange={(v) => setI({ ...i, projectName: v })}
              text
            />
            <Field
              label="Total land size"
              value={i.totalLandSize}
              onChange={(v) => onNum('totalLandSize', v)}
            />

            <SectionLabel>Land covering</SectionLabel>
            <ToggleRow
              label="Include land covering"
              checked={i.includeLandCovering}
              onChange={(v) => setI({ ...i, includeLandCovering: v })}
            />
            <Field
              label="Concrete area"
              value={i.concreteArea}
              onChange={(v) => onNum('concreteArea', v)}
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
            />

            <Field
              label="Artificial grass area"
              value={i.grassArea}
              onChange={(v) => onNum('grassArea', v)}
            />
            <SelectRow
              label="Grass type"
              value={i.grassType}
              onValueChange={(v) => setI({ ...i, grassType: v as LandscapingInputs['grassType'] })}
              options={[
                ['short', 'Short pile'],
                ['long', 'Long pile'],
                ['high', 'High density'],
              ]}
            />

            <Field
              label="Paving/Tiles area"
              value={i.pavingArea}
              onChange={(v) => onNum('pavingArea', v)}
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
            />

            <Field
              label="Garden beds area"
              value={i.gardenArea}
              onChange={(v) => onNum('gardenArea', v)}
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
            />
          </div>

          <div className="grid gap-3">
            <SectionLabel>Fences & walls</SectionLabel>
            <ToggleRow
              label="Include fences & walls"
              checked={i.includeFencesWalls}
              onChange={(v) => setI({ ...i, includeFencesWalls: v })}
            />
            <Field
              label="Fencing length"
              value={i.fenceLength}
              onChange={(v) => onNum('fenceLength', v)}
            />
            <Field
              label="Fencing height"
              value={i.fenceHeight}
              onChange={(v) => onNum('fenceHeight', v)}
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
            />

            <SectionLabel>Front fence</SectionLabel>
            <Field
              label="Front fence length"
              value={i.frontFenceLength}
              onChange={(v) => onNum('frontFenceLength', v)}
            />
            <Field
              label="Front fence height"
              value={i.frontFenceHeight}
              onChange={(v) => onNum('frontFenceHeight', v)}
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
            />

            <SectionLabel>Gates</SectionLabel>
            <Field
              label="Side gate count"
              value={i.sideGateCount}
              onChange={(v) => onNum('sideGateCount', v)}
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
            />

            <Field
              label="Retaining wall length"
              value={i.retainLength}
              onChange={(v) => onNum('retainLength', v)}
            />
            <Field
              label="Retaining wall height"
              value={i.retainHeight}
              onChange={(v) => onNum('retainHeight', v)}
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
            />

            <SectionLabel>Driveway</SectionLabel>
            <ToggleRow
              label="Include driveway"
              checked={i.includeDriveway}
              onChange={(v) => setI({ ...i, includeDriveway: v })}
            />
            <Field
              label="Driveway size"
              value={i.drivewaySize}
              onChange={(v) => onNum('drivewaySize', v)}
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
            />

            <SectionLabel>Major features</SectionLabel>
            <ToggleRow
              label="Include major features"
              checked={i.includeMajorFeatures}
              onChange={(v) => setI({ ...i, includeMajorFeatures: v })}
            />
            <Field label="Pool length" value={i.poolL} onChange={(v) => onNum('poolL', v)} />
            <Field label="Pool width" value={i.poolW} onChange={(v) => onNum('poolW', v)} />
            <Field label="Pool depth" value={i.poolD} onChange={(v) => onNum('poolD', v)} />
            <SelectRow
              label="Pool type"
              value={i.poolType}
              onValueChange={(v) => setI({ ...i, poolType: v as LandscapingInputs['poolType'] })}
              options={[
                ['fiberglass', 'Fiberglass'],
                ['concrete', 'Concrete'],
                ['above', 'Above-ground'],
              ]}
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
            />
          </div>
        </div>

        <div className="grid gap-3">
          <SectionLabel>Other items</SectionLabel>
          <ToggleRow
            label="Include other items"
            checked={i.includeOtherItems}
            onChange={(v) => setI({ ...i, includeOtherItems: v })}
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={i.outdoorKitchen}
              onChange={(e) => setI({ ...i, outdoorKitchen: e.currentTarget.checked })}
            />
            Outdoor kitchen/BBQ
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={i.firePit}
              onChange={(e) => setI({ ...i, firePit: e.currentTarget.checked })}
            />
            Fire pit
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={i.lighting}
              onChange={(e) => setI({ ...i, lighting: e.currentTarget.checked })}
            />
            Lighting
          </label>
          {i.lighting ? (
            <Field
              label="Lighting type"
              value={i.lightingType}
              onChange={(v) => setI({ ...i, lightingType: v })}
              text
            />
          ) : null}
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={i.waterFeatures}
              onChange={(e) => setI({ ...i, waterFeatures: e.currentTarget.checked })}
            />
            Water features
          </label>
          <Field
            label="Additional comments"
            value={i.comments}
            onChange={(v) => setI({ ...i, comments: v })}
            text
          />
        </div>

        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="text-base">Estimate breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                Project: <span className="font-semibold">{i.projectName || 'Untitled'}</span>
              </div>
              <Button className="h-8" onClick={() => downloadCsv(i.projectName, lines)}>
                Export CSV
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Current market unit rates drive the initial cost below.
            </div>
            {lines.length === 0 ? (
              <div className="text-muted-foreground">No items entered.</div>
            ) : null}
            <div className="grid grid-cols-[1fr_120px_120px_120px] items-center gap-3 text-xs text-muted-foreground">
              <div>Item</div>
              <div className="text-right">Material</div>
              <div className="text-right">Labor</div>
              <div className="text-right">Total</div>
            </div>
            {['Land covering', 'Fences & walls', 'Driveway', 'Major features', 'Other items'].map(
              (section) => {
                const rows = lines.filter((x) => x.section === section)
                if (rows.length === 0) return null
                return (
                  <div key={section} className="grid gap-1">
                    <div className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                      {section}
                    </div>
                    {rows.map((r, idx) => (
                      <div
                        key={`${r.item}-${idx}`}
                        className="grid grid-cols-[1fr_120px_120px_120px] items-center gap-3"
                      >
                        <div className="truncate">{r.item}</div>
                        <div className="tabular-nums text-right">{currency(r.material)}</div>
                        <div className="tabular-nums text-right">{currency(r.labor)}</div>
                        <div className="tabular-nums text-right font-medium">
                          {currency(r.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            )}
            <div className="h-px bg-border my-2" />
            <div className="grid grid-cols-[1fr_120px_120px_120px] items-center gap-3 font-semibold">
              <div>Total</div>
              <div className="tabular-nums text-right">{currency(totals.material)}</div>
              <div className="tabular-nums text-right">{currency(totals.labor)}</div>
              <div className="tabular-nums text-right">{currency(totals.total)}</div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
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
}: {
  label: string
  value: number | string
  onChange: (v: string) => void
  text?: boolean
  step?: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input
        type={text ? 'text' : 'number'}
        value={value}
        step={step ?? '1'}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  )
}

function SelectRow({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (v: string) => void
  options: Array<[string, string]>
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 bg-white border border-black/10 shadow-sm">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-black/10 shadow-[var(--shadow-soft)]">
          {options.map(([val, labelText]) => (
            <SelectItem key={val} value={val}>
              {labelText}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{children}</div>
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
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4"
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
    <div className="grid gap-2 p-3 rounded-md border border-black/5">
      <div className="text-sm font-medium">{title}</div>
      <div className="grid grid-cols-2 gap-2">
        {entries.map(([key, val]) => (
          <div key={key} className="grid gap-1">
            <div className="text-xs text-muted-foreground">{key}</div>
            <div className="grid grid-cols-2 gap-1">
              <Input
                type="number"
                value={val.material}
                onChange={(e) => onChange(key, 'material', Number(e.currentTarget.value) || 0)}
              />
              <Input
                type="number"
                value={val.labor}
                onChange={(e) => onChange(key, 'labor', Number(e.currentTarget.value) || 0)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export type LandscapingCalculatorProps = object
