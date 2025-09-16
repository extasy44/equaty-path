'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrencyAUD } from '@/lib/utils'

interface ApiResponse {
  address: string
  geo: {
    coordinates: { lat: number; lng: number }
    lotNumber: string
    cadastralDescription: string
  }
  rea: {
    estimatedValue: number
    listingHistory: Array<{ date: string; event: string; price?: number }>
  }
  corelogic: {
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
}

interface AnalysisClientProps {
  onExit?: () => void
  previewMode?: boolean
}

export default function AnalysisClient({ onExit, previewMode = false }: AnalysisClientProps) {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setData(null)
    if (!address.trim()) {
      setError('Please enter a valid address')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      if (!res.ok) throw new Error('Failed to fetch analysis')
      const json = (await res.json()) as ApiResponse
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter a property address"
          className="h-11"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90"
        >
          {isLoading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {data && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>{data.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Estimated Value</dt>
                  <dd className="font-medium">{formatCurrencyAUD(data.rea.estimatedValue)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Land Size</dt>
                  <dd className="font-medium">{data.corelogic.landSizeSqm} sqm</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Zoning</dt>
                  <dd className="font-medium">{data.corelogic.zoning}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Sale Date</dt>
                  <dd className="font-medium">{data.corelogic.lastSaleDate ?? '—'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Land & Boundaries</CardTitle>
              <CardDescription>Geospatial snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <span className="text-muted-foreground">Coordinates:</span>{' '}
                {data.geo.coordinates.lat.toFixed(6)}, {data.geo.coordinates.lng.toFixed(6)}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Lot:</span> {data.geo.lotNumber}
              </p>
              <div className="mt-3 rounded-md border p-3 text-sm bg-slate-50">
                {data.geo.cadastralDescription}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>Comparables and listing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Recent Sales</h3>
                  <ul className="space-y-2 text-sm">
                    {data.corelogic.comparables.map((c) => (
                      <li
                        key={`${c.address}-${c.date}`}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {c.address} — {c.date}
                        </span>
                        <span className="font-medium">{formatCurrencyAUD(c.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">REA Listing History</h3>
                  <ul className="space-y-2 text-sm">
                    {data.rea.listingHistory.map((h) => (
                      <li
                        key={`${h.date}-${h.event}`}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {h.date} — {h.event}
                        </span>
                        <span className="font-medium">
                          {h.price ? formatCurrencyAUD(h.price) : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
