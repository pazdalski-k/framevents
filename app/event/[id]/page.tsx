import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import Gallery from '../../components/Gallery'
import BuyGalleryButton from '../../components/BuyGalleryButton'
import EventNotificationForm from '../../components/EventNotificationForm'

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
    return <div>Événement introuvable</div>
  }

  const hasPhotos = !!photos && photos.length > 0
  const hasCoverImage = !!event.image_url

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-4">
        <Link
          href="/"
          className="text-white/70 hover:text-white"
        >
          ← Retour aux événements
        </Link>
      </div>

      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {hasCoverImage ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-8 pb-20">
          <p className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-xs uppercase tracking-widest">
            {event.category || 'Événement'}
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mt-6 tracking-tight max-w-5xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-8 mt-8 text-xl text-white/70">
            <p>📍 {event.location}</p>
            <p>📅 {event.date}</p>

            {hasPhotos ? (
              <p>📸 {photos.length} photos</p>
            ) : (
              <p>⏳ Galerie disponible sous 24–48h</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-20">
        {event.description && (
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl">
            {event.description}
          </p>
        )}

        {!hasPhotos && (
          <EventNotificationForm eventId={event.id} />
        )}

        {hasPhotos && (
          <>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#photos"
                className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
              >
                Voir les photos
              </a>

              <BuyGalleryButton
                eventId={event.id}
                eventTitle={event.title}
                galleryPrice={event.gallery_price}
              />
            </div>

            <div id="photos" className="mt-20">
              <h2 className="text-5xl font-bold mb-12">
                {photos.length} photos
              </h2>

              <Gallery
                photos={photos}
                photoPrice={event.photo_price}
                eventId={event.id}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}