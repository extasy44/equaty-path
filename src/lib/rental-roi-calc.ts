export interface RentalInputs {
  purchase_price: number
  stamp_duty: number
  closing_costs: number
  rent_per_week: number
  vacancy_weeks: number
  property_management_pct: number
  maintenance_per_year: number
  insurance_per_year: number
  rates_per_year: number
  body_corp_per_year: number
  loan_amount: number
  interest_rate: number
  marginal_tax_rate?: number
  depreciation_per_year?: number
}

export interface RentalOutputs {
  gross_rental_income: number
  net_operating_income: number
  annual_debt_service: number
  cashflow_before_tax: number
  gross_yield_pct: number
  net_yield_pct: number
  cash_on_cash_pct: number
  total_initial_cash: number
  taxable_profit: number
  tax_effect: number
  cashflow_after_tax: number
}

export const defaultRentalInputs: RentalInputs = {
  purchase_price: 900000,
  stamp_duty: 35000,
  closing_costs: 5000,
  rent_per_week: 900,
  vacancy_weeks: 2,
  property_management_pct: 0.06,
  maintenance_per_year: 1500,
  insurance_per_year: 1200,
  rates_per_year: 2500,
  body_corp_per_year: 0,
  loan_amount: 720000,
  interest_rate: 0.065,
  marginal_tax_rate: 0.37,
  depreciation_per_year: 2500,
}

export function calculateRentalRoi(i: RentalInputs): RentalOutputs {
  const gross_rental_income = i.rent_per_week * (52 - i.vacancy_weeks)
  const operating_expenses =
    i.maintenance_per_year +
    i.insurance_per_year +
    i.rates_per_year +
    i.body_corp_per_year +
    gross_rental_income * i.property_management_pct

  const net_operating_income = gross_rental_income - operating_expenses
  const annual_debt_service = i.loan_amount * i.interest_rate
  const cashflow_before_tax = net_operating_income - annual_debt_service

  const depreciation = i.depreciation_per_year ?? 0
  const mtr = i.marginal_tax_rate ?? 0
  const taxable_profit = net_operating_income - annual_debt_service - depreciation
  const tax_effect = -taxable_profit * mtr
  const cashflow_after_tax = cashflow_before_tax + tax_effect

  const total_initial_cash = i.purchase_price + i.stamp_duty + i.closing_costs - i.loan_amount
  const gross_yield_pct = (gross_rental_income / i.purchase_price) * 100
  const net_yield_pct = (net_operating_income / i.purchase_price) * 100
  const cash_on_cash_pct =
    total_initial_cash > 0 ? (cashflow_before_tax / total_initial_cash) * 100 : 0

  return {
    gross_rental_income,
    net_operating_income,
    annual_debt_service,
    cashflow_before_tax,
    gross_yield_pct,
    net_yield_pct,
    cash_on_cash_pct,
    total_initial_cash,
    taxable_profit,
    tax_effect,
    cashflow_after_tax,
  }
}

export type RentalCalcModule = object
