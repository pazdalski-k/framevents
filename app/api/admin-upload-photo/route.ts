import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

type CreateSignedUrlsPayload = {
  action: 'createSignedUrls'
  eventId: number
  previewFileName: string
  hdFileName: string
}

type ConfirmUploadPayload = {
  action: 'confirmUpload'
  eventId: number
  imageUrl: string
  previewFileName: string
  hdFileName: string
}

type UploadPayload = CreateSignedUrlsPayload | ConfirmUploadPayload

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin config')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

function isValidPath(path: unknown) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    !path.includes('..') &&
    !path.startsWith('/') &&
    path.includes('/')
  )
}

function isValidEventId(eventId: unknown) {
  return (
    typeof eventId === 'number' &&
    Number.isInteger(eventId) &&
    eventId > 0
  )
}

export async function POST(request: NextRequest) {
  try {
    const adminSessionToken = process.env.ADMIN_SESSION_TOKEN
    const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value

    if (!adminSessionToken) {
      return NextResponse.json(
        { error: 'Missing ADMIN_SESSION_TOKEN' },
        { status: 500 }
      )
    }

    if (adminCookie !== adminSessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = (await request.json()) as UploadPayload
    const supabaseAdmin = getSupabaseAdmin()

    if (payload.action === 'createSignedUrls') {
      if (
        !isValidEventId(payload.eventId) ||
        !isValidPath(payload.previewFileName) ||
        !isValidPath(payload.hdFileName)
      ) {
        return NextResponse.json(
          { error: 'Invalid signed upload payload' },
          { status: 400 }
        )
      }

      const { data: previewSignedData, error: previewSignedError } =
        await supabaseAdmin.storage
          .from('event-photos-preview')
          .createSignedUploadUrl(payload.previewFileName)

      if (previewSignedError || !previewSignedData) {
        return NextResponse.json(
          {
            error:
              previewSignedError?.message ||
              'Could not create preview upload URL',
          },
          { status: 500 }
        )
      }

      const { data: hdSignedData, error: hdSignedError } =
        await supabaseAdmin.storage
          .from('event-photos-hd')
          .createSignedUploadUrl(payload.hdFileName)

      if (hdSignedError || !hdSignedData) {
        return NextResponse.json(
          {
            error:
              hdSignedError?.message ||
              'Could not create HD upload URL',
          },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('event-photos-preview')
        .getPublicUrl(payload.previewFileName)

      return NextResponse.json({
        success: true,
        preview: {
          path: payload.previewFileName,
          token: previewSignedData.token,
          imageUrl: publicUrlData.publicUrl,
        },
        hd: {
          path: payload.hdFileName,
          token: hdSignedData.token,
        },
      })
    }

    if (payload.action === 'confirmUpload') {
      if (
        !isValidEventId(payload.eventId) ||
        !isValidPath(payload.previewFileName) ||
        !isValidPath(payload.hdFileName) ||
        typeof payload.imageUrl !== 'string' ||
        !payload.imageUrl.startsWith('https://')
      ) {
        return NextResponse.json(
          { error: 'Invalid confirm upload payload' },
          { status: 400 }
        )
      }

      const { error: insertError } = await supabaseAdmin
        .from('photos')
        .insert({
          event_id: payload.eventId,
          image_url: payload.imageUrl,
          file_name: payload.previewFileName,
          hd_file_name: payload.hdFileName,
        })

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }

      const { count, error: countError } = await supabaseAdmin
        .from('photos')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('event_id', payload.eventId)

      if (!countError) {
        await supabaseAdmin
          .from('events')
          .update({
            photos_count: count || 0,
          })
          .eq('id', payload.eventId)
      }

      return NextResponse.json({
        success: true,
      })
    }

    return NextResponse.json(
      { error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Admin upload photo error:', error)

    return NextResponse.json(
      { error: 'Could not process admin upload' },
      { status: 500 }
    )
  }
}