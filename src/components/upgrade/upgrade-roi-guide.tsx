'use client'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UpgradeRoiGuide({
  showHeader = true,
  showToc = true,
  className,
}: UpgradeRoiGuideProps) {
  const navRef = useRef<HTMLElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [azItems, setAzItems] = useState<
    Array<{ item: string; sectionTitle: string; href: string }>
  >([])

  useEffect(() => {
    if (!navRef.current) return
    const el = navRef.current
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      const href = anchor?.getAttribute('href') || ''
      if (!anchor || !href.startsWith('#')) return
      e.preventDefault()
      const id = href.slice(1)
      const section = document.getElementById(id)
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (!rootRef.current) return
    const rows = Array.from(
      rootRef.current.querySelectorAll('tr[data-roi-item]')
    ) as HTMLTableRowElement[]
    const items = rows.map((row) => ({
      item: row.getAttribute('data-roi-item') || '',
      sectionTitle: row.getAttribute('data-roi-section-title') || '',
      href: `#${row.id}`,
    }))
    items.sort((a, b) => a.item.localeCompare(b.item))
    setAzItems(items)
  }, [])

  return (
    <div ref={rootRef} className={className}>
      {showHeader ? (
        <header className="mb-3 sm:mb-4 md:mb-6 text-center md:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--color-primary)]">
            Upgrade ROI Guide
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
            Indicative return-on-investment ranges for common new‑build upgrades. Values are general
            guidance only and vary by market, build quality and buyer segment.
          </p>
        </header>
      ) : null}

      {showToc ? (
        <nav ref={navRef} aria-label="Contents" className="mb-3 sm:mb-4 md:mb-6">
          <div className="text-xs sm:text-sm font-semibold mb-1.5">On this page</div>
          <div className="grid gap-1.5 sm:gap-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                By area
              </div>
              <ul className="flex flex-wrap gap-0.5 sm:gap-1 text-xs sm:text-sm">
                <li>
                  <a className="underline underline-offset-4 hover:no-underline" href="#bathrooms">
                    Bathrooms
                  </a>
                </li>
                <li>
                  <a className="underline underline-offset-4 hover:no-underline" href="#ensuite">
                    Ensuite
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#floors-stairs"
                  >
                    Floors & Stairs
                  </a>
                </li>
                <li>
                  <a className="underline underline-offset-4 hover:no-underline" href="#kitchen">
                    Kitchen
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#laundry-utility"
                  >
                    Laundry & Utility
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#outdoor-landscaping"
                  >
                    Outdoor & Landscaping
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#stairs-double-storey"
                  >
                    Stairs (Double‑Storey)
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#windows-frames"
                  >
                    Windows & Frames
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                By feature
              </div>
              <ul className="flex flex-wrap gap-0.5 sm:gap-1 text-xs sm:text-sm">
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#architraves-skirtings"
                  >
                    Architraves & Skirtings
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#drawers-vs-doors"
                  >
                    Cabinetry: Drawers vs Doors
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#concrete-hardscapes"
                  >
                    Concrete & Hardscapes
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#cornices-ceilings"
                  >
                    Cornices & Ceilings
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#door-finishes"
                  >
                    Door Finishes
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#doors-profiles-colours"
                  >
                    Doors, Profiles & Colours
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#electrical-av"
                  >
                    Electrical & AV
                  </a>
                </li>
                <li>
                  <a className="underline underline-offset-4 hover:no-underline" href="#facade">
                    Facade & Street Appeal
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#feature-walls-niches"
                  >
                    Feature Walls & Niches
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#garage-storage"
                  >
                    Garage & Storage
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#interior-balance"
                  >
                    Interior Balance & Styling
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#kitchen-configurations"
                  >
                    Kitchen Configurations
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#lighting-electrical"
                  >
                    Lighting & Electrical
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#practical-layouts"
                  >
                    Layout & Space Planning
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#heating-cooling"
                  >
                    Heating & Cooling
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#security-comfort"
                  >
                    Security & Comfort
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#structural-layout"
                  >
                    Structural & Layout
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#void-spaces"
                  >
                    Void Spaces & Double‑Height
                  </a>
                </li>
                <li>
                  <a
                    className="underline underline-offset-4 hover:no-underline"
                    href="#solar-battery"
                  >
                    Solar & Battery
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      ) : null}

      <div className="grid gap-4 sm:gap-5 md:gap-6">
        <RoiCategory
          id="kitchen"
          title="Kitchen"
          items={[
            {
              item: 'Cabinetry (soft close, full height)',
              costImpact: '$$–$$$',
              roiRange: '60–120%',
              notes: 'Highest impact area. Focus on functionality and storage.',
            },
            {
              item: 'Stone benchtops (engineered 20–40mm)',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Popular; durable and perceived premium.',
            },
            {
              item: 'Appliances (mid-premium brands)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Match spec to target buyer; integrated where layout benefits.',
            },
            {
              item: 'Tapware and sink upgrades',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Good visual return for modest cost.',
            },
          ]}
        />

        <RoiCategory
          id="bathrooms"
          title="Bathrooms"
          items={[
            {
              item: 'Full-height tiles to wet areas',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Strong perceived quality; waterproofing remains critical.',
            },
            {
              item: 'Vanities and basins',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Floating vanities improve space feel; stone tops add value.',
            },
            {
              item: 'Tapware and shower heads',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Match finish set across rooms for cohesion.',
            },
            {
              item: 'Frameless shower screens',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Clean aesthetic; ensure easy maintenance hardware.',
            },
          ]}
        />

        <RoiCategory
          id="ensuite"
          title="Ensuite"
          items={[
            {
              item: 'Double vanity',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Improves utility and premium feel.',
            },
            {
              item: 'Full-height tiles',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Premium waterproofed finish; easy cleaning.',
            },
            {
              item: 'Heated towel rails',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Comfort upgrade; low running cost.',
            },
            {
              item: 'Shower niche and dual rail',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Practical storage and comfort.',
            },
          ]}
        />

        <RoiCategory
          id="floors-stairs"
          title="Floors & Stairs"
          items={[
            {
              item: 'Hybrid/LVP to living',
              costImpact: '$$',
              roiRange: '50–110%',
              notes: 'Durable, water‑resistant; wide planks trend well.',
            },
            {
              item: 'Timber stairs with open risers',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Feature element; ensure compliance on riser gaps.',
            },
            {
              item: 'Carpet upgrade (stairs/bedrooms)',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Mid‑premium pile and underlay lift feel notably.',
            },
          ]}
        />

        <RoiCategory
          id="doors-hardware"
          title="Doors & Hardware"
          items={[
            {
              item: 'Oversized entry door',
              costImpact: '$$',
              roiRange: '40–90%',
              notes: 'Street appeal boost; pair with quality handle set.',
            },
            {
              item: 'Internal door hardware (levers/hinges)',
              costImpact: '$',
              roiRange: '30–70%',
              notes: 'Consistent finish across the home improves cohesion.',
            },
          ]}
        />

        <RoiCategory
          id="lighting-electrical"
          title="Lighting & Electrical"
          items={[
            {
              item: 'LED downlights and feature pendants',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Layered lighting adds perceived value.',
            },
            {
              item: 'Additional GPOs/USB points',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Functional uplift; focus on kitchen/bedside/study.',
            },
            {
              item: 'Smart switches (select areas)',
              costImpact: '$$',
              roiRange: '30–70%',
              notes: 'Target living and facade lighting for effect.',
            },
          ]}
        />

        <RoiCategory
          id="security-comfort"
          title="Security & Comfort"
          items={[
            {
              item: 'Ducted AC zoning',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Higher utility when zones match living/bed/basement use.',
            },
            {
              item: 'Alarm + doorbell camera',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Perceived safety; easy add for most buyers.',
            },
          ]}
        />

        <RoiCategory
          id="heating-cooling"
          title="Heating & Cooling"
          items={[
            {
              item: 'Evaporative cooling',
              costImpact: '$$–$$$',
              roiRange: '30–70%',
              notes: 'Dry climates only; low running costs.',
            },
            {
              item: 'Refrigerated (split/ducted, inverter)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Efficient comfort across climates.',
            },
            {
              item: 'Zoned temperature control',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Cuts running costs; improves comfort.',
            },
          ]}
        />

        <RoiCategory
          id="outdoor-landscaping"
          title="Outdoor & Landscaping"
          items={[
            {
              item: 'Concrete/stone paths and alfresco',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Extends living; weather‑resistant surfaces matter.',
            },
            {
              item: 'Basic turf and garden beds',
              costImpact: '$–$$',
              roiRange: '50–120%',
              notes: 'High curb appeal per dollar when neat and low‑maintenance.',
            },
            {
              item: 'Fencing and side gates',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Privacy and security; match streetscape where possible.',
            },
          ]}
        />

        <RoiCategory
          id="fencing-gates"
          title="Fencing & Gates"
          items={[
            {
              item: 'Brick/rendered front fence',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Premium street appeal; check council height and openness rules.',
            },
            {
              item: 'Sliding driveway gate (motorised)',
              costImpact: '$$–$$$',
              roiRange: '40–80%',
              notes: 'Space‑efficient; adds security and prestige.',
            },
            {
              item: 'Swing driveway gate (motorised)',
              costImpact: '$$–$$$',
              roiRange: '30–70%',
              notes: 'Needs swing clearance; pair with matching pedestrian gate.',
            },
          ]}
        />

        <RoiCategory
          id="concrete-hardscapes"
          title="Concrete & Hardscapes"
          items={[
            {
              item: 'Driveway concrete (exposed aggregate)',
              costImpact: '$$–$$$',
              roiRange: '50–100%',
              notes: 'Durable and premium finish; choose neutral tones.',
            },
            {
              item: 'Coloured/stencilled concrete paths',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Cost‑effective uplift; avoid busy patterns.',
            },
            {
              item: 'Porcelain pavers on pedestals (alfresco)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Great drainage and maintenance profile.',
            },
          ]}
        />

        <RoiCategory
          id="garage-storage"
          title="Garage & Storage"
          items={[
            {
              item: 'Epoxy garage floor (flake/UV‑stable)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Durable, clean finish; chemical resistant.',
            },
            {
              item: 'Overhead racks/cabinet storage',
              costImpact: '$–$$',
              roiRange: '40–100%',
              notes: 'Clutter reduction; buyer friendly.',
            },
            {
              item: 'Third car bay (tandem/drive‑through)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Adds utility; ensure site allows.',
            },
          ]}
        />

        <RoiCategory
          id="doors-profiles-colours"
          title="Doors, Profiles & Colours"
          items={[
            {
              item: 'Profiled internal doors (shaker/vee‑groove)',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Adds texture and style with minimal cost.',
            },
            {
              item: 'Premium front door (pivot/oversized)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'High impact at entry; ensure suitable hardware.',
            },
            {
              item: 'Cohesive colour scheme (whites + warm neutrals)',
              costImpact: '$',
              roiRange: '50–120%',
              notes: 'Timeless palettes broaden buyer appeal.',
            },
          ]}
        />

        <RoiCategory
          id="door-finishes"
          title="Door Finishes"
          items={[
            {
              item: '2‑pack polyurethane finish',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Crisp edges and repairable; higher cost than laminate.',
            },
            {
              item: 'Thermofoil/laminate finish',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Economical and durable; avoid tight radius profiles.',
            },
            {
              item: 'Timber veneer',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Natural texture; pair with durable clear coatings.',
            },
          ]}
        />

        <RoiCategory
          id="electrical-av"
          title="Electrical & AV"
          items={[
            {
              item: 'Extra circuits and GPOs (kitchen/study/garage)',
              costImpact: '$',
              roiRange: '40–90%',
              notes: 'Future‑proofing; reduces extension leads and rework.',
            },
            {
              item: 'Data points + Wi‑Fi access points (ceiling)',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Better coverage than router‑only setups.',
            },
            {
              item: 'Pre‑wire for EV charger and solar',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Saves retrofit costs; strong sustainability signal.',
            },
            {
              item: 'TV/media conduit + recessed power',
              costImpact: '$',
              roiRange: '40–90%',
              notes: 'Hides cables for wall‑mounted TVs; low cost, high utility.',
            },
          ]}
        />

        <RoiCategory
          id="solar-battery"
          title="Solar & Battery"
          items={[
            {
              item: '5–10kW solar PV array',
              costImpact: '$$–$$$',
              roiRange: '40–100%',
              notes: 'Cuts bills; appeals to sustainability‑minded buyers.',
            },
            {
              item: 'Hybrid/inverter sizing (5–10kW)',
              costImpact: '$$',
              roiRange: '40–90%',
              notes: 'Right-size to consumption and export limits.',
            },
            {
              item: '10–13kWh battery storage',
              costImpact: '$$–$$$',
              roiRange: '30–80%',
              notes: 'Improves self‑consumption; backup capability.',
            },
            {
              item: 'Smart meter/export limiting',
              costImpact: '$–$$',
              roiRange: '30–70%',
              notes: 'Grid compliance and better monitoring.',
            },
          ]}
        />

        <RoiCategory
          id="laundry-utility"
          title="Laundry & Utility"
          items={[
            {
              item: 'Tall broom + linen cupboards',
              costImpact: '$–$$',
              roiRange: '50–110%',
              notes: 'Storage sells; plan for vac/mops/irons.',
            },
            {
              item: 'Overheads + hanging rail',
              costImpact: '$–$$',
              roiRange: '50–100%',
              notes: 'Improves workflow and bench space.',
            },
            {
              item: 'Laundry chute (double‑storey)',
              costImpact: '$$',
              roiRange: '40–80%',
              notes: 'Convenience feature; ensure safe routing.',
            },
          ]}
        />

        <RoiCategory
          id="flooring-patterns-tiles"
          title="Flooring Patterns & Tiles"
          items={[
            {
              item: 'Herringbone/chevron hybrid or timber',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Statement pattern; use selectively to control cost.',
            },
            {
              item: 'Large‑format tiles (600×1200+)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Fewer grout lines, premium look; ensure flat substrates.',
            },
            {
              item: 'Tile grade and slip rating (PEI/R)',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Durability and safety class; choose appropriate areas.',
            },
            {
              item: 'Feature tile wall (kitchen/bath niche)',
              costImpact: '$–$$',
              roiRange: '40–80%',
              notes: 'Budget‑friendly focal point; avoid fads in large areas.',
            },
          ]}
        />

        <RoiCategory
          id="windows-frames"
          title="Windows & Frames"
          items={[
            {
              item: 'Stacker/bifold doors to alfresco',
              costImpact: '$$–$$$',
              roiRange: '50–110%',
              notes: 'Indoor‑outdoor flow; check shading and thermal performance.',
            },
            {
              item: 'uPVC/thermally broken aluminium',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Improves energy efficiency and comfort.',
            },
            {
              item: 'Highlight + corner windows',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Light and aspect; coordinate with structure and eaves.',
            },
          ]}
        />

        <RoiCategory
          id="stairs-double-storey"
          title="Stairs (Double‑Storey)"
          items={[
            {
              item: 'Timber treads + glass balustrade',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Airy feel and light transfer; mind cleaning of glass.',
            },
            {
              item: 'Closed risers with storage under‑stair',
              costImpact: '$$',
              roiRange: '40–100%',
              notes: 'Maximises utility in compact footprints.',
            },
          ]}
        />

        <RoiCategory
          id="void-spaces"
          title="Void Spaces & Double‑Height"
          items={[
            {
              item: 'Entry void',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Creates drama and light; consider acoustics and heating.',
            },
            {
              item: 'Stair void feature lighting',
              costImpact: '$–$$$',
              roiRange: '40–90%',
              notes: 'Sculptural pendants add premium feel.',
            },
          ]}
        />

        <RoiCategory
          id="structural-layout"
          title="Structural & Layout"
          items={[
            {
              item: 'Increased ceiling heights (eg. 2700mm GF)',
              costImpact: '$$–$$$',
              roiRange: '50–110%',
              notes: 'Bigger‑space feel; coordinate with door/window heights.',
            },
            {
              item: 'Open kitchen with connected butler’s pantry',
              costImpact: '$$–$$$',
              roiRange: '50–120%',
              notes: 'Entertainer layouts rate highly; keep clear sightlines.',
            },
            {
              item: 'Island bench with double waterfall',
              costImpact: '$$–$$$',
              roiRange: '50–110%',
              notes: 'Premium centrepiece; ensure durable edges and seating depth.',
            },
            {
              item: 'Additional ovens/cooktops (90cm or double)',
              costImpact: '$$',
              roiRange: '40–90%',
              notes: 'Appeals to family/entertainer buyers; plan power/venting.',
            },
            {
              item: 'Splashback upgrades (window/stone/slab tile)',
              costImpact: '$–$$$',
              roiRange: '40–100%',
              notes: 'Window splashbacks add light; slab stone is premium.',
            },
          ]}
        />

        <RoiCategory
          id="cornices-ceilings"
          title="Cornices & Ceilings"
          items={[
            {
              item: 'Square‑set (no cornice) to living',
              costImpact: '$$',
              roiRange: '40–90%',
              notes: 'Contemporary look; requires straighter plasterwork.',
            },
            {
              item: 'Feature bulkheads/recessed ceilings',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Defines zones; integrate with lighting plans.',
            },
          ]}
        />

        <RoiCategory
          id="feature-walls-niches"
          title="Feature Walls & Niches"
          items={[
            {
              item: 'TV/media niche',
              costImpact: '$–$$',
              roiRange: '40–100%',
              notes: 'Adds storage and clean cable routing; popular in living rooms.',
            },
            {
              item: 'Bedhead wall panelling',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Warmth and texture in bedrooms for modest spend.',
            },
            {
              item: 'Fireplace/stone veneer feature',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Statement focal point; ensure ventilation and clearances.',
            },
          ]}
        />

        <RoiCategory
          id="architraves-skirtings"
          title="Architraves & Skirtings"
          items={[
            {
              item: 'Square‑edge contemporary profiles',
              costImpact: '$',
              roiRange: '40–80%',
              notes: 'Modern look; pairs with square‑set ceilings.',
            },
            {
              item: 'Tall skirting (120–180mm)',
              costImpact: '$–$$',
              roiRange: '40–90%',
              notes: 'Upscale feel; protects walls from wear.',
            },
            {
              item: 'Shadowline details',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Premium minimalist aesthetic; precision install.',
            },
          ]}
        />

        <RoiCategory
          id="facade"
          title="Facade & Street Appeal"
          items={[
            {
              item: 'Mixed cladding accents (timber/Scyon)',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Texture and depth; maintain colour harmony.',
            },
            {
              item: 'Rendered vs face brick mix',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Premium look; consider maintenance.',
            },
            {
              item: 'Roof profile and eaves depth',
              costImpact: '$$–$$$',
              roiRange: '40–90%',
              notes: 'Proportion and shading impact appeal.',
            },
          ]}
        />

        <RoiCategory
          id="practical-layouts"
          title="Layout & Space Planning"
          items={[
            {
              item: 'Clear circulation (min 900–1000mm)',
              costImpact: '$',
              roiRange: '50–120%',
              notes: 'Improves usability; feels larger without extra sqm.',
            },
            {
              item: 'Functional furniture wall lengths',
              costImpact: '$',
              roiRange: '50–110%',
              notes: 'Plan walls to fit sofas/beds/TVs comfortably.',
            },
            {
              item: 'Zoning day/night and noise separation',
              costImpact: '$',
              roiRange: '50–110%',
              notes: 'Better livability for families and WFH.',
            },
          ]}
        />

        <RoiCategory
          id="interior-balance"
          title="Interior Balance & Styling"
          items={[
            {
              item: 'Consistent finishes across rooms',
              costImpact: '$',
              roiRange: '50–120%',
              notes: 'Unifies the home; avoids visual clutter.',
            },
            {
              item: 'Restrained accent colour strategy',
              costImpact: '$',
              roiRange: '40–100%',
              notes: 'Timeless feel; lets feature elements stand out.',
            },
            {
              item: 'Symmetry/proportion in elevations',
              costImpact: '$',
              roiRange: '40–100%',
              notes: 'Better photos and buyer perception.',
            },
          ]}
        />
      </div>
      <div className="mt-10" id="a-z-index">
        <Card className="ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>A–Z index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] sm:w-[45%]">Item</TableHead>
                    <TableHead className="min-w-[150px]">Section</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {azItems.map((x) => (
                    <TableRow key={x.href}>
                      <TableCell>
                        <a
                          href={x.href}
                          className="underline underline-offset-4 hover:no-underline text-xs sm:text-sm"
                        >
                          {x.item}
                        </a>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-muted-foreground">
                        {x.sectionTitle}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function RoiCategory({ id, title, items }: { id?: string; title: string; items: RoiItem[] }) {
  const sortedItems = [...items].sort((a, b) => a.item.localeCompare(b.item))
  return (
    <Card
      className="px-0 g-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg ring-1 ring-gray-200/60 backdrop-blur-sm scroll-mt-24 hover:shadow-xl transition-all duration-300"
      id={id}
    >
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table className="border-separate border-spacing-0">
            <TableCaption className="sr-only">Indicative ROI ranges</TableCaption>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableHead className="min-w-[80px] sm:w-[30%] text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Item
                </TableHead>
                <TableHead className="min-w-[40px] sm:w-[15%] text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Cost impact
                </TableHead>
                <TableHead className="min-w-[40px] sm:w-[15%] text-sm font-semibold text-gray-700 border-b border-gray-200">
                  ROI range
                </TableHead>
                <TableHead className="min-w-[60px] sm:w-[30%] text-sm font-semibold text-gray-700 border-b border-gray-200">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((r) => {
                const rowId = `${id ?? toSlug(title)}-${toSlug(r.item)}`
                return (
                  <TableRow
                    key={r.item}
                    id={rowId}
                    data-roi-item={r.item}
                    data-roi-section={id ?? toSlug(title)}
                    data-roi-section-title={title}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <TableCell className="text-sm font-medium text-gray-800 border-b border-gray-100">
                      {r.item}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 border-b border-gray-100">
                      {r.costImpact}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 border-b border-gray-100">
                      {r.roiRange}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 border-b border-gray-100">
                      {r.notes}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface RoiItem {
  item: string
  costImpact: string
  roiRange: string
  notes: string
}

export interface UpgradeRoiGuideProps {
  showHeader?: boolean
  showToc?: boolean
  className?: string
}
