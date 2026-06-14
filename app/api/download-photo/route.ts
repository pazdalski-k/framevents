import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')

  if (!fileName) {
    return NextResponse.json(
      { error: 'Missing file name' },
      { status: 400 }
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
}