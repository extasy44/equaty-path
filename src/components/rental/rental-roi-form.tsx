'use client'

import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { RentalInputs } from '@/lib/rental-roi-calc'

const schema = z.object({
  purchase_price: z.coerce.number().min(0),
  stamp_duty: z.coerce.number().min(0),
  closing_costs: z.coerce.number().min(0),
  rent_per_week: z.coerce.number().min(0),
  vacancy_weeks: z.coerce.number().min(0).max(52),
  property_management_pct: z.coerce.number().min(0).max(1),
  maintenance_per_year: z.coerce.number().min(0),
  insurance_per_year: z.coerce.number().min(0),
  rates_per_year: z.coerce.number().min(0),
  body_corp_per_year: z.coerce.number().min(0),
  loan_amount: z.coerce.number().min(0),
  interest_rate: z.coerce.number().min(0).max(1),
  marginal_tax_rate: z.coerce.number().min(0).max(1).optional(),
  depreciation_per_year: z.coerce.number().min(0).optional(),
  current_taxable_income: z.coerce.number().min(0).optional(),
})

export function RentalRoiForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: RentalRoiFormProps) {
  const form = useForm<RentalInputs>({
    resolver: zodResolver(schema) as unknown as Resolver<RentalInputs>,
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    // Reset form when presets/defaultValues change
    form.reset(defaultValues)
  }, [defaultValues, form])

  const fractionalIds: Array<keyof RentalInputs> = ['property_management_pct', 'interest_rate']

  const Field = ({
    id,
    label,
    hint,
    min,
    max,
    step = 'any',
    placeholder,
  }: {
    id: keyof RentalInputs
    label: string
    hint?: string
    min?: number
    max?: number
    step?: number | string
    placeholder?: string
  }) => (
    <div className="grid gap-1.5">
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
      <Input
        id={id as string}
        type="number"
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        {...form.register(id, {
          valueAsNumber: true,
          onBlur: (e) => {
            if (!fractionalIds.includes(id)) return
            const rawText = (e.target as HTMLInputElement).value
            const cleaned = rawText.replace(/%/g, '')
            const raw = Number(cleaned)
            const normalized = raw > 1 ? raw / 100 : raw
            if (Number.isFinite(normalized) && normalized !== raw) {
              form.setValue(id, normalized as number, { shouldDirty: true, shouldValidate: true })
            }
          },
        })}
      />
      {form.formState.errors[id]?.message ? (
        <div className="text-[11px] text-red-600">{String(form.formState.errors[id]?.message)}</div>
      ) : null}
    </div>
  )

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((values) => onSubmit(values as RentalInputs))}
      noValidate
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          id="purchase_price"
          label="Purchase price"
          hint="Contract price excluding stamp duty and closing costs."
        />
        <Field id="stamp_duty" label="Stamp duty" hint="Transfer duty on the purchase." />
        <Field
          id="closing_costs"
          label="Closing costs"
          hint="Legal, inspections, lender fees at purchase."
        />
        <Field id="rent_per_week" label="Rent per week" hint="Expected achievable weekly rent." />
        <Field
          id="vacancy_weeks"
          label="Vacancy (weeks)"
          hint="Expected weeks vacant per year."
          min={0}
          max={52}
          step={1}
        />
        <Field
          id="property_management_pct"
          label="Property mgmt % (0.06)"
          hint="Agent fee as fraction (0.06 = 6%)."
          min={0}
          max={1}
          step="any"
          placeholder="0.06"
        />
        <Field id="maintenance_per_year" label="Maintenance per year" />
        <Field id="insurance_per_year" label="Insurance per year" />
        <Field id="rates_per_year" label="Rates per year" />
        <Field id="body_corp_per_year" label="Body corp per year" />
        <Field id="loan_amount" label="Loan amount" />
        <Field
          id="interest_rate"
          label="Interest rate (0.065)"
          min={0}
          max={1}
          step="any"
          placeholder="0.065"
        />
        <Field
          id="marginal_tax_rate"
          label="Marginal tax rate (0.37)"
          hint="Your personal tax rate (e.g. 0.37 = 37%)."
          min={0}
          max={1}
          step="any"
          placeholder="0.37"
        />
        <Field
          id="depreciation_per_year"
          label="Depreciation per year"
          hint="Capital allowances and building depreciation."
        />
        <Field
          id="current_taxable_income"
          label="Current taxable income"
          hint="Your other taxable income before this investment."
        />
      </div>
      <button
        type="submit"
        className="h-9 px-4 rounded-md bg-[color:var(--color-foreground)] text-white disabled:opacity-60 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Calculating…' : 'Calculate'}
      </button>
    </form>
  )
}

export interface RentalRoiFormProps {
  defaultValues: RentalInputs
  onSubmit: (values: RentalInputs) => void | Promise<void>
  isSubmitting?: boolean
}

export type RentalRoiFormComponent = object
