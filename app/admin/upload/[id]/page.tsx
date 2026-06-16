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
    <main className="bg-black text-white min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <p className="text-white/40 uppercase tracking-[4px] text-sm mb-4">
          Admin Upload
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Upload Photos
        </h1>

        <p className="text-white/50 mb-10">
          Event: {event?.title || `ID ${eventId}`}
        </p>

        <AdminUploadPhotos eventId={eventId} />
      </div>
    </main>
  )
}