'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

async function createWatermarkedPreview(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }

    img.onload = () => {
      const maxWidth = 1600
      const scale = Math.min(1, maxWidth / img.width)

      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject('Canvas error')
        return
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.fillStyle = 'white'
      ctx.font = 'bold 70px Arial'
      ctx.textAlign = 'center'
      ctx.rotate((-25 * Math.PI) / 180)

      for (let x = -canvas.width; x < canvas.width * 2; x += 520) {
        for (let y = -canvas.height; y < canvas.height * 2; y += 280) {
          ctx.fillText('EVENTFRAME', x, y)
        }
      }

      ctx.restore()

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject('Preview error')
            return
          }

          resolve(blob)
        },
        'image/jpeg',
        0.82
      )
    }

    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [images, setImages] = useState<FileList | null>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (data) {
      setEvents(data)
    }
  }

  const createEvent = async () => {
    if (!editingId && (!images || images.length === 0)) {
      alert('Wybierz zdjęcie')
      return
    }

    let imageUrl = ''

    if (images && images.length > 0) {
      const image = images[0]
      const previewBlob = await createWatermarkedPreview(image)
      const coverFileName = `${Date.now()}-cover-${image.name}.jpg`

      const { error: uploadError } = await supabase.storage
        .from('event-photos-preview')
        .upload(coverFileName, previewBlob)

      if (uploadError) {
        alert(JSON.stringify(uploadError))
        return
      }

      const { data } = supabase.storage
        .from('event-photos-preview')
        .getPublicUrl(coverFileName)

      imageUrl = data.publicUrl
    }

    let newEvent

    if (editingId) {
      const { data: updatedEvent, error } = await supabase
        .from('events')
        .update({
          title,
          date,
          location,
          description,
          category,
          image_url: imageUrl || undefined,
        })
        .eq('id', editingId)
        .select()
        .single()

      newEvent = updatedEvent

      if (error) {
        alert(JSON.stringify(error))
        return
      }
    } else {
      const { data: createdEvent, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            date,
            location,
            description,
            category,
            image_url: imageUrl,
          },
        ])
        .select()
        .single()

      newEvent = createdEvent

      if (error) {
        alert(JSON.stringify(error))
        return
      }
    }

    if (images) {
      for (const file of Array.from(images)) {
        const timestamp = Date.now()

        const previewFileName = `${timestamp}-preview-${file.name}.jpg`
        const hdFileName = `${timestamp}-hd-${file.name}`

        const previewBlob = await createWatermarkedPreview(file)

        const { error: previewUploadError } =
          await supabase.storage
            .from('event-photos-preview')
            .upload(previewFileName, previewBlob)

        if (previewUploadError) {
          console.log('PREVIEW UPLOAD ERROR:', previewUploadError)
          continue
        }

        const { error: hdUploadError } =
          await supabase.storage
            .from('event-photos-hd')
            .upload(hdFileName, file)

        if (hdUploadError) {
          console.log('HD UPLOAD ERROR:', hdUploadError)
          continue
        }

        const { data: previewData } =
          supabase.storage
            .from('event-photos-preview')
            .getPublicUrl(previewFileName)

        const { error: photoInsertError } =
          await supabase
            .from('photos')
            .insert([
              {
                event_id: newEvent.id,
                image_url: previewData.publicUrl,
                file_name: previewFileName,
                hd_file_name: hdFileName,
              },
            ])

        console.log('PHOTO INSERT ERROR:', photoInsertError)
      }

      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', newEvent.id)

      await supabase
        .from('events')
        .update({
          photos_count: count || 0,
        })
        .eq('id', newEvent.id)
    }

    alert(editingId ? 'Event updated!' : 'Event created!')
    loadEvents()

    setEditingId(null)
    setTitle('')
    setDate('')
    setLocation('')
    setDescription('')
    setCategory('')
    setImages(null)
  }

  const deleteEvent = async (id: number) => {
    const confirmed = confirm(
      'Czy na pewno usunąć wydarzenie?'
    )

    if (!confirmed) return

    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', id)

    if (photos && photos.length > 0) {
      const previewFiles = photos
        .filter((photo) => photo.file_name)
        .map((photo) => photo.file_name)

      const hdFiles = photos
        .filter((photo) => photo.hd_file_name)
        .map((photo) => photo.hd_file_name)

      if (previewFiles.length > 0) {
        await supabase.storage
          .from('event-photos-preview')
          .remove(previewFiles)

        await supabase.storage
          .from('event-photos')
          .remove(previewFiles)
      }

      if (hdFiles.length > 0) {
        await supabase.storage
          .from('event-photos-hd')
          .remove(hdFiles)
      }

      await supabase
        .from('photos')
        .delete()
        .eq('event_id', id)
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    console.log('DELETE ERROR:', error)

    loadEvents()
  }

  return (
    <main className="bg-black text-white min-h-screen p-10">
      <h1 className="text-5xl font-bold mb-10">
        EventFrame Admin
      </h1>

      <form
        className="max-w-4xl space-y-6"
        onSubmit={async (e) => {
          e.preventDefault()
          await createEvent()
        }}
      >
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <textarea
          placeholder="Description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <button
          type="submit"
          className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition"
        >
          {editingId ? 'Update Event' : 'Create Event'}
        </button>
      </form>

      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          Existing Events
        </h2>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
            >
              <div>
                <h3 className="font-bold text-xl">
                  {event.title}
                </h3>

                <p className="text-white/50">
                  {event.date}
                </p>

                <p className="text-white/40 text-sm mt-1">
                  {event.photos_count || 0} photos
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/photos/${event.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                >
                  Photos
                </Link>

                <button
                  onClick={() => {
                    setEditingId(event.id)
                    setTitle(event.title)
                    setDate(event.date)
                    setLocation(event.location)
                    setDescription(event.description)
                    setCategory(event.category)
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}