import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
)

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

function getSiteUrl(request: Request) {
  const origin = request.headers.get('origin')

  if (origin) {
    return origin
  }

  return 'http://localhost:3000'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const siteUrl = getSiteUrl(request)

    const session =
      await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const metadata = session.metadata || {}
    const purchaseType = metadata.type || 'unknown'

    const eventId = metadata.eventId
      ? Number(metadata.eventId)
      : null

    const singlePhotoId = metadata.photoId
      ? Number(metadata.photoId)
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
          photo_id:
            purchaseType === 'single_photo'
              ? singlePhotoId
              : null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    let eventTitle = 'FramEvent Gallery'

    if (eventId) {
      const { data: event } = await supabaseAdmin
        .from('events')
        .select('title')
        .eq('id', eventId)
        .single()

      if (event?.title) {
        eventTitle = event.title
      }
    }

    if (customerEmail) {
      const downloadPageUrl =
        `${siteUrl}/success?session_id=${session.id}`

      await resend.emails.send({
        from: 'FramEvent <onboarding@resend.dev>',
        to: customerEmail,
        subject: 'FramEvent – Your photos are ready / Vos photos sont prêtes',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2>FramEvent</h2>

            <p><strong>🇫🇷 Français</strong></p>
            <p>Merci pour votre achat.</p>
            <p>Votre commande pour <strong>${eventTitle}</strong> est prête.</p>
            <p>Vous pouvez télécharger vos photos ici :</p>
            <p>
              <a href="${downloadPageUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;">
                Télécharger mes photos
              </a>
            </p>

            <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />

            <p><strong>🇬🇧 English</strong></p>
            <p>Thank you for your purchase.</p>
            <p>Your order for <strong>${eventTitle}</strong> is ready.</p>
            <p>You can download your photos here:</p>
            <p>
              <a href="${downloadPageUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;">
                Download my photos
              </a>
            </p>

            <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />

            <p style="font-size:14px;color:#555;">
              FramEvent<br />
              Krzysztof Pazdalski
            </p>
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
      {
        success: false,
        error: 'Could not create order',
      },
      {
        status: 500,
      }
    )
  }
}