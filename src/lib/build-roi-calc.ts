export interface CalculatorInputs {
  // Project basics
  land_price: number
  existing_house_value: number
  hold_years: number
  annual_market_growth: number

  // Construction & site costs
  build_cost: number
  demolition_cost: number
  excavation_cost: number
  tree_removal_cost: number
  rock_removal_cost: number
  traffic_control_cost: number
  site_remediation_cost: number
  geotech_cost: number
  basix_and_sustainability_cost: number
  utility_connection_cost: number
  driveway_landscaping_cost: number
  allowance_variations: number

  // Professional & approval fees
  architect_design_fees: number
  engineering_fees: number
  council_approval_costs: number
  certifier_fees: number
  surveyors_fees: number
  legal_fees_purchase: number

  // Tax, duty & GST
  gst_on_build: boolean
  gst_rate: number
  stamp_duty: number

  // Finance & holding costs
  deposit: number
  loan_interest_rate: number
  loan_term_years: number
  interest_during_construction_months: number
  bank_fee_upfront: number
  valuation_fee: number
  mortgage_insurance: number

  // Holding & operating
  rates_per_year: number
  insurance_per_year: number
  utilities_per_month: number
  property_management_per_year: number

  // Selling costs
  agent_commission_pct: number
  sales_legal_fees: number
  marketing_costs: number

  // Taxation
  is_owner_occupied: boolean
  owner_occupied_share_pct: number
  apply_cgt_discount: boolean
  taxable_profit_rate: number

  // Contingency & margin
  contingency_pct: number
}

export interface CalculatorOutputs {
  subtotal_construction: number
  subtotal_professional: number
  subtotal_site: number
  gst_amount: number
  total_project_cost_before_finance: number
  total_finance_costs: number
  total_holding_costs: number
  total_project_cost_all_in: number

  resale_after_hold_years: number
  agent_commission: number
  net_sale_proceeds_before_tax: number
  taxable_gain: number
  estimated_tax: number
  net_profit_after_tax: number
  roi_percent: number
}

export function calculateFeasibility(inputs: CalculatorInputs): CalculatorOutputs {
  const normalizeFraction = (value: number): number => {
    if (!Number.isFinite(value) || value <= 0) return 0
    // If user enters 3, 4, 10 treat as percent (3% => 0.03)
    if (value > 1) return value / 100
    return value
  }

  const annualGrowth = normalizeFraction(inputs.annual_market_growth)
  const gstRate = normalizeFraction(inputs.gst_rate)
  const agentPct = normalizeFraction(inputs.agent_commission_pct)
  const effectiveTaxRate = normalizeFraction(inputs.taxable_profit_rate)
  const ownerOccupiedShare = normalizeFraction(
    typeof inputs.owner_occupied_share_pct === 'number'
      ? inputs.owner_occupied_share_pct
      : inputs.is_owner_occupied
        ? 1
        : 0
  )
  const contingencyRate = normalizeFraction(inputs.contingency_pct)
  const constructionDirectCosts =
    inputs.build_cost +
    inputs.demolition_cost +
    inputs.excavation_cost +
    inputs.tree_removal_cost +
    inputs.rock_removal_cost +
    inputs.traffic_control_cost +
    inputs.site_remediation_cost +
    inputs.geotech_cost +
    inputs.basix_and_sustainability_cost +
    inputs.utility_connection_cost +
    inputs.driveway_landscaping_cost +
    inputs.allowance_variations

  const contingency = constructionDirectCosts * contingencyRate
  const subtotal_construction = constructionDirectCosts + contingency

  const subtotal_professional =
    inputs.architect_design_fees +
    inputs.engineering_fees +
    inputs.council_approval_costs +
    inputs.certifier_fees +
    inputs.surveyors_fees +
    inputs.legal_fees_purchase

  const subtotal_site = 0 // already part of constructionDirectCosts breakdown above

  const gst_amount = inputs.gst_on_build ? inputs.build_cost * gstRate : 0

  const acquisitionCosts = inputs.land_price + inputs.stamp_duty + inputs.legal_fees_purchase

  const total_project_cost_before_finance =
    acquisitionCosts + subtotal_construction + subtotal_professional + gst_amount

  const monthly_interest_rate = inputs.loan_interest_rate / 12
  const interest_months = Math.max(0, inputs.interest_during_construction_months)
  // Approximate average drawn balance at 50% of construction related spend
  const finance_base = subtotal_construction / 2
  const interest_during_construction = finance_base * monthly_interest_rate * interest_months
  const total_finance_costs =
    interest_during_construction +
    inputs.bank_fee_upfront +
    inputs.valuation_fee +
    inputs.mortgage_insurance

  const total_holding_costs =
    inputs.rates_per_year * (inputs.hold_years || 0) +
    inputs.insurance_per_year * (inputs.hold_years || 0) +
    inputs.utilities_per_month * 12 * (inputs.hold_years || 0) +
    inputs.property_management_per_year * (inputs.hold_years || 0)

  const total_project_cost_all_in =
    total_project_cost_before_finance + total_finance_costs + total_holding_costs

  const resale_after_hold_years =
    (inputs.land_price + subtotal_construction) *
    Math.pow(1 + annualGrowth, Math.max(0, inputs.hold_years))

  const agent_commission = resale_after_hold_years * agentPct
  const selling_costs = agent_commission + inputs.sales_legal_fees + inputs.marketing_costs
  const net_sale_proceeds_before_tax = resale_after_hold_years - selling_costs

  const project_basis = total_project_cost_all_in - inputs.deposit // financed portion considered part of cost
  const taxable_gain_raw = Math.max(0, net_sale_proceeds_before_tax - project_basis)
  // Exempt portion for main residence use over the hold period
  let taxable_gain = taxable_gain_raw * (1 - Math.min(Math.max(ownerOccupiedShare, 0), 1))
  // Optional CGT 50% discount for >12 months hold (simplified)
  if (inputs.apply_cgt_discount && inputs.hold_years >= 1 && taxable_gain > 0) taxable_gain *= 0.5
  const estimated_tax =
    inputs.is_owner_occupied && ownerOccupiedShare >= 1 ? 0 : taxable_gain * effectiveTaxRate

  const net_profit_after_tax =
    net_sale_proceeds_before_tax - total_project_cost_all_in - estimated_tax
  const invested_cash = inputs.deposit
  const roi_percent = invested_cash > 0 ? (net_profit_after_tax / invested_cash) * 100 : 0

  return {
    subtotal_construction,
    subtotal_professional,
    subtotal_site,
    gst_amount,
    total_project_cost_before_finance,
    total_finance_costs,
    total_holding_costs,
    total_project_cost_all_in,
    resale_after_hold_years,
    agent_commission,
    net_sale_proceeds_before_tax,
    taxable_gain,
    estimated_tax,
    net_profit_after_tax,
    roi_percent,
  }
}

export const defaultInputs: CalculatorInputs = {
  land_price: 800000,
  existing_house_value: 0,
  hold_years: 3,
  annual_market_growth: 0.05,
  build_cost: 750000,
  demolition_cost: 20000,
  excavation_cost: 0,
  tree_removal_cost: 0,
  rock_removal_cost: 0,
  traffic_control_cost: 0,
  site_remediation_cost: 0,
  geotech_cost: 0,
  basix_and_sustainability_cost: 0,
  utility_connection_cost: 0,
  driveway_landscaping_cost: 20000,
  allowance_variations: 10000,
  architect_design_fees: 0,
  engineering_fees: 0,
  council_approval_costs: 0,
  certifier_fees: 0,
  surveyors_fees: 0,
  legal_fees_purchase: 0,
  gst_on_build: false,
  gst_rate: 0.0,
  stamp_duty: 44000,
  deposit: 300000,
  loan_interest_rate: 0.06,
  loan_term_years: 30,
  interest_during_construction_months: 12,
  bank_fee_upfront: 0,
  valuation_fee: 0,
  mortgage_insurance: 0,
  rates_per_year: 2200,
  insurance_per_year: 1800,
  utilities_per_month: 250,
  property_management_per_year: 0,
  agent_commission_pct: 0.02,
  sales_legal_fees: 2500,
  marketing_costs: 4000,
  is_owner_occupied: true,
  owner_occupied_share_pct: 1,
  apply_cgt_discount: true,
  taxable_profit_rate: 0.25,
  contingency_pct: 0.1,
}
