import { NextRequest } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { calculateFeasibility, type CalculatorInputs } from '@/lib/build-roi-calc'

export async function POST(req: NextRequest) {
  const inputs = (await req.json()) as CalculatorInputs
  const outputs = calculateFeasibility(inputs)

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const draw = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0.1, 0.1, 0.1) })
  }

  let y = 800
  draw('ReBuild ROI — Feasibility Report', 40, y, 18)
  y -= 28
  draw('Inputs', 40, y, 14)
  y -= 18
  const inputLines = [
    `Land price: $${inputs.land_price.toLocaleString()}`,
    `Hold years: ${inputs.hold_years}`,
    `Annual growth: ${(inputs.annual_market_growth * 100).toFixed(1)}%`,
    `Build cost (ex GST): $${inputs.build_cost.toLocaleString()}`,
  ]
  inputLines.forEach((line) => {
    draw(line, 40, y)
    y -= 16
  })

  y -= 10
  draw('Snapshot', 40, y, 14)
  y -= 18
  const lines = [
    `Total project cost (all-in): $${Math.round(outputs.total_project_cost_all_in).toLocaleString()}`,
    `Resale after hold years: $${Math.round(outputs.resale_after_hold_years).toLocaleString()}`,
    `Estimated tax: $${Math.round(outputs.estimated_tax).toLocaleString()}`,
    `ROI: ${outputs.roi_percent.toFixed(1)}%`,
  ]
  lines.forEach((line) => {
    draw(line, 40, y)
    y -= 16
  })

  const pdfBytes = await pdfDoc.save()
  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="equitypath-report.pdf"',
    },
  })
}
