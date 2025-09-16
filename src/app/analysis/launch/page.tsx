import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ArrowLeft, Brain } from 'lucide-react'
import Link from 'next/link'

export default function AnalysisLaunchPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-6">
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </Link>
      </div>

      <Card className="border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-500">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            AI Analysis Coming Soon
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            We&apos;re building advanced AI algorithms to provide comprehensive property
            intelligence.
            <br />
            <span className="font-semibold text-orange-600">Stay tuned!</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-gray-800 mb-2">What&apos;s Coming:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI-powered market analysis</li>
              <li>• Geospatial data integration</li>
              <li>• Comparable sales analysis</li>
              <li>• Zoning regulation insights</li>
              <li>• Automated report generation</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              In the meantime, explore our other property investment tools!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
