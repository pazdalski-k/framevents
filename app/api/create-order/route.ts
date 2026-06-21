import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

function getSiteUrl(request: Request) {
  const origin = request.headers.get('origin')
  return origin || 'http://localhost:3000'
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const resendApiKey = process.env.RESEND_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!stripeSecretKey) {
      return NextResponse.json({ success: false, error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ success: false, error: 'Missing Supabase config' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecretKey)
    const resend = resendApiKey ? new Resend(resendApiKey) : null

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Missing sessionId' }, { status: 400 })
    }

    const siteUrl = getSiteUrl(request)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 })
    }

    const metadata = session.metadata || {}
    const purchaseType = metadata.type || 'unknown'

    const eventId = metadata.eventId ? Number(metadata.eventId) : null
    const singlePhotoId = metadata.photoId ? Number(metadata.photoId) : null
    const amount = session.amount_total ? session.amount_total / 100 : 0
    const customerEmail = session.customer_details?.email || null

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
          photo_id: purchaseType === 'single_photo' ? singlePhotoId : null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    let eventTitle = 'FramEvents Gallery'

    if (eventId) {
      const { data: event } = await supabaseAdmin
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single()

      if (event?.title) eventTitle = event.title
    }

    if (customerEmail && resend) {
      const downloadPageUrl = `${siteUrl}/success?session_id=${session.id}`

      await resend.emails.send({
        from: 'FramEvents <onboarding@resend.dev>',
        to: customerEmail,
        subject: 'FramEvents – Vos photos sont prêtes',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2>FramEvents</h2>
            <p>Merci pour votre achat.</p>
            <p>Votre commande pour <strong>${eventTitle}</strong> est prête.</p>
            <p><a href="${downloadPageUrl}">Télécharger mes photos</a></p>
            <hr />
            <p>Thank you for your purchase.</p>
            <p>Your order for <strong>${eventTitle}</strong> is ready.</p>
            <p><a href="${downloadPageUrl}">Download my photos</a></p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      order,
      purchaseType,
      photoIds,
    })
  } catch (error) {
    console.error('Create order error:', error)

    return NextResponse.json(
      { success: false, error: 'Could not create order' },
      { status: 500 }
    )
  }
}