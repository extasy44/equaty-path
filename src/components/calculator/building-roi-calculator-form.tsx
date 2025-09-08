'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { calculateFeasibility, defaultInputs, type CalculatorInputs } from '@/lib/build-roi-calc'

const schema = z.object({
  land_price: z.coerce.number().min(0),
  existing_house_value: z.coerce.number().min(0),
  hold_years: z.coerce.number().int().min(0),
  annual_market_growth: z.coerce.number().min(0),
  build_cost: z.coerce.number().min(0),
  demolition_cost: z.coerce.number().min(0),
  excavation_cost: z.coerce.number().min(0),
  tree_removal_cost: z.coerce.number().min(0),
  rock_removal_cost: z.coerce.number().min(0),
  traffic_control_cost: z.coerce.number().min(0),
  site_remediation_cost: z.coerce.number().min(0),
  geotech_cost: z.coerce.number().min(0),
  basix_and_sustainability_cost: z.coerce.number().min(0),
  utility_connection_cost: z.coerce.number().min(0),
  driveway_landscaping_cost: z.coerce.number().min(0),
  allowance_variations: z.coerce.number().min(0),
  architect_design_fees: z.coerce.number().min(0),
  engineering_fees: z.coerce.number().min(0),
  council_approval_costs: z.coerce.number().min(0),
  certifier_fees: z.coerce.number().min(0),
  surveyors_fees: z.coerce.number().min(0),
  legal_fees_purchase: z.coerce.number().min(0),
  gst_on_build: z.coerce.boolean(),
  gst_rate: z.coerce.number().min(0),
  stamp_duty: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0),
  loan_interest_rate: z.coerce.number().min(0),
  loan_term_years: z.coerce.number().min(0),
  interest_during_construction_months: z.coerce.number().min(0),
  bank_fee_upfront: z.coerce.number().min(0),
  valuation_fee: z.coerce.number().min(0),
  mortgage_insurance: z.coerce.number().min(0),
  rates_per_year: z.coerce.number().min(0),
  insurance_per_year: z.coerce.number().min(0),
  utilities_per_month: z.coerce.number().min(0),
  property_management_per_year: z.coerce.number().min(0),
  agent_commission_pct: z.coerce.number().min(0),
  sales_legal_fees: z.coerce.number().min(0),
  marketing_costs: z.coerce.number().min(0),
  is_owner_occupied: z.coerce.boolean(),
  owner_occupied_share_pct: z.coerce.number().min(0).max(1).optional(),
  apply_cgt_discount: z.coerce.boolean().optional(),
  taxable_profit_rate: z.coerce.number().min(0),
  contingency_pct: z.coerce.number().min(0),
})

export function BuildRoiCalculatorForm({
  onResult,
  isCalculating = false,
}: {
  onResult: (o: CalculatorInputs) => void | Promise<void>
  isCalculating?: boolean
}) {
  const resolver = zodResolver(schema) as unknown as Resolver<CalculatorInputs>
  const form = useForm<CalculatorInputs>({
    resolver,
    defaultValues: defaultInputs,
    mode: 'onChange',
  })

  const values = form.watch()
  useMemo(() => calculateFeasibility(values as CalculatorInputs), [values])
  const [showAll, setShowAll] = useState(false)
  const [autoStampDuty, setAutoStampDuty] = useState(true)
  const isProgrammatic = useRef(false)
  const [region, setRegion] = useState<'nsw' | 'vic'>('nsw')

  // Reusable field config and helpers
  interface FieldConfig {
    label: string
    name: keyof CalculatorInputs
    registerAs: 'number' | 'checkbox'
    hint?: string
  }

  function FieldsGrid({
    fields,
    form,
  }: {
    fields: FieldConfig[]
    form: ReturnType<typeof useForm<CalculatorInputs>>
  }) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <Field
            key={String(f.name)}
            label={f.label}
            name={f.name}
            registerAs={f.registerAs}
            hint={f.hint}
            form={form}
          />
        ))}
      </div>
    )
  }

  function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <Card className="ring-1 ring-black/5">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  const basicsFields: FieldConfig[] = [
    {
      label: 'Land price',
      name: 'land_price',
      registerAs: 'number',
      hint: 'Purchase price of the land',
    },
    {
      label: 'Existing house value',
      name: 'existing_house_value',
      registerAs: 'number',
      hint: 'Value before demolition (0 if vacant)',
    },
    { label: 'Hold years', name: 'hold_years', registerAs: 'number' },
    {
      label: 'Annual market growth',
      name: 'annual_market_growth',
      registerAs: 'number',
      hint: 'Expected annual growth as decimal (e.g. 0.04 = 4%)',
    },
  ]

  const constructionFields: FieldConfig[] = [
    {
      label: 'Build cost (ex GST)',
      name: 'build_cost',
      registerAs: 'number',
      hint: 'Builder contract excluding GST',
    },
    { label: 'Demolition cost', name: 'demolition_cost', registerAs: 'number' },
    { label: 'Excavation', name: 'excavation_cost', registerAs: 'number' },
    { label: 'Tree removal', name: 'tree_removal_cost', registerAs: 'number' },
    { label: 'Rock removal', name: 'rock_removal_cost', registerAs: 'number' },
    {
      label: 'Traffic control',
      name: 'traffic_control_cost',
      registerAs: 'number',
      hint: 'Road closures, pedestrian management',
    },
    {
      label: 'Site remediation',
      name: 'site_remediation_cost',
      registerAs: 'number',
      hint: 'Contamination, asbestos removal',
    },
    { label: 'Geotech', name: 'geotech_cost', registerAs: 'number' },
    { label: 'Energy compliance', name: 'basix_and_sustainability_cost', registerAs: 'number' },
    {
      label: 'Utility connections',
      name: 'utility_connection_cost',
      registerAs: 'number',
      hint: 'Sewer, water, power, gas',
    },
    { label: 'Driveway & landscaping', name: 'driveway_landscaping_cost', registerAs: 'number' },
    { label: 'Variations allowance', name: 'allowance_variations', registerAs: 'number' },
  ]

  const professionalFields: FieldConfig[] = [
    { label: 'Architect/design', name: 'architect_design_fees', registerAs: 'number' },
    { label: 'Engineering', name: 'engineering_fees', registerAs: 'number' },
    { label: 'Council approvals', name: 'council_approval_costs', registerAs: 'number' },
    { label: 'Certifier', name: 'certifier_fees', registerAs: 'number' },
    { label: 'Surveyors', name: 'surveyors_fees', registerAs: 'number' },
    { label: 'Legal (purchase)', name: 'legal_fees_purchase', registerAs: 'number' },
  ]

  const financeHoldingFields: FieldConfig[] = [
    { label: 'Deposit', name: 'deposit', registerAs: 'number' },
    { label: 'Loan interest rate', name: 'loan_interest_rate', registerAs: 'number' },
    { label: 'Loan term (years)', name: 'loan_term_years', registerAs: 'number' },
    {
      label: 'Interest during construction (months)',
      name: 'interest_during_construction_months',
      registerAs: 'number',
    },
    { label: 'Bank fee upfront', name: 'bank_fee_upfront', registerAs: 'number' },
    { label: 'Valuation fee', name: 'valuation_fee', registerAs: 'number' },
    { label: 'Mortgage insurance', name: 'mortgage_insurance', registerAs: 'number' },
  ]

  const holdingOperatingFields: FieldConfig[] = [
    { label: 'Rates per year', name: 'rates_per_year', registerAs: 'number' },
    { label: 'Insurance per year', name: 'insurance_per_year', registerAs: 'number' },
    { label: 'Utilities per month', name: 'utilities_per_month', registerAs: 'number' },
    {
      label: 'Property management per year',
      name: 'property_management_per_year',
      registerAs: 'number',
    },
  ]

  const sellingTaxFields: FieldConfig[] = [
    { label: 'Agent commission % (0.02)', name: 'agent_commission_pct', registerAs: 'number' },
    { label: 'Sales legal fees', name: 'sales_legal_fees', registerAs: 'number' },
    { label: 'Marketing costs', name: 'marketing_costs', registerAs: 'number' },
    { label: 'Owner occupied (true/false)', name: 'is_owner_occupied', registerAs: 'checkbox' },
    { label: 'Owner-occupied share (0-1)', name: 'owner_occupied_share_pct', registerAs: 'number' },
    { label: 'Apply CGT 50% discount', name: 'apply_cgt_discount', registerAs: 'checkbox' },
    {
      label: 'Effective tax rate on gain (0.25)',
      name: 'taxable_profit_rate',
      registerAs: 'number',
    },
  ]

  interface DutyBracket {
    upTo: number
    base: number
    rate: number
    over: number
  }
  function estimateStampDuty(landPrice: number, state: 'nsw' | 'vic'): number {
    // Simplified schedules (illustrative only)
    const nsw: DutyBracket[] = [
      { upTo: 14000, base: 0, rate: 0.01125, over: 0 },
      { upTo: 32000, base: 157, rate: 0.0125, over: 14000 },
      { upTo: 85000, base: 345, rate: 0.015, over: 32000 },
      { upTo: 319000, base: 1307, rate: 0.0175, over: 85000 },
      { upTo: 1060000, base: 4480, rate: 0.035, over: 319000 },
      { upTo: Number.POSITIVE_INFINITY, base: 40390, rate: 0.045, over: 1060000 },
    ]
    const vic: DutyBracket[] = [
      { upTo: 25000, base: 0, rate: 0.014, over: 0 },
      { upTo: 130000, base: 350, rate: 0.024, over: 25000 },
      { upTo: 960000, base: 2870, rate: 0.06, over: 130000 },
      { upTo: Number.POSITIVE_INFINITY, base: 0.055 * 960000 - 0.0000001, rate: 0.055, over: 0 },
    ]
    const table = state === 'vic' ? vic : nsw
    const bracket = table.find((br) => landPrice <= br.upTo) as DutyBracket
    return Math.max(0, Math.round(bracket.base + (landPrice - bracket.over) * bracket.rate))
  }

  useEffect(() => {
    if (!autoStampDuty) return
    const price = Number(values.land_price || 0)
    const duty = estimateStampDuty(price, region)
    isProgrammatic.current = true
    form.setValue('stamp_duty', duty, { shouldDirty: true })
    isProgrammatic.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.land_price, autoStampDuty, region])

  useEffect(() => {
    const sub = form.watch((_, { name, type }) => {
      if (name === 'stamp_duty' && type === 'change' && !isProgrammatic.current)
        setAutoStampDuty(false)
    })
    return () => sub.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Input layout</div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Show all inputs
        </label>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Label htmlFor="state">State</Label>
        <select
          id="state"
          className="h-9 rounded-md border border-black/10 bg-background px-2 shadow-sm focus:border-black/15"
          value={region}
          onChange={(e) => setRegion(e.target.value as 'nsw' | 'vic')}
        >
          <option value="nsw">NSW</option>
          <option value="vic">VIC</option>
        </select>
        <div className="text-xs text-muted-foreground">Used for stamp duty auto‑calc</div>
      </div>
      {!showAll && (
        <Tabs defaultValue="basics">
          {!showAll && (
            <TabsList className="grid grid-cols-4 w-full bg-muted rounded-md p-1">
              <TabsTrigger
                value="basics"
                className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm"
                title="Core purchase and timing assumptions"
              >
                Basics
              </TabsTrigger>
              <TabsTrigger
                value="construction"
                className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm"
                title="Build and site costs with allowances"
              >
                Construction
              </TabsTrigger>
              <TabsTrigger
                value="fees"
                className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm"
                title="Professional, approval and legal fees"
              >
                Fees
              </TabsTrigger>
              <TabsTrigger
                value="finance"
                className="cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm"
                title="GST, duty, finance and holding"
              >
                Finance
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent
            value="basics"
            className="mt-4"
            style={{ display: showAll ? 'block' : undefined }}
          >
            <SectionCard title="Project basics">
              <FieldsGrid fields={basicsFields} form={form} />
            </SectionCard>
          </TabsContent>

          <TabsContent
            value="construction"
            className="mt-4"
            style={{ display: showAll ? 'block' : undefined }}
          >
            <SectionCard title="Construction & site">
              <FieldsGrid fields={constructionFields} form={form} />
            </SectionCard>
          </TabsContent>

          <TabsContent
            value="fees"
            className="mt-4"
            style={{ display: showAll ? 'block' : undefined }}
          >
            <SectionCard title="Professional & approvals">
              <FieldsGrid fields={professionalFields} form={form} />
            </SectionCard>
          </TabsContent>

          <TabsContent
            value="finance"
            className="mt-4"
            style={{ display: showAll ? 'block' : undefined }}
          >
            <Card className="ring-1 ring-black/5">
              <CardHeader>
                <CardTitle>Tax, duty & GST</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Field
                  label="GST on build (true/false)"
                  name="gst_on_build"
                  registerAs="checkbox"
                  form={form}
                />
                <Field label="GST rate" name="gst_rate" registerAs="number" form={form} />
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stamp_duty">Stamp duty</Label>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5"
                        checked={autoStampDuty}
                        onChange={(e) => setAutoStampDuty(e.target.checked)}
                      />
                      Auto-calc
                    </label>
                  </div>
                  <Input
                    id="stamp_duty"
                    type="number"
                    step="any"
                    {...form.register('stamp_duty')}
                  />
                  <div className="text-[11px] text-muted-foreground">
                    Estimate uses a simplified NSW schedule. You can override the value any time.
                  </div>
                </div>
              </CardContent>
            </Card>

            <SectionCard title="Finance & holding">
              <FieldsGrid fields={financeHoldingFields} form={form} />
            </SectionCard>

            <SectionCard title="Holding & operating">
              <FieldsGrid fields={holdingOperatingFields} form={form} />
            </SectionCard>

            <SectionCard title="Selling & taxation">
              <FieldsGrid fields={sellingTaxFields} form={form} />
            </SectionCard>

            <Card className="ring-1 ring-black/5 mt-4">
              <CardHeader>
                <CardTitle>Contingency</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Contingency % of build (0.10)"
                  name="contingency_pct"
                  registerAs="number"
                  form={form}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {showAll && (
        <div className="grid gap-6">
          <SectionCard title="Project basics">
            <FieldsGrid fields={basicsFields} form={form} />
          </SectionCard>

          <SectionCard title="Construction & site">
            <FieldsGrid fields={constructionFields} form={form} />
          </SectionCard>

          <SectionCard title="Professional & approvals">
            <FieldsGrid fields={professionalFields} form={form} />
          </SectionCard>

          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle>Tax, duty & GST</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Field
                label="GST on build (true/false)"
                name="gst_on_build"
                registerAs="checkbox"
                form={form}
              />
              <Field label="GST rate" name="gst_rate" registerAs="number" form={form} />
              <div className="grid gap-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stamp_duty">Stamp duty</Label>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5"
                      checked={autoStampDuty}
                      onChange={(e) => setAutoStampDuty(e.target.checked)}
                    />
                    Auto-calc
                  </label>
                </div>
                <Input id="stamp_duty" type="number" step="any" {...form.register('stamp_duty')} />
                <div className="text-[11px] text-muted-foreground">
                  Schedule based on {region.toUpperCase()} (simplified). You can override.
                </div>
              </div>
            </CardContent>
          </Card>

          <SectionCard title="Finance & holding">
            <FieldsGrid fields={financeHoldingFields} form={form} />
          </SectionCard>

          <SectionCard title="Holding & operating">
            <FieldsGrid fields={holdingOperatingFields} form={form} />
          </SectionCard>

          <SectionCard title="Selling & taxation">
            <FieldsGrid fields={sellingTaxFields} form={form} />
          </SectionCard>

          <Card className="ring-1 ring-black/5">
            <CardHeader>
              <CardTitle>Contingency</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Field
                label="Contingency % of build (0.10)"
                name="contingency_pct"
                registerAs="number"
                form={form}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => onResult(values as CalculatorInputs)}
          disabled={isCalculating}
          style={{
            cursor: isCalculating ? 'not-allowed' : 'pointer',
            color: isCalculating ? 'gray' : 'white',
          }}
        >
          {isCalculating ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              Calculating…
            </>
          ) : (
            'Calculate ROI'
          )}
        </Button>
      </div>
    </div>
  )
}

const fractionFieldNames: Array<keyof CalculatorInputs> = [
  'annual_market_growth',
  'gst_rate',
  'agent_commission_pct',
  'taxable_profit_rate',
  'contingency_pct',
  'loan_interest_rate',
]

function Field({
  label,
  name,
  form,
  registerAs,
  hint,
}: {
  label: string
  name: keyof CalculatorInputs
  form: ReturnType<typeof useForm<CalculatorInputs>>
  registerAs: 'number' | 'checkbox'
  hint?: string
}) {
  const id = name as string
  const { register, setValue } = form
  const isFraction = (fractionFieldNames as string[]).includes(name as string)
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {hint ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-xs cursor-help">
                  i
                </span>
              </TooltipTrigger>
              <TooltipContent>{hint}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
      {registerAs === 'checkbox' ? (
        <input id={id} type="checkbox" className="h-4 w-4" {...register(name)} />
      ) : (
        <Input
          id={id}
          type="number"
          step="any"
          {...register(name, {
            valueAsNumber: true,
            onBlur: (e) => {
              if (!isFraction) return
              const rawText = (e.target as HTMLInputElement).value
              const cleaned = rawText.replace(/%/g, '')
              const raw = Number(cleaned)
              const normalized = raw > 1 ? raw / 100 : raw
              if (Number.isFinite(normalized) && normalized !== raw) {
                setValue(name, normalized as number, { shouldDirty: true, shouldValidate: true })
              }
            },
          })}
        />
      )}
    </div>
  )
}

export type BuildRoiCalculatorFormProps = object
