import { NextResponse } from 'next/server'

interface GeospatialData {
  coordinates: { lat: number; lng: number }
  lotNumber: string
  cadastralDescription: string
}

interface ReaData {
  estimatedValue: number
  listingHistory: Array<{ date: string; event: string; price?: number }>
}

interface CoreLogicData {
  zoning: string
  landSizeSqm: number
  lastSaleDate?: string
  comparables: Array<{
    address: string
    date: string
    price: number
    beds?: number
    baths?: number
    car?: number
  }>
}

export async function POST(request: Request) {
  const { address } = await request.json().catch(() => ({ address: '' }))
  if (!address || typeof address !== 'string')
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })

  // Simulated upstream API calls
  const geo: GeospatialData = {
    coordinates: { lat: -33.865143, lng: 151.2099 },
    lotNumber: 'Lot 12',
    cadastralDescription: 'Rectangular parcel with 12.5m frontage and 32m depth',
  }

  const rea: ReaData = {
    estimatedValue: 1525000,
    listingHistory: [
      { date: '2023-09-18', event: 'Listed', price: 1590000 },
      { date: '2023-11-02', event: 'Price update', price: 1550000 },
      { date: '2024-02-14', event: 'Withdrawn' },
    ],
  }

  const corelogic: CoreLogicData = {
    zoning: 'R2 Low Density Residential',
    landSizeSqm: 405,
    lastSaleDate: '2018-07-21',
    comparables: [
      { address: '12 Sample St', date: '2025-06-03', price: 1610000, beds: 3, baths: 2, car: 1 },
      { address: '8 Example Ave', date: '2025-05-28', price: 1480000, beds: 3, baths: 2, car: 2 },
      { address: '22 Test Rd', date: '2025-04-12', price: 1725000, beds: 4, baths: 2, car: 2 },
    ],
  }

  return NextResponse.json({ address, geo, rea, corelogic })
}
