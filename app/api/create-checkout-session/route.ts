import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.framevents.fr'

type CartItem = {
  photoId: number
  eventId: number
}

function getSiteUrl(request: Request) {
  const origin = request.headers.get('origin')

  if (origin && !origin.includes('localhost')) {
    return origin
  }

  return PUBLIC_SITE_URL
}

function isPositiveInteger(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0
  )
}

function priceToCents(value: unknown) {
  const price = Number(value)

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Invalid product price')
  }

  return Math.round(price * 100)
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
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
    const supabaseAdmin = getSupabaseAdmin()

    const body = await request.json()
    const origin = getSiteUrl(request)

    const {
      photoId,
      eventId,
      items,
      type,
    } = body

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let checkoutType = 'single_photo'
    let metadataEventId = ''
    let metadataPhotoId = ''
    let metadataItems = ''

    /*
     * FULL GALLERY
     *
     * Cena pochodzi wyłącznie z bazy danych.
     */
    if (type === 'gallery') {
      if (!isPositiveInteger(eventId)) {
        return NextResponse.json(
          { error: 'Invalid eventId' },
          { status: 400 }
        )
      }

      const { data: event, error: eventError } =
        await supabaseAdmin
          .from('events')
          .select(
            'id, title, gallery_price, sales_enabled, sales_end_date'
          )
          .eq('id', eventId)
          .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      if (event.sales_enabled === false) {
        return NextResponse.json(
          { error: 'Sales are disabled for this event' },
          { status: 400 }
        )
      }

      if (
        event.sales_end_date &&
        new Date(event.sales_end_date).getTime() < Date.now()
      ) {
        return NextResponse.json(
          { error: 'Sales period has ended' },
          { status: 400 }
        )
      }

      const galleryPrice = priceToCents(event.gallery_price)

      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: galleryPrice,
            product_data: {
              name: 'FramEvents – Galerie complète',
              description:
                event.title || 'Accès à la galerie complète',
            },
          },
        },
      ]

      checkoutType = 'gallery'
      metadataEventId = String(event.id)
    }

    /*
     * CART / MULTIPLE PHOTOS
     *
     * Żadna cena przesłana przez klienta nie jest używana.
     */
    else if (Array.isArray(items) && items.length > 0) {
      if (items.length > 100) {
        return NextResponse.json(
          { error: 'Too many photos' },
          { status: 400 }
        )
      }

      const normalizedItems = items.map((item: CartItem) => ({
        photoId: Number(item.photoId),
        eventId: Number(item.eventId),
      }))

      if (
        normalizedItems.some(
          (item) =>
            !isPositiveInteger(item.photoId) ||
            !isPositiveInteger(item.eventId)
        )
      ) {
        return NextResponse.json(
          { error: 'Invalid cart items' },
          { status: 400 }
        )
      }

      const photoIds = normalizedItems.map((item) => item.photoId)

      const { data: photos, error: photosError } =
        await supabaseAdmin
          .from('photos')
          .select('id, event_id')
          .in('id', photoIds)

      if (photosError || !photos) {
        return NextResponse.json(
          { error: 'Unable to verify photos' },
          { status: 500 }
        )
      }

      if (photos.length !== normalizedItems.length) {
        return NextResponse.json(
          { error: 'One or more photos do not exist' },
          { status: 400 }
        )
      }

      const verifiedItems = normalizedItems.map((item) => {
        const photo = photos.find(
          (candidate) => candidate.id === item.photoId
        )

        if (!photo || Number(photo.event_id) !== item.eventId) {
          throw new Error(
            `Photo ${item.photoId} does not belong to event ${item.eventId}`
          )
        }

        return item
      })

      const eventIds = [
        ...new Set(verifiedItems.map((item) => item.eventId)),
      ]

      const { data: events, error: eventsError } =
        await supabaseAdmin
          .from('events')
          .select(
            'id, title, photo_price, sales_enabled, sales_end_date'
          )
          .in('id', eventIds)

      if (eventsError || !events) {
        return NextResponse.json(
          { error: 'Unable to verify events' },
          { status: 500 }
        )
      }

      const eventMap = new Map(
        events.map((event) => [Number(event.id), event])
      )

      const verifiedEvents = verifiedItems.map((item) => {
        const event = eventMap.get(item.eventId)

        if (!event) {
          throw new Error(`Event ${item.eventId} not found`)
        }

        if (event.sales_enabled === false) {
          throw new Error(
            `Sales are disabled for event ${item.eventId}`
          )
        }

        if (
          event.sales_end_date &&
          new Date(event.sales_end_date).getTime() < Date.now()
        ) {
          throw new Error(
            `Sales period has ended for event ${item.eventId}`
          )
        }

        return {
          item,
          event,
          price: priceToCents(event.photo_price),
        }
      })

      lineItems = verifiedEvents.map(({ item, event, price }) => ({
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: price,
          product_data: {
            name: `FramEvents – Photo #${item.photoId}`,
            description: event.title
              ? `${event.title} — Photo #${item.photoId}`
              : `Événement #${item.eventId}`,
          },
        },
      }))

      checkoutType = 'cart'

      const uniqueEventIds = [
        ...new Set(verifiedItems.map((item) => item.eventId)),
      ]

      metadataEventId =
        uniqueEventIds.length === 1
          ? String(uniqueEventIds[0])
          : ''

      metadataItems = JSON.stringify(verifiedItems)
    }

    /*
     * SINGLE PHOTO
     *
     * Cena pochodzi z events.photo_price.
     */
    else {
      if (
        !isPositiveInteger(photoId) ||
        !isPositiveInteger(eventId)
      ) {
        return NextResponse.json(
          { error: 'Invalid photoId or eventId' },
          { status: 400 }
        )
      }

      const { data: photo, error: photoError } =
        await supabaseAdmin
          .from('photos')
          .select('id, event_id')
          .eq('id', photoId)
          .single()

      if (photoError || !photo) {
        return NextResponse.json(
          { error: 'Photo not found' },
          { status: 404 }
        )
      }

      if (Number(photo.event_id) !== eventId) {
        return NextResponse.json(
          { error: 'Photo does not belong to this event' },
          { status: 400 }
        )
      }

      const { data: event, error: eventError } =
        await supabaseAdmin
          .from('events')
          .select(
            'id, title, photo_price, sales_enabled, sales_end_date'
          )
          .eq('id', eventId)
          .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      if (event.sales_enabled === false) {
        return NextResponse.json(
          { error: 'Sales are disabled for this event' },
          { status: 400 }
        )
      }

      if (
        event.sales_end_date &&
        new Date(event.sales_end_date).getTime() < Date.now()
      ) {
        return NextResponse.json(
          { error: 'Sales period has ended' },
          { status: 400 }
        )
      }

      const photoPrice = priceToCents(event.photo_price)

      lineItems = [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: photoPrice,
            product_data: {
              name: `FramEvents – Photo #${photo.id}`,
              description: event.title
                ? `${event.title} — Photo #${photo.id}`
                : `Événement #${event.id}`,
            },
          },
        },
      ]

      metadataEventId = String(event.id)
      metadataPhotoId = String(photo.id)
    }

    /*
     * CHECKOUT SESSION
     */
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: [
        'card',
        'paypal',
        'revolut_pay',
      ],

      line_items: lineItems,

      customer_creation: 'always',

      invoice_creation: {
        enabled: true,
      },

      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: false,
      },

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
        type: checkoutType,
        photoId: metadataPhotoId,
        eventId: metadataEventId,
        items: metadataItems,
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
      error instanceof Error ? error.message : 'Unknown error'
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
