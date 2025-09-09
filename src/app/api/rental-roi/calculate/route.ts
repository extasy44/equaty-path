import { NextResponse } from 'next/server'
import { calculateRentalRoi, type RentalInputs } from '@/lib/rental-roi-calc'

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<RentalInputs>
  const inputs = body as RentalInputs
  const outputs = calculateRentalRoi(inputs)
  return NextResponse.json(outputs)
}

export type RentalRoiApiRoute = object
