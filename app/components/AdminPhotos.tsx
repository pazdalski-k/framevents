'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

type Photo = {
  id: number
  image_url: string
  event_id: number
  file_name: string | null
  hd_file_name?: string | null
  sort_order?: number | null
}

export default function AdminPhotos({
  photos,
}: {
  photos: Photo[]
}) {
  const router = useRouter()

  const [orderedPhotos, setOrderedPhotos] = useState<Photo[]>(photos)
  const [draggedPhotoId, setDraggedPhotoId] = useState<number | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  const savePhotoOrder = async (nextPhotos: Photo[]) => {
    setSavingOrder(true)

    const updates = nextPhotos.map((photo, index) =>
      supabase
        .from('photos')
        .update({ sort_order: index + 1 })
        .eq('id', photo.id)
    )

    const results = await Promise.all(updates)
    const error = results.find((result) => result.error)?.error

    setSavingOrder(false)

    if (error) {
      alert('Błąd zapisu kolejności: ' + JSON.stringify(error))
      return
    }

    router.refresh()
  }

  const handleDrop = async (targetPhotoId: number) => {
    if (!draggedPhotoId || draggedPhotoId === targetPhotoId) {
      setDraggedPhotoId(null)
      return
    }

    const currentPhotos = [...orderedPhotos]
    const draggedIndex = currentPhotos.findIndex(
      (photo) => photo.id === draggedPhotoId
    )
    const targetIndex = currentPhotos.findIndex(
      (photo) => photo.id === targetPhotoId
    )

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedPhotoId(null)
      return
    }

    const [draggedPhoto] = currentPhotos.splice(draggedIndex, 1)
    currentPhotos.splice(targetIndex, 0, draggedPhoto)

    setOrderedPhotos(currentPhotos)
    setDraggedPhotoId(null)

    await savePhotoOrder(currentPhotos)
  }

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
      .order('sort_order', { ascending: true, nullsFirst: false })
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

    setOrderedPhotos((current) =>
      current.filter((item) => item.id !== photo.id)
    )

    alert('Zdjęcie usunięte')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/60">
        <p className="font-semibold text-white">
          Drag & drop order
        </p>
        <p className="mt-2">
          Przeciągnij zdjęcie i upuść je w nowe miejsce. Kolejność zapisuje się automatycznie.
        </p>

        {savingOrder && (
          <p className="mt-3 text-[#d6a85f]">
            Zapisywanie kolejności...
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {orderedPhotos.map((photo, index) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => setDraggedPhotoId(photo.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(photo.id)}
            onDragEnd={() => setDraggedPhotoId(null)}
            className={`overflow-hidden rounded-2xl border bg-zinc-900 transition ${
              draggedPhotoId === photo.id
                ? 'scale-[0.98] border-[#d6a85f] opacity-50'
                : 'border-zinc-800 hover:border-white/30'
            }`}
          >
            <div className="relative">
              <img
                src={photo.image_url}
                alt=""
                className="h-64 w-full cursor-grab object-cover active:cursor-grabbing"
              />

              <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-xl">
                #{index + 1}
              </div>

              <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                Drag
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-white/50">
                ID: {photo.id}
              </p>

              <p className="mt-1 text-xs text-white/30">
                Position: {index + 1}
              </p>

              <p className="mt-1 break-all text-xs text-white/30">
                Preview: {photo.file_name || 'brak'}
              </p>

              <p className="mt-1 break-all text-xs text-white/30">
                HD: {photo.hd_file_name || 'brak'}
              </p>

              <button
                onClick={() => setAsCover(photo)}
                className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:scale-[1.02]"
              >
                ⭐ Set as Cover
              </button>

              <button
                onClick={() => deletePhoto(photo)}
                className="mt-3 w-full rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-700"
              >
                Delete Photo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
