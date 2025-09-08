import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">2 reports / month</CardContent>
        <CardFooter>
          <Button variant="outline">Get Started</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Premium</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">Unlimited reports ($29/month)</CardContent>
        <CardFooter>
          <Button className="bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/90">
            Upgrade with Stripe
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export type PricingPageProps = object
