'use client'

import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Photo = {
  id: number
  image_url: string
  event_id: number
  file_name: string
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
      })
      .eq('id', photo.event_id)

    console.log('SET COVER ERROR:', error)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    alert('Zdjęcie ustawione jako okładka eventu')
    router.refresh()
  }

  const deletePhoto = async (photo: Photo) => {
    const confirmed = confirm('Usunąć zdjęcie?')

    if (!confirmed) return

    if (photo.file_name) {
      const { error: storageError } =
        await supabase.storage
          .from('event-photos')
          .remove([photo.file_name])

      console.log(
        'STORAGE DELETE ERROR:',
        storageError
      )
    }

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id)

    console.log('DELETE ERROR:', error)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

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