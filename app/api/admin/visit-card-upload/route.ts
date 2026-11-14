import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'
const BUCKET = 'visit-card-assets'
const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function isAdmin(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return Boolean(
    session &&
    process.env.ADMIN_SESSION_TOKEN &&
    session === process.env.ADMIN_SESSION_TOKEN
  )
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase configuration missing')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const kind = formData.get('kind') === 'photo' ? 'photos' : 'logos'

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG and WEBP images are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5 MB.' },
        { status: 400 }
      )
    }

    const extension =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'jpg'

    const fileName = `${kind}/${Date.now()}-${crypto.randomUUID()}.${extension}`

    const supabase = getSupabaseAdmin()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('VISIT CARD UPLOAD ERROR:', uploadError)

      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      path: fileName,
    })
  } catch (error) {
    console.error('VISIT CARD UPLOAD ERROR:', error)

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}


export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const url = typeof body.url === 'string' ? body.url : ''

    if (!url) {
      return NextResponse.json(
        { error: 'Missing file URL' },
        { status: 400 }
      )
    }

    const marker = `/storage/v1/object/public/${BUCKET}/`
    const markerIndex = url.indexOf(marker)

    if (markerIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      )
    }

    const encodedPath = url
      .slice(markerIndex + marker.length)
      .split('?')[0]

    const filePath = decodeURIComponent(encodedPath)

    const supabase = getSupabaseAdmin()

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([filePath])

    if (error) {
      console.error('VISIT CARD DELETE ERROR:', error)

      return NextResponse.json(
        { error: 'Could not delete file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('VISIT CARD DELETE ERROR:', error)

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
