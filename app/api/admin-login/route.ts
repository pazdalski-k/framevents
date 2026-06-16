import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const password = body.password

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        success: false,
        error: 'ADMIN_PASSWORD is not configured',
      },
      { status: 500 }
    )
  }

  if (password !== process.env.ADMIN_PASSWORD) {
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

  response.cookies.set('framevent_admin', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}