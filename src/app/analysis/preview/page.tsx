import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AnalysisPreviewPage() {
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

      <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Analysis Preview Coming Soon
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            Experience our AI-powered property analysis tool in action.
            <br />
            <span className="font-semibold text-blue-600">Preview mode launching soon!</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2">Preview Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Interactive analysis interface</li>
              <li>• Real-time data visualization</li>
              <li>• Sample property reports</li>
              <li>• Market trend demonstrations</li>
              <li>• Export functionality preview</li>
            </ul>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Check back soon for the interactive preview experience!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
