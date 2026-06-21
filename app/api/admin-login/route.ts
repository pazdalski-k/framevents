import { NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'framevents_admin_session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = body.password

    const adminPassword = process.env.ADMIN_PASSWORD
    const adminSessionToken = process.env.ADMIN_SESSION_TOKEN

    if (!adminPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'ADMIN_PASSWORD is not configured',
        },
        { status: 500 }
      )
    }

    if (!adminSessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'ADMIN_SESSION_TOKEN is not configured',
        },
        { status: 500 }
      )
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wrong password',
        },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
    })

    response.cookies.set(ADMIN_COOKIE_NAME, adminSessionToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    })

    return response
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    )
  }
}