import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

type MetadataCartItem = {
  photoId: number
  eventId: number
}

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase config' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const metadata = session.metadata || {}
    const purchaseType = metadata.type
    const eventId = metadata.eventId
      ? Number(metadata.eventId)
      : null

    let photoIds: number[] = []

    if (purchaseType === 'single_photo' && metadata.photoId) {
      photoIds = [Number(metadata.photoId)]
    }

    if (purchaseType === 'cart' && metadata.items) {
      const items = JSON.parse(metadata.items) as MetadataCartItem[]

      photoIds = items.map((item) =>
        Number(item.photoId)
      )
    }

    if (purchaseType === 'gallery' && eventId) {
      const { data: galleryPhotos, error: galleryError } =
        await supabaseAdmin
          .from('photos')
          .select('id')
          .eq('event_id', eventId)

      if (galleryError) {
        return NextResponse.json(
          { success: false, error: galleryError.message },
          { status: 500 }
        )
      }

      photoIds =
        galleryPhotos?.map((photo) => photo.id) || []
    }

    if (photoIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No photos found for this order',
        },
        { status: 404 }
      )
    }

    const { data: photos, error } = await supabaseAdmin
      .from('photos')
      .select('id, image_url, file_name, hd_file_name')
      .in('id', photoIds)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    let eventTitle = 'FramEvents Gallery'

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

    const downloads =
      (photos || [])
        .filter((photo) => photo.hd_file_name)
        .map((photo) => ({
          id: photo.id,
          previewUrl: photo.image_url,
          fileName: photo.file_name || photo.hd_file_name,
          hdFileName: photo.hd_file_name,
          downloadUrl: `/api/download-photo?file=${encodeURIComponent(
            photo.hd_file_name
          )}&sessionId=${encodeURIComponent(sessionId)}`,
        }))

    return NextResponse.json({
      success: true,
      purchaseType,
      eventTitle,
      downloads,
    })
  } catch (error) {
    console.error('Get downloads error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Could not load downloads',
      },
      {
        status: 500,
      }
    )
  }
}