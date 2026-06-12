import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
)

export async function POST(request: Request) {
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

  let lineItems

  if (type === 'gallery') {
    lineItems = [
      {
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: Number(price) * 100,
          product_data: {
            name: `Full Gallery Access`,
            description: eventTitle,
          },
        },
      },
    ]
  } else if (items) {
    lineItems = items.map((item: any) => ({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Number(item.price) * 100,
        product_data: {
          name: `EventFrame Photo #${item.photoId}`,
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
          unit_amount: Number(price) * 100,
          product_data: {
            name: `EventFrame Photo #${photoId}`,
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
            : items
            ? 'cart'
            : 'single_photo',

        photoId: photoId
          ? String(photoId)
          : '',

        eventId: eventId
          ? String(eventId)
          : '',

        items: items
          ? JSON.stringify(
              items.map(
                (item: any) => item.photoId
              )
            )
          : '',
      },

      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    })

  return NextResponse.json({
    url: session.url,
  })
}