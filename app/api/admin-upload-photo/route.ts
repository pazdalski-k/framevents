import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

export async function POST(request: Request) {
  try {
    const adminSessionToken = process.env.ADMIN_SESSION_TOKEN
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!adminSessionToken) {
      return NextResponse.json({ error: 'Missing ADMIN_SESSION_TOKEN' }, { status: 500 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase admin config' }, { status: 500 })
    }

    const cookieHeader = request.headers.get('cookie') || ''
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((cookie) => cookie.trim())
        .filter(Boolean)
        .map((cookie) => {
          const [key, ...valueParts] = cookie.split('=')
          return [key, decodeURIComponent(valueParts.join('='))]
        })
    )

    if (cookies[ADMIN_COOKIE_NAME] !== adminSessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const eventIdRaw = formData.get('eventId')
    const previewFileName = formData.get('previewFileName')
    const hdFileName = formData.get('hdFileName')
    const previewFile = formData.get('previewFile')
    const hdFile = formData.get('hdFile')

    const eventId = Number(eventIdRaw)

    if (!eventId || Number.isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid eventId' }, { status: 400 })
    }

    if (
      typeof previewFileName !== 'string' ||
      typeof hdFileName !== 'string' ||
      !(previewFile instanceof File) ||
      !(hdFile instanceof File)
    ) {
      return NextResponse.json({ error: 'Invalid upload payload' }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { error: previewError } = await supabaseAdmin.storage
      .from('event-photos-preview')
      .upload(previewFileName, previewFile, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (previewError) {
      return NextResponse.json({ error: previewError.message }, { status: 500 })
    }

    const { error: hdError } = await supabaseAdmin.storage
      .from('event-photos-hd')
      .upload(hdFileName, hdFile, {
        contentType: hdFile.type || 'application/octet-stream',
        upsert: false,
      })

    if (hdError) {
      await supabaseAdmin.storage
        .from('event-photos-preview')
        .remove([previewFileName])

      return NextResponse.json({ error: hdError.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('event-photos-preview')
      .getPublicUrl(previewFileName)

    const imageUrl = publicUrlData.publicUrl

    const { error: insertError } = await supabaseAdmin
      .from('photos')
      .insert({
        event_id: eventId,
        image_url: imageUrl,
        file_name: previewFileName,
        hd_file_name: hdFileName,
      })

    if (insertError) {
      await supabaseAdmin.storage
        .from('event-photos-preview')
        .remove([previewFileName])

      await supabaseAdmin.storage
        .from('event-photos-hd')
        .remove([hdFileName])

      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    const { count, error: countError } = await supabaseAdmin
      .from('photos')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('event_id', eventId)

    if (!countError) {
      await supabaseAdmin
        .from('events')
        .update({
          photos_count: count || 0,
        })
        .eq('id', eventId)
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      previewFileName,
      hdFileName,
    })
  } catch (error) {
    console.error('Admin upload photo error:', error)

    return NextResponse.json({ error: 'Could not upload photo' }, { status: 500 })
  }
}
