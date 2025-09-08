import { CalculatorClient } from './calculator-client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function BuildRoiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <header className="mb-6 md:mb-8 text-center md:text-left mx-auto max-w-3xl md:max-w-none">
        <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--color-primary)]">
          EquityPath Build ROI
        </h1>
        <p className="mt-3 text-muted-foreground md:max-w-2xl mx-auto md:mx-0">
          Estimate total project cost, resale value and ROI for your next knockdown rebuild or land
          purchase. Work through the sections below, click Calculate, then review the Snapshot on
          the right. Export a lender-friendly PDF when you’re ready.
        </p>
      </header>
      <Tabs defaultValue="feasibility">
        <TabsList className="w-full md:w-auto mx-auto grid grid-cols-3 bg-white shadow-[var(--shadow-soft)] rounded-md p-1 overflow-x-auto">
          <TabsTrigger
            value="feasibility"
            className="cursor-pointer data-[state=active]:bg-[color:var(--color-primary)] data-[state=active]:text-white"
          >
            Feasibility
          </TabsTrigger>
          <TabsTrigger value="references" className="cursor-pointer">
            References
          </TabsTrigger>
          <TabsTrigger value="exports" className="cursor-pointer">
            Exports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="feasibility" className="mt-4 md:mt-6">
          <div className="mb-4 text-sm text-muted-foreground">
            Complete Basics, Construction, Fees and Finance. Press{' '}
            <span className="font-medium">Calculate ROI</span> to refresh the Snapshot.
          </div>
          <CalculatorClient />
        </TabsContent>
        <TabsContent value="references" className="mt-8 text-sm text-muted-foreground">
          Schools and Lifestyle information are available under the tabs on the right column. These
          sections currently show placeholder sample data.
        </TabsContent>
        <TabsContent value="exports" className="mt-8 text-sm text-muted-foreground">
          Use the Snapshot actions to export PDF or CSV.
        </TabsContent>
      </Tabs>
    </div>
  )
}
export type BuildRoiPageProps = object
