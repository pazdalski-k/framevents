import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.framevents.fr'

type CartItem = {
  photoId: number
  eventId: number
  price: number
}

function getSiteUrl(request: Request) {
  const origin = request.headers.get('origin')

  if (origin && !origin.includes('localhost')) {
    return origin
  }

  return PUBLIC_SITE_URL
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error: 'Missing STRIPE_SECRET_KEY',
        },
        {
          status: 500,
        }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const body = await request.json()
    const origin = getSiteUrl(request)

    const {
      photoId,
      eventId,
      eventTitle,
      price,
      items,
      type,
    } = body

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (type === 'gallery') {
      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(Number(price) * 100),
            product_data: {
              name: 'FramEvents Full Gallery Access',
              description:
                eventTitle || 'Full event gallery access',
            },
          },
        },
      ]
    } else if (Array.isArray(items) && items.length > 0) {
      lineItems = items.map((item: CartItem) => ({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: {
            name: `FramEvents Photo #${item.photoId}`,
            description: `Event ID: ${item.eventId}`,
          },
        },
      }))
    } else {
      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(Number(price) * 100),
            product_data: {
              name: `FramEvents Photo #${photoId}`,
              description: `Event ID: ${eventId}`,
            },
          },
        },
      ]
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: [
        'card',
        'paypal',
        'revolut_pay',
      ],

      line_items: lineItems,

      metadata: {
        type:
          type === 'gallery'
            ? 'gallery'
            : Array.isArray(items) && items.length > 0
            ? 'cart'
            : 'single_photo',

        photoId: photoId ? String(photoId) : '',
        eventId: eventId ? String(eventId) : '',

        items:
          Array.isArray(items) && items.length > 0
            ? JSON.stringify(
                items.map((item: CartItem) => ({
                  photoId: item.photoId,
                  eventId: item.eventId,
                }))
              )
            : '',
      },

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    console.error(
      'Stripe checkout error:',
      JSON.stringify(error, null, 2)
    )

    return NextResponse.json(
      {
        error: 'Unable to create checkout session',
      },
      {
        status: 500,
      }
    )
  }
}