'use client'

import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Photo = {
  id: number
  image_url: string
  event_id: number
  file_name: string | null
  hd_file_name?: string | null
}

export default function AdminPhotos({
  photos,
}: {
  photos: Photo[]
}) {
  const router = useRouter()

  const setAsCover = async (photo: Photo) => {
    const confirmed = confirm(
      'Ustawić to zdjęcie jako główne zdjęcie eventu?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('events')
      .update({
        image_url: photo.image_url,
        cover_image: photo.image_url,
      })
      .eq('id', photo.event_id)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    alert('Zdjęcie ustawione jako okładka eventu')
    router.refresh()
  }

  const updateEventAfterDelete = async (
    deletedPhoto: Photo
  ) => {
    const { data: event } = await supabase
      .from('events')
      .select('id, image_url, cover_image')
      .eq('id', deletedPhoto.event_id)
      .single()

    const { data: remainingPhotos } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', deletedPhoto.event_id)
      .order('id', { ascending: true })

    const newCount = remainingPhotos?.length || 0

    const wasCover =
      event?.image_url === deletedPhoto.image_url ||
      event?.cover_image === deletedPhoto.image_url

    const updateData: {
      photos_count: number
      image_url?: string
      cover_image?: string
    } = {
      photos_count: newCount,
    }

    if (wasCover) {
      const nextPhoto = remainingPhotos?.[0]

      updateData.image_url = nextPhoto?.image_url || ''
      updateData.cover_image = nextPhoto?.image_url || ''
    }

    const { error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', deletedPhoto.event_id)

    if (error) {
      alert(JSON.stringify(error))
    }
  }

  const deletePhoto = async (photo: Photo) => {
    const confirmed = confirm('Usunąć zdjęcie?')

    if (!confirmed) return

    if (photo.file_name) {
      const { error: previewDeleteError } =
        await supabase.storage
          .from('event-photos-preview')
          .remove([photo.file_name])

      console.log(
        'PREVIEW DELETE ERROR:',
        previewDeleteError
      )

      if (previewDeleteError) {
        alert(
          'Błąd usuwania preview: ' +
            JSON.stringify(previewDeleteError)
        )
        return
      }
    }

    if (photo.hd_file_name) {
      const { error: hdDeleteError } =
        await supabase.storage
          .from('event-photos-hd')
          .remove([photo.hd_file_name])

      console.log('HD DELETE ERROR:', hdDeleteError)

      if (hdDeleteError) {
        alert(
          'Błąd usuwania HD: ' +
            JSON.stringify(hdDeleteError)
        )
        return
      }
    }

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    await updateEventAfterDelete(photo)

    alert('Zdjęcie usunięte')
    router.refresh()
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
        >
          <img
            src={photo.image_url}
            alt=""
            className="w-full h-64 object-cover"
          />

          <div className="p-4">
            <p className="text-sm text-white/50">
              ID: {photo.id}
            </p>

            <p className="text-xs text-white/30 mt-1 break-all">
              Preview: {photo.file_name || 'brak'}
            </p>

            <p className="text-xs text-white/30 mt-1 break-all">
              HD: {photo.hd_file_name || 'brak'}
            </p>

            <button
              onClick={() => setAsCover(photo)}
              className="mt-4 w-full bg-white text-black hover:scale-[1.02] transition py-3 rounded-xl font-semibold"
            >
              ⭐ Set as Cover
            </button>

            <button
              onClick={() => deletePhoto(photo)}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-semibold"
            >
              Delete Photo
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}