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

function safePrice(value: unknown) {
  const price = Number(value)

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Invalid product price')
  }

  return Math.round(price * 100)
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

    /*
     * FULL GALLERY
     */
    if (type === 'gallery') {
      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: safePrice(price),
            product_data: {
              name: 'FramEvents – Galerie complète',
              description:
                eventTitle || 'Accès à la galerie complète',
            },
          },
        },
      ]
    }

    /*
     * CART / MULTIPLE PHOTOS
     */
    else if (Array.isArray(items) && items.length > 0) {
      lineItems = items.map((item: CartItem) => ({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: safePrice(item.price),
          product_data: {
            name: `FramEvents – Photo #${item.photoId}`,
            description: `Événement #${item.eventId}`,
          },
        },
      }))
    }

    /*
     * SINGLE PHOTO
     */
    else {
      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: safePrice(price),
            product_data: {
              name: `FramEvents – Photo #${photoId}`,
              description: `Événement #${eventId}`,
            },
          },
        },
      ]
    }

    /*
     * CHECKOUT SESSION
     *
     * Stripe collecte obligatoirement l'adresse
     * de facturation et crée un Customer.
     */
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: [
        'card',
        'paypal',
        'revolut_pay',
      ],

      line_items: lineItems,

      /*
       * Données client nécessaires pour le reçu.
       */
      customer_creation: 'always',

      billing_address_collection: 'required',

      /*
       * Numéro de téléphone facultatif.
       * Il peut être utile pour identifier le client,
       * mais nous ne le rendons pas obligatoire.
       */
      phone_number_collection: {
        enabled: false,
      },

      /*
       * Champ facultatif pour les clients professionnels.
       */
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: "Nom de l'entreprise",
          },
          type: 'text',
          optional: true,
        },
      ],

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