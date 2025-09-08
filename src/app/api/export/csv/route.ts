import { NextRequest } from 'next/server'
import { calculateFeasibility, type CalculatorInputs } from '@/lib/build-roi-calc'

export async function POST(req: NextRequest) {
  const inputs = (await req.json()) as CalculatorInputs
  const outputs = calculateFeasibility(inputs)

  const allInputs: Array<[string, string | number | boolean]> = [
    ['land_price', inputs.land_price],
    ['existing_house_value', inputs.existing_house_value],
    ['hold_years', inputs.hold_years],
    ['annual_market_growth', inputs.annual_market_growth],
    ['build_cost', inputs.build_cost],
    ['demolition_cost', inputs.demolition_cost],
    ['excavation_cost', inputs.excavation_cost],
    ['tree_removal_cost', inputs.tree_removal_cost],
    ['rock_removal_cost', inputs.rock_removal_cost],
    ['traffic_control_cost', inputs.traffic_control_cost],
    ['site_remediation_cost', inputs.site_remediation_cost],
    ['geotech_cost', inputs.geotech_cost],
    ['basix_and_sustainability_cost', inputs.basix_and_sustainability_cost],
    ['utility_connection_cost', inputs.utility_connection_cost],
    ['driveway_landscaping_cost', inputs.driveway_landscaping_cost],
    ['allowance_variations', inputs.allowance_variations],
    ['architect_design_fees', inputs.architect_design_fees],
    ['engineering_fees', inputs.engineering_fees],
    ['council_approval_costs', inputs.council_approval_costs],
    ['certifier_fees', inputs.certifier_fees],
    ['surveyors_fees', inputs.surveyors_fees],
    ['legal_fees_purchase', inputs.legal_fees_purchase],
    ['gst_on_build', inputs.gst_on_build],
    ['gst_rate', inputs.gst_rate],
    ['stamp_duty', inputs.stamp_duty],
    ['deposit', inputs.deposit],
    ['loan_interest_rate', inputs.loan_interest_rate],
    ['loan_term_years', inputs.loan_term_years],
    ['interest_during_construction_months', inputs.interest_during_construction_months],
    ['bank_fee_upfront', inputs.bank_fee_upfront],
    ['valuation_fee', inputs.valuation_fee],
    ['mortgage_insurance', inputs.mortgage_insurance],
    ['rates_per_year', inputs.rates_per_year],
    ['insurance_per_year', inputs.insurance_per_year],
    ['utilities_per_month', inputs.utilities_per_month],
    ['property_management_per_year', inputs.property_management_per_year],
    ['agent_commission_pct', inputs.agent_commission_pct],
    ['sales_legal_fees', inputs.sales_legal_fees],
    ['marketing_costs', inputs.marketing_costs],
    ['is_owner_occupied', inputs.is_owner_occupied],
    ['taxable_profit_rate', inputs.taxable_profit_rate],
    ['contingency_pct', inputs.contingency_pct],
  ]

  const allOutputs: Array<[string, string | number]> = [
    ['subtotal_construction', Math.round(outputs.subtotal_construction)],
    ['subtotal_professional', Math.round(outputs.subtotal_professional)],
    ['subtotal_site', Math.round(outputs.subtotal_site)],
    ['gst_amount', Math.round(outputs.gst_amount)],
    ['total_project_cost_before_finance', Math.round(outputs.total_project_cost_before_finance)],
    ['total_finance_costs', Math.round(outputs.total_finance_costs)],
    ['total_holding_costs', Math.round(outputs.total_holding_costs)],
    ['total_project_cost_all_in', Math.round(outputs.total_project_cost_all_in)],
    ['resale_after_hold_years', Math.round(outputs.resale_after_hold_years)],
    ['agent_commission', Math.round(outputs.agent_commission)],
    ['net_sale_proceeds_before_tax', Math.round(outputs.net_sale_proceeds_before_tax)],
    ['taxable_gain', Math.round(outputs.taxable_gain)],
    ['estimated_tax', Math.round(outputs.estimated_tax)],
    ['net_profit_after_tax', Math.round(outputs.net_profit_after_tax)],
    ['roi_percent', Number(outputs.roi_percent.toFixed(2))],
  ]

  const header = ['section', 'key', 'value']
  const inputRows = allInputs.map(([k, v]) => `input,${k},${v}`)
  const outputRows = allOutputs.map(([k, v]) => `output,${k},${v}`)
  const csv = [header.join(','), ...inputRows, ...outputRows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="equitypath-export.csv"',
    },
  })
}
