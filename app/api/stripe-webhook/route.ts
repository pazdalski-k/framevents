import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'stripe webhook endpoint works',
  })
}

export async function POST() {
  return NextResponse.json({
    received: true,
  })
}