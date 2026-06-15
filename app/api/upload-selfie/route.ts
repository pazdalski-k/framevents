import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
        },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'File must be an image',
        },
        { status: 400 }
      )
    }

    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg'

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`

    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('selfies')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          error: uploadError.message,
        },
        { status: 500 }
      )
    }

    const { data: faceSearch, error: insertError } =
      await supabaseAdmin
        .from('face_searches')
        .insert([
          {
            selfie_file_name: fileName,
            status: 'pending',
            matches_found: 0,
            event_id: null,
          },
        ])
        .select()
        .single()

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: insertError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      fileName,
      faceSearchId: faceSearch.id,
    })
  } catch (error) {
    console.log('UPLOAD SELFIE ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
      },
      { status: 500 }
    )
  }
}