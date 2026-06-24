import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import AdminUploadPhotos from '../../../components/AdminUploadPhotos'

export default async function UploadPhotosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = Number(id)

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[4px] text-white/40">
              Admin Upload
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Upload Photos
            </h1>

            <p className="mt-4 text-white/50">
              Event: {event?.title || `ID ${eventId}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              ← Admin
            </Link>

            <Link
              href={`/admin/photos/${eventId}`}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              Gérer les photos
            </Link>

            <Link
              href={`/event/${eventId}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/85"
            >
              Voir l’événement
            </Link>
          </div>
        </div>

        <AdminUploadPhotos eventId={eventId} />
      </div>
    </main>
  )
}