import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import JSZip from 'jszip'

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

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

  if (metadata.type !== 'gallery') {
    return NextResponse.json(
      { error: 'This order is not a gallery purchase' },
      { status: 400 }
    )
  }

  const eventId = metadata.eventId
    ? Number(metadata.eventId)
    : null

  if (!eventId) {
    return NextResponse.json(
      { error: 'Missing eventId' },
      { status: 400 }
    )
  }

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('title')
    .eq('id', eventId)
    .single()

  const { data: photos, error } = await supabaseAdmin
    .from('photos')
    .select('id, file_name, hd_file_name')
    .eq('event_id', eventId)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  const validPhotos =
    (photos || []).filter(
      (photo) => photo.hd_file_name
    )

  if (validPhotos.length === 0) {
    return NextResponse.json(
      { error: 'No HD files found for this gallery' },
      { status: 404 }
    )
  }

  const zip = new JSZip()

  for (const photo of validPhotos) {
    const { data, error: downloadError } =
      await supabaseAdmin.storage
        .from('event-photos-hd')
        .download(photo.hd_file_name)

    if (downloadError || !data) {
      continue
    }

    const arrayBuffer = await data.arrayBuffer()

    zip.file(
      photo.file_name || photo.hd_file_name,
      arrayBuffer
    )
  }

  const zipBuffer = await zip.generateAsync({
    type: 'arraybuffer',
  })

  const safeTitle =
    event?.title
      ?.replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .toLowerCase() || 'framevent-gallery'

  return new Response(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${safeTitle}.zip"`,
    },
  })
}