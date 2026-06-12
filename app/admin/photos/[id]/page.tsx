import { supabase } from '../../../lib/supabase'
import AdminPhotos from '../../../components/AdminPhotos'

export default async function PhotosAdminPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', Number(id))

  return (
    <main className="bg-black text-white min-h-screen p-10">
      <h1 className="text-5xl font-bold mb-10">
        Event Photos
      </h1>

      <AdminPhotos photos={photos || []} />
    </main>
  )
}