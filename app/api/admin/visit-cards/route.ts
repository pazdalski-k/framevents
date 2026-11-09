import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function isAdmin(request: NextRequest) {
  const adminSessionToken = process.env.ADMIN_SESSION_TOKEN
  const adminCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  return Boolean(
    adminSessionToken &&
      adminCookie &&
      adminCookie === adminSessionToken
  )
}

function emptyToNull(value: unknown) {
  if (typeof value !== 'string') return value ?? null

  const trimmed = value.trim()

  return trimmed === '' ? null : trimmed
}

function prepareCardPayload(body: Record<string, unknown>) {
  const slug =
    typeof body.slug === 'string'
      ? body.slug
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      : ''

  const allowedThemes = ['classic', 'dark', 'brand']

  const theme =
    typeof body.theme === 'string' &&
    allowedThemes.includes(body.theme)
      ? body.theme
      : 'dark'

  const subscriptionPrice =
    body.subscription_price === null ||
    body.subscription_price === undefined ||
    body.subscription_price === ''
      ? null
      : Number(body.subscription_price)

  return {
    slug,

    first_name: emptyToNull(body.first_name),
    last_name: emptyToNull(body.last_name),
    company: emptyToNull(body.company),
    job_title: emptyToNull(body.job_title),

    phone: emptyToNull(body.phone),
    email: emptyToNull(body.email),
    address: emptyToNull(body.address),

    website: emptyToNull(body.website),
    linkedin: emptyToNull(body.linkedin),
    instagram: emptyToNull(body.instagram),
    facebook: emptyToNull(body.facebook),
    whatsapp: emptyToNull(body.whatsapp),

    bio: emptyToNull(body.bio),

    logo_url: emptyToNull(body.logo_url),
    photo_url: emptyToNull(body.photo_url),

    theme,
    brand_color:
      typeof body.brand_color === 'string' &&
      /^#[0-9a-fA-F]{6}$/.test(body.brand_color)
        ? body.brand_color
        : '#d6a85f',

    published: body.published !== false,

    subscription_start_date: emptyToNull(
      body.subscription_start_date
    ),

    subscription_end_date: emptyToNull(
      body.subscription_end_date
    ),

    subscription_plan: emptyToNull(
      body.subscription_plan
    ),

    subscription_price:
      subscriptionPrice !== null &&
      Number.isFinite(subscriptionPrice) &&
      subscriptionPrice >= 0
        ? subscriptionPrice
        : null,

    subscription_notes: emptyToNull(
      body.subscription_notes
    ),

    updated_at: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('visit_cards')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      cards: data || [],
    })
  } catch (error) {
    console.error('Visit Cards GET error:', error)

    return NextResponse.json(
      { error: 'Could not load Visit Cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const payload = prepareCardPayload(body)

    if (!payload.slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('visit_cards')
      .insert(payload)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error:
              'Une Visit Card utilise déjà ce slug.',
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      card: data,
    })
  } catch (error) {
    console.error('Visit Cards POST error:', error)

    return NextResponse.json(
      { error: 'Could not create Visit Card' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (
      typeof body.id !== 'string' ||
      !body.id.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing Visit Card id' },
        { status: 400 }
      )
    }

    const payload = prepareCardPayload(body)

    if (!payload.slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('visit_cards')
      .update(payload)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          {
            error:
              'Une Visit Card utilise déjà ce slug.',
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      card: data,
    })
  } catch (error) {
    console.error('Visit Cards PUT error:', error)

    return NextResponse.json(
      { error: 'Could not update Visit Card' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing Visit Card id' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin
      .from('visit_cards')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Visit Cards DELETE error:', error)

    return NextResponse.json(
      { error: 'Could not delete Visit Card' },
      { status: 500 }
    )
  }
}
