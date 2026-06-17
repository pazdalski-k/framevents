import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
)

type CartItem = {
  photoId: number
  eventId: number
  price: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const origin =
      request.headers.get('origin') ||
      'http://localhost:3000'

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
              name: 'FramEvent Full Gallery Access',
              description: eventTitle || 'Full event gallery access',
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
            name: `FramEvent Photo #${item.photoId}`,
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
              name: `FramEvent Photo #${photoId}`,
              description: `Event ID: ${eventId}`,
            },
          },
        },
      ]
    }

    const session =
      await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
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
    console.error('Stripe checkout error:', error)

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