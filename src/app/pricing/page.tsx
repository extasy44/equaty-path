import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MessageCircle } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Pricing Plans Coming Soon</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We&apos;re working hard to bring you flexible pricing options. In the meantime, get in
          touch with us to discuss your specific needs and requirements.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Contact Us for Custom Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Our team is ready to help you find the perfect solution for your property investment
            needs. Contact us today to discuss pricing and get started.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground">info@rebuildroi.com</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground">+61 2 1234 5678</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Available 9AM-5PM AEST</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export type PricingPageProps = object
