import { NextRequest } from 'next/server'
import { calculateFeasibility, type CalculatorInputs } from '@/lib/build-roi-calc'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Record<string, unknown>>
  const coerce = (v: unknown) =>
    typeof v === 'string' ? Number(v.replace(/[^0-9.+-eE]/g, '')) : (v as number)

  const inputs: CalculatorInputs = {
    // Project basics
    land_price: coerce(body.land_price),
    existing_house_value: coerce(body.existing_house_value ?? 0),
    hold_years: coerce(body.hold_years ?? 0),
    annual_market_growth: coerce(body.annual_market_growth ?? 0),
    new_home_premium_pct: coerce(body.new_home_premium_pct ?? 0),
    // Construction & site
    build_cost: coerce(body.build_cost ?? 0),
    demolition_cost: coerce(body.demolition_cost ?? 0),
    excavation_cost: coerce(body.excavation_cost ?? 0),
    tree_removal_cost: coerce(body.tree_removal_cost ?? 0),
    rock_removal_cost: coerce(body.rock_removal_cost ?? 0),
    traffic_control_cost: coerce(body.traffic_control_cost ?? 0),
    site_remediation_cost: coerce(body.site_remediation_cost ?? 0),
    geotech_cost: coerce(body.geotech_cost ?? 0),
    basix_and_sustainability_cost: coerce(body.basix_and_sustainability_cost ?? 0),
    utility_connection_cost: coerce(body.utility_connection_cost ?? 0),
    driveway_landscaping_cost: coerce(body.driveway_landscaping_cost ?? 0),
    allowance_variations: coerce(body.allowance_variations ?? 0),
    // Professional & approval
    architect_design_fees: coerce(body.architect_design_fees ?? 0),
    engineering_fees: coerce(body.engineering_fees ?? 0),
    council_approval_costs: coerce(body.council_approval_costs ?? 0),
    certifier_fees: coerce(body.certifier_fees ?? 0),
    surveyors_fees: coerce(body.surveyors_fees ?? 0),
    legal_fees_purchase: coerce(body.legal_fees_purchase ?? 0),
    // Tax, duty & GST
    gst_on_build: Boolean(body.gst_on_build),
    gst_rate: coerce(body.gst_rate ?? 0),
    stamp_duty: coerce(body.stamp_duty ?? 0),
    // Finance & holding
    deposit: coerce(body.deposit ?? 0),
    loan_interest_rate: coerce(body.loan_interest_rate ?? 0),
    loan_term_years: coerce(body.loan_term_years ?? 0),
    interest_during_construction_months: coerce(body.interest_during_construction_months ?? 0),
    bank_fee_upfront: coerce(body.bank_fee_upfront ?? 0),
    valuation_fee: coerce(body.valuation_fee ?? 0),
    mortgage_insurance: coerce(body.mortgage_insurance ?? 0),
    // Holding & operating
    rates_per_year: coerce(body.rates_per_year ?? 0),
    insurance_per_year: coerce(body.insurance_per_year ?? 0),
    utilities_per_month: coerce(body.utilities_per_month ?? 0),
    property_management_per_year: coerce(body.property_management_per_year ?? 0),
    // Selling
    agent_commission_pct: coerce(body.agent_commission_pct ?? 0),
    sales_legal_fees: coerce(body.sales_legal_fees ?? 0),
    marketing_costs: coerce(body.marketing_costs ?? 0),
    // Taxation
    is_owner_occupied: Boolean(body.is_owner_occupied),
    owner_occupied_share_pct: coerce(
      body.owner_occupied_share_pct ?? (body.is_owner_occupied ? 1 : 0)
    ),
    apply_cgt_discount: Boolean(body.apply_cgt_discount ?? true),
    taxable_profit_rate: coerce(body.taxable_profit_rate ?? 0),
    // Contingency
    contingency_pct: coerce(body.contingency_pct ?? 0),
  }
  const result = calculateFeasibility(inputs)
  return Response.json(result)
}
