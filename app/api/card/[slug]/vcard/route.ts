import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function escapeVCard(value: string | null | undefined) {
  return (value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data: card, error } = await supabase
    .from('visit_cards')
    .select(`
      slug,
      first_name,
      last_name,
      company,
      job_title,
      phone,
      email,
      address,
      website,
      linkedin,
      instagram,
      facebook
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !card) {
    return NextResponse.json(
      { error: 'Visit Card not found' },
      { status: 404 }
    )
  }

  const fullName =
    [card.first_name, card.last_name]
      .filter(Boolean)
      .join(' ') ||
    card.company ||
    'Contact'

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(card.last_name)};${escapeVCard(card.first_name)};;;`,
    `FN:${escapeVCard(fullName)}`,
  ]

  if (card.company) {
    lines.push(`ORG:${escapeVCard(card.company)}`)
  }

  if (card.job_title) {
    lines.push(`TITLE:${escapeVCard(card.job_title)}`)
  }

  if (card.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCard(card.phone)}`)
  }

  if (card.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(card.email)}`)
  }

  if (card.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(card.address)};;;;`)
  }

  if (card.website) {
    lines.push(`URL:${escapeVCard(card.website)}`)
  }

  if (card.linkedin) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=linkedin:${escapeVCard(card.linkedin)}`
    )
  }

  if (card.instagram) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=instagram:${escapeVCard(card.instagram)}`
    )
  }

  if (card.facebook) {
    lines.push(
      `X-SOCIALPROFILE;TYPE=facebook:${escapeVCard(card.facebook)}`
    )
  }

  lines.push('END:VCARD')

  const vcard = '\uFEFF' + lines.join('\r\n')

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.vcf"`,
      'Cache-Control': 'no-store',
    },
  })
}
