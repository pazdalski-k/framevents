import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing eventId',
        },
        { status: 400 }
      )
    }

    const { data: event, error: eventError } =
      await supabaseAdmin
        .from('events')
        .select('id, title, date, location')
        .eq('id', eventId)
        .single()

    if (eventError || !event) {
      return NextResponse.json({
        success: false,
        error: 'Event not found',
      })
    }

    const { data: subscribers, error: subscribersError } =
      await supabaseAdmin
        .from('event_notifications')
        .select('id, email')
        .eq('event_id', eventId)
        .eq('notified', false)

    if (subscribersError) {
      return NextResponse.json({
        success: false,
        error: subscribersError.message,
      })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
      })
    }

    const galleryUrl = `https://www.framevents.fr/event/${eventId}`

    let sent = 0

    for (const subscriber of subscribers) {
      await resend.emails.send({
        from: 'FramEvent <onboarding@resend.dev>',
        to: subscriber.email,
        subject: 'FramEvent – Gallery ready / Galerie disponible',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2>FramEvent</h2>

            <p><strong>🇫🇷 Français</strong></p>
            <p>
              Bonjour,
            </p>
            <p>
              Les photos de l’événement <strong>${event.title}</strong> sont maintenant disponibles.
            </p>
            <p>
              Vous pouvez accéder à la galerie ici :
            </p>
            <p>
              <a href="${galleryUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;">
                Voir la galerie
              </a>
            </p>

            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />

            <p><strong>🇬🇧 English</strong></p>
            <p>
              Hello,
            </p>
            <p>
              The photos from <strong>${event.title}</strong> are now available.
            </p>
            <p>
              You can access the gallery here:
            </p>
            <p>
              <a href="${galleryUrl}" style="display:inline-block;background:#000;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;">
                View gallery
              </a>
            </p>

            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 14px; color: #555;">
              FramEvent<br />
              Krzysztof Pazdalski
            </p>
          </div>
        `,
      })

      await supabaseAdmin
        .from('event_notifications')
        .update({
          notified: true,
        })
        .eq('id', subscriber.id)

      sent++
    }

    return NextResponse.json({
      success: true,
      sent,
    })
  } catch (error) {
    console.log('NOTIFY SUBSCRIBERS ERROR:', error)

    return NextResponse.json({
      success: false,
      error: 'Server error',
    })
  }
}