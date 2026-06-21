import type { Metadata } from 'next'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import Gallery from '../../components/Gallery'
import BuyGalleryButton from '../../components/BuyGalleryButton'
import EventNotificationForm from '../../components/EventNotificationForm'

const siteUrl = 'https://www.framevents.fr'

type EventRecord = {
  id: number
  title: string
  date: string
  location: string
  category?: string | null
  description?: string | null
  image_url?: string | null
  photo_price?: number | null
  gallery_price?: number | null
}

type PhotoRecord = {
  id: number
  image_url: string
  event_id?: number
}

function cleanText(text?: string | null) {
  return text?.replace(/\s+/g, ' ').trim() || ''
}

function formatDate(date?: string | null) {
  if (!date) return ''

  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function buildEventDescription(event: EventRecord) {
  const customDescription = cleanText(event.description)

  if (customDescription) {
    return customDescription.length > 155
      ? `${customDescription.slice(0, 152)}...`
      : customDescription
  }

  const location = event.location ? ` à ${event.location}` : ''
  const date = event.date ? ` — ${formatDate(event.date)}` : ''

  return `Galerie photo ${event.title}${location}${date}. Retrouvez, achetez et téléchargez vos photos en haute qualité avec FramEvents.`
}

function EventQrCard({
  eventUrl,
  title,
}: {
  eventUrl: string
  title: string
}) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=18&data=${encodeURIComponent(
    eventUrl
  )}`

  return (
    <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[5px] text-white/35">
        QR Code
      </p>

      <h3 className="mt-4 text-2xl font-black leading-tight">
        Partager cette galerie
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-white/55">
        Scannez ce QR code pour ouvrir directement la page de l’événement.
      </p>

      <div className="mt-6 rounded-[26px] bg-white p-4">
        <img
          src={qrUrl}
          alt={`QR code ${title}`}
          className="h-auto w-full rounded-[18px]"
        />
      </div>

      <a
        href={eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block break-all text-sm text-white/45 transition hover:text-white"
      >
        {eventUrl}
      </a>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  const { data: event } = await supabase
    .from('events')
    .select('id, title, date, location, category, description, image_url')
    .eq('id', id)
    .single()

  if (!event) {
    return {
      title: 'Galerie événement — FramEvents',
      description:
        'Galerie photo événementielle FramEvents en Normandie.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const typedEvent = event as EventRecord
  const title = `${typedEvent.title} — Galerie photo FramEvents`
  const description = buildEventDescription(typedEvent)
  const eventUrl = `${siteUrl}/event/${typedEvent.id}`
  const imageUrl = typedEvent.image_url || '/hero-framevent-2026.jpg'

  return {
    title,
    description,

    alternates: {
      canonical: eventUrl,
    },

    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: eventUrl,
      siteName: 'FramEvents',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: `${typedEvent.title} — galerie photo FramEvents`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', Number(id))

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-xl text-center">
          <p className="text-xs uppercase tracking-[5px] text-white/35">
            FramEvents
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            Événement introuvable
          </h1>

          <p className="mt-5 text-white/55">
            Cette galerie n’est pas disponible ou n’existe plus.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-bold text-black"
          >
            Retour aux événements
          </Link>
        </div>
      </main>
    )
  }

  const typedEvent = event as EventRecord
  const typedPhotos = (photos || []) as PhotoRecord[]
  const hasPhotos = typedPhotos.length > 0
  const hasCoverImage = !!typedEvent.image_url
  const eventUrl = `${siteUrl}/event/${typedEvent.id}`

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
        <Link
          href="/"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
        >
          ← Retour aux événements
        </Link>
      </div>

      <section className="relative min-h-[72svh] overflow-hidden md:h-[66vh] md:min-h-[560px]">
        {hasCoverImage ? (
          <img
            src={typedEvent.image_url || ''}
            alt={typedEvent.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.96)_100%),linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.52)_45%,rgba(0,0,0,0.18)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl items-end px-4 pb-10 md:h-[66vh] md:min-h-[560px] md:px-8 md:pb-16">
          <div className="max-w-5xl">
            <p className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[3px] text-white/85 backdrop-blur-xl md:text-xs">
              {typedEvent.category || 'Événement'}
            </p>

            <h1 className="mt-5 max-w-5xl text-[42px] font-black leading-[0.95] tracking-tight md:mt-7 md:text-7xl">
              {typedEvent.title}
            </h1>

            <div className="mt-6 flex flex-col gap-3 text-base text-white/72 md:mt-8 md:flex-row md:flex-wrap md:gap-8 md:text-xl">
              <p>📍 {typedEvent.location}</p>
              <p>📅 {formatDate(typedEvent.date)}</p>

              {hasPhotos ? (
                <p>📸 {typedPhotos.length} photos</p>
              ) : (
                <p>⏳ Galerie disponible sous 24–48h</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
        {typedEvent.description && (
          <p className="max-w-4xl text-lg leading-relaxed text-white/76 md:text-2xl">
            {typedEvent.description}
          </p>
        )}

        {!hasPhotos && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-stretch">
            <EventNotificationForm eventId={typedEvent.id} />

            <EventQrCard
              eventUrl={eventUrl}
              title={typedEvent.title}
            />
          </div>
        )}

        {hasPhotos && (
          <>
            <div className="mt-9 flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
              <a
                href="#photos"
                className="rounded-full bg-white px-8 py-4 text-center font-bold text-black transition hover:scale-[1.03]"
              >
                Voir les photos
              </a>

              <BuyGalleryButton
                eventId={typedEvent.id}
                eventTitle={typedEvent.title}
                galleryPrice={typedEvent.gallery_price || 0}
              />
            </div>

            <div className="mt-8 max-w-sm">
              <EventQrCard
                eventUrl={eventUrl}
                title={typedEvent.title}
              />
            </div>

            <div id="photos" className="mt-14 md:mt-20">
              <div className="mb-8 md:mb-12">
                <p className="text-xs uppercase tracking-[5px] text-white/35">
                  Galerie
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                  {typedPhotos.length} photos
                </h2>
              </div>

              <Gallery
                photos={typedPhotos}
                photoPrice={typedEvent.photo_price || 0}
                eventId={typedEvent.id}
              />
            </div>
          </>
        )}
      </section>
    </main>
  )
}