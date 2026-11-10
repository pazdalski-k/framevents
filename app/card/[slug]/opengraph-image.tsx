import { ImageResponse } from 'next/og'
import { getVisitCardMeta } from './_meta'

export const alt = 'Carte de visite numérique'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

function validColor(value: string | null) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value)
    ? value
    : '#d6a85f'
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const card = await getVisitCardMeta(slug)

  const accent = validColor(card?.brand_color || null)

  const fullName =
    [card?.first_name, card?.last_name]
      .filter(Boolean)
      .join(' ') ||
    card?.company ||
    'Visit Card'

  const initials =
    [card?.first_name, card?.last_name]
      .filter(Boolean)
      .map((value) => String(value).charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VC'

  const imageUrl = card?.photo_url || card?.logo_url || null

  const bio =
    card?.bio && card.bio.length > 130
      ? `${card.bio.slice(0, 127)}...`
      : card?.bio

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#080808',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          padding: '58px 68px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '14px',
            background: accent,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '58px',
          }}
        >
          <div
            style={{
              width: '330px',
              height: '330px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '48px',
              overflow: 'hidden',
              background: accent,
              flexShrink: 0,
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                width="330"
                height="330"
                style={{
                  width: '330px',
                  height: '330px',
                  objectFit: card?.photo_url ? 'cover' : 'contain',
                  background: card?.photo_url ? '#111111' : '#ffffff',
                  padding: card?.photo_url ? '0' : '28px',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  fontSize: '110px',
                  fontWeight: 800,
                  color: '#080808',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '6px',
                color: accent,
                marginBottom: '20px',
              }}
            >
              DIGITAL VISIT CARD
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: '64px',
                lineHeight: 1.04,
                fontWeight: 800,
                marginBottom: '18px',
              }}
            >
              {fullName}
            </div>

            {card?.company && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '34px',
                  fontWeight: 700,
                  color: accent,
                  marginBottom: '12px',
                }}
              >
                {card.company}
              </div>
            )}

            {card?.job_title && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '29px',
                  color: '#cccccc',
                  marginBottom: bio ? '20px' : '0',
                }}
              >
                {card.job_title}
              </div>
            )}

            {bio && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '23px',
                  lineHeight: 1.4,
                  color: '#999999',
                }}
              >
                {bio}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '68px',
            right: '68px',
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #292929',
            paddingTop: '20px',
            fontSize: '20px',
          }}
        >
          <div style={{ display: 'flex', fontWeight: 700 }}>
            framevents.fr
          </div>

          <div style={{ display: 'flex', color: '#666666' }}>
            Powered by FramEvents
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
