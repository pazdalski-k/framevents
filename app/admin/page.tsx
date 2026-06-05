'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

      const fileName = `${Date.now()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, image)

      if (uploadError) {
        alert(JSON.stringify(uploadError))
        return
      }

      const { data } = supabase.storage
        .from('event-photos')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    let newEvent

    if (editingId) {

      console.log('EDITING EVENT ID:', editingId)

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
        const photoFileName = `${Date.now()}-${file.name}`

        const { error: photoUploadError } =
          await supabase.storage
            .from('event-photos')
            .upload(photoFileName, file)

        if (photoUploadError) continue

        const { data: photoData } =
          supabase.storage
            .from('event-photos')
            .getPublicUrl(photoFileName)

        await supabase
          .from('photos')
          .insert([
            {
              event_id: newEvent.id,
              image_url: photoData.publicUrl,
            },
          ])
      }
    }
    alert('Event created!')
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
    console.log('DELETE ID:', id)

    const confirmed = confirm(
      'Czy na pewno usunąć wydarzenie?'
    )

    if (!confirmed) return

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
          onChange={(e) =>
            setImages(e.target.files)
          }
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
              </div>

              <div className="flex gap-3">
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