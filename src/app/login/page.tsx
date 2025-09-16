import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <Card className="border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-500">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Login Coming Soon</CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            We&apos;re working hard to bring you secure authentication.
            <br />
            <span className="font-semibold text-orange-600">Stay tuned!</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-gray-800 mb-2">What&apos;s Coming:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Secure email & password authentication</li>
              <li>• Google OAuth integration</li>
              <li>• Password recovery & reset</li>
              <li>• User profile management</li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-500">
              Email (Preview)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              disabled
              className="bg-gray-100 text-gray-400"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-gray-500">
              Password (Preview)
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled
              className="bg-gray-100 text-gray-400"
            />
          </div>

          <Button
            disabled
            className="bg-gray-400 text-white cursor-not-allowed"
            title="Login functionality coming soon"
          >
            <Clock className="h-4 w-4 mr-2" />
            Continue (Coming Soon)
          </Button>
          <Button
            variant="outline"
            disabled
            className="border-gray-300 text-gray-400 cursor-not-allowed"
            title="Google login coming soon"
          >
            Continue with Google (Coming Soon)
          </Button>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              In the meantime, explore our free tools and calculators!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export type LoginPageProps = object
