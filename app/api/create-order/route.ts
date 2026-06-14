import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: Request) {
  const body = await request.json()
  const { sessionId } = body

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing sessionId' },
      { status: 400 }
    )
  }

  const session =
    await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    )
  }

  const metadata = session.metadata || {}

  const purchaseType = metadata.type || 'unknown'

  const eventId = metadata.eventId
    ? Number(metadata.eventId)
    : null

  const amount = session.amount_total
    ? session.amount_total / 100
    : 0

  const customerEmail =
    session.customer_details?.email || null

  const photoIds =
    purchaseType === 'cart'
      ? metadata.items || ''
      : metadata.photoId || ''

  const { data: existingOrder } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session.id)
    .maybeSingle()

  if (existingOrder) {
    return NextResponse.json({
      success: true,
      order: existingOrder,
      purchaseType,
      photoIds,
    })
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .insert([
      {
        stripe_session_id: session.id,
        status: 'paid',
        amount,
        customer_email: customerEmail,
        event_id: eventId,
        photo_id: null,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    order,
    purchaseType,
    photoIds,
  })
}