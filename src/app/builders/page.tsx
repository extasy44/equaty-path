import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BuildersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Builder {i}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Knockdown • Custom</CardContent>
        </Card>
      ))}
    </div>
  )
}

export interface BuildersPageProps {}
