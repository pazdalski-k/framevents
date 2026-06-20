import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

type MetadataCartItem = {
  photoId: number
  eventId: number
}

export async function GET(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      )
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase config' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey
    )

    const { searchParams } = new URL(request.url)

    const fileName = searchParams.get('file')
    const sessionId = searchParams.get('sessionId')

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing file name' },
        { status: 400 }
      )
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      )
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 403 }
      )
    }

    const metadata = session.metadata || {}
    const purchaseType = metadata.type
    const eventId = metadata.eventId
      ? Number(metadata.eventId)
      : null

    let allowedPhotoIds: number[] = []

    if (purchaseType === 'single_photo' && metadata.photoId) {
      allowedPhotoIds = [Number(metadata.photoId)]
    }

    if (purchaseType === 'cart' && metadata.items) {
      const items = JSON.parse(metadata.items) as MetadataCartItem[]

      allowedPhotoIds = items.map((item) =>
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
          { error: galleryError.message },
          { status: 500 }
        )
      }

      allowedPhotoIds =
        galleryPhotos?.map((photo) => photo.id) || []
    }

    if (allowedPhotoIds.length === 0) {
      return NextResponse.json(
        { error: 'No purchased photos found' },
        { status: 403 }
      )
    }

    const { data: photo, error: photoError } =
      await supabaseAdmin
        .from('photos')
        .select('id, hd_file_name')
        .eq('hd_file_name', fileName)
        .in('id', allowedPhotoIds)
        .maybeSingle()

    if (photoError || !photo) {
      return NextResponse.json(
        { error: 'This file is not part of this order' },
        { status: 403 }
      )
    }

    const { data, error } = await supabaseAdmin.storage
      .from('event-photos-hd')
      .download(fileName)

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'File not found' },
        { status: 404 }
      )
    }

    const arrayBuffer = await data.arrayBuffer()

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Download photo error:', error)

    return NextResponse.json(
      { error: 'Could not download photo' },
      { status: 500 }
    )
  }
}