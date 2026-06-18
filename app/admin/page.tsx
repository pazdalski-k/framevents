'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type EventItem = {
  id: number
  title: string
  date: string
  location: string
  description: string | null
  category: string | null
  image_url: string | null
  cover_image: string | null
  photos_count: number | null
  photo_price: number | null
  gallery_price: number | null
  is_published: boolean | null
  email_signups?: number
}

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
        reject('Erreur canvas')
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
          ctx.fillText('FramEvent', x, y)
        }
      }

      ctx.restore()

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject('Erreur de création du preview')
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
  const router = useRouter()

  const [events, setEvents] = useState<EventItem[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [photoPrice, setPhotoPrice] = useState('0.5')
  const [galleryPrice, setGalleryPrice] = useState('10')
  const [images, setImages] = useState<FileList | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [quickTitle, setQuickTitle] = useState('')
  const [quickEvent, setQuickEvent] = useState<EventItem | null>(null)
  const [creatingQuickEvent, setCreatingQuickEvent] = useState(false)
  const [notifyingId, setNotifyingId] = useState<number | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }

    return 'https://framevent.fr'
  }

  const getEventUrl = (eventId: number) => {
    return `${getBaseUrl()}/event/${eventId}`
  }

  const getQrUrl = (eventId: number) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
      getEventUrl(eventId)
    )}`
  }

  const safeFileName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9.-]/g, '')
  }

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.log('EVENTS LOAD ERROR:', error)
      return
    }

    const eventsWithSignups = await Promise.all(
      (data || []).map(async (event) => {
        const { count } = await supabase
          .from('event_notifications')
          .select('*', {
            count: 'exact',
            head: true,
          })
          .eq('event_id', event.id)

        return {
          ...event,
          email_signups: count || 0,
        }
      })
    )

    setEvents(eventsWithSignups)
  }

  const logout = async () => {
    await fetch('/api/admin-logout', {
      method: 'POST',
    })

    router.push('/admin/login')
  }

  const resetForm = () => {
    setTitle('')
    setDate('')
    setLocation('')
    setDescription('')
    setCategory('')
    setPhotoPrice('0.5')
    setGalleryPrice('10')
    setImages(null)
    setEditingId(null)
  }

  const uploadEventPhotos = async (eventId: number) => {
    if (!images || images.length === 0) {
      return {
        count: 0,
        firstPreviewUrl: '',
      }
    }

    let uploadedCount = 0
    let firstPreviewUrl = ''

    for (const file of Array.from(images)) {
      const cleanName = safeFileName(file.name)
      const timestamp = Date.now()

      const previewFileName =
        `${eventId}/${timestamp}-preview-${crypto.randomUUID()}-${cleanName}.jpg`

      const hdFileName =
        `${eventId}/${timestamp}-hd-${crypto.randomUUID()}-${cleanName}`

      const previewBlob = await createWatermarkedPreview(file)

      const { error: previewUploadError } = await supabase.storage
        .from('event-photos-preview')
        .upload(previewFileName, previewBlob, {
          contentType: 'image/jpeg',
          upsert: false,
        })

      if (previewUploadError) {
        console.log('PREVIEW UPLOAD ERROR:', previewUploadError)
        continue
      }

      const { error: hdUploadError } = await supabase.storage
        .from('event-photos-hd')
        .upload(hdFileName, file, {
          upsert: false,
        })

      if (hdUploadError) {
        console.log('HD UPLOAD ERROR:', hdUploadError)
        continue
      }

      const { data: previewData } = supabase.storage
        .from('event-photos-preview')
        .getPublicUrl(previewFileName)

      const previewUrl = previewData.publicUrl

      if (!firstPreviewUrl) {
        firstPreviewUrl = previewUrl
      }

      const { error: photoInsertError } = await supabase
        .from('photos')
        .insert([
          {
            event_id: eventId,
            image_url: previewUrl,
            file_name: previewFileName,
            hd_file_name: hdFileName,
          },
        ])

      if (photoInsertError) {
        console.log('PHOTO INSERT ERROR:', photoInsertError)
        continue
      }

      uploadedCount += 1
    }

    return {
      count: uploadedCount,
      firstPreviewUrl,
    }
  }

  const createQuickEvent = async () => {
    if (!quickTitle.trim()) {
      alert("Entrez le nom de l'événement ou du groupe")
      return
    }

    setCreatingQuickEvent(true)

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title: quickTitle.trim(),
          date: today,
          location: 'À préciser',
          description:
            'Les photos seront bientôt disponibles. Revenez plus tard en utilisant ce code QR.',
          category: 'Événement rapide',
          image_url: '',
          cover_image: '',
          photos_count: 0,
          photo_price: 0.5,
          gallery_price: 10,
          is_published: true,
        },
      ])
      .select()
      .single()

    setCreatingQuickEvent(false)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    setQuickEvent({
      ...data,
      email_signups: 0,
    })

    setQuickTitle('')
    await loadEvents()
  }

  const createEvent = async () => {
    if (!title || !date || !location) {
      alert("Veuillez saisir le titre, la date et le lieu de l'événement")
      return
    }

    const parsedPhotoPrice = Number(photoPrice)
    const parsedGalleryPrice = Number(galleryPrice)

    if (
      Number.isNaN(parsedPhotoPrice) ||
      parsedPhotoPrice <= 0 ||
      Number.isNaN(parsedGalleryPrice) ||
      parsedGalleryPrice <= 0
    ) {
      alert('Veuillez saisir un prix valide, par exemple 1 ou 2.99')
      return
    }

    let newEvent: EventItem | null = null

    if (editingId) {
      const { data: updatedEvent, error } = await supabase
        .from('events')
        .update({
          title,
          date,
          location,
          description,
          category,
          photo_price: parsedPhotoPrice,
          gallery_price: parsedGalleryPrice,
        })
        .eq('id', editingId)
        .select()
        .single()

      if (error) {
        alert(JSON.stringify(error))
        return
      }

      newEvent = updatedEvent
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
            image_url: '',
            cover_image: '',
            photos_count: 0,
            photo_price: parsedPhotoPrice,
            gallery_price: parsedGalleryPrice,
            is_published: true,
          },
        ])
        .select()
        .single()

      if (error) {
        alert(JSON.stringify(error))
        return
      }

      newEvent = createdEvent
    }

    if (images && images.length > 0 && newEvent) {
      const uploadResult = await uploadEventPhotos(newEvent.id)

      const { count } = await supabase
        .from('photos')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('event_id', newEvent.id)

      const updateData: {
        photos_count: number
        image_url?: string
        cover_image?: string
      } = {
        photos_count: count || 0,
      }

      if (uploadResult.firstPreviewUrl) {
        updateData.image_url = uploadResult.firstPreviewUrl
        updateData.cover_image = uploadResult.firstPreviewUrl
      }

      await supabase
        .from('events')
        .update(updateData)
        .eq('id', newEvent.id)
    }

    alert(
      editingId
        ? 'Événement mis à jour'
        : 'Événement créé'
    )

    await loadEvents()
    resetForm()
  }

  const deleteEvent = async (id: number) => {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer cet événement ?'
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

    await supabase
      .from('event_notifications')
      .delete()
      .eq('event_id', id)

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    await loadEvents()
  }

  const togglePublish = async (
    eventId: number,
    currentStatus: boolean
  ) => {
    const { error } = await supabase
      .from('events')
      .update({
        is_published: !currentStatus,
      })
      .eq('id', eventId)

    if (error) {
      alert(JSON.stringify(error))
      return
    }

    await loadEvents()
  }

  const notifySubscribers = async (eventId: number) => {
    const confirmed = confirm(
      'Envoyer un e-mail à toutes les personnes inscrites à cet événement ?'
    )

    if (!confirmed) return

    setNotifyingId(eventId)

    const response = await fetch('/api/notify-subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
      }),
    })

    const data = await response.json()

    setNotifyingId(null)

    if (data.success) {
      alert(`E-mails envoyés : ${data.sent}`)
    } else {
      alert(data.error || "Erreur d'envoi des notifications")
    }
  }

  return (
    <main className="bg-black text-white min-h-screen p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-bold">
          Administration FramEvent
        </h1>

        <button
          onClick={logout}
          className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white transition"
        >
          Déconnexion
        </button>
      </div>

      <div className="max-w-4xl mb-14 rounded-[32px] border border-white/10 bg-[#111111] p-6 md:p-8">
        <p className="uppercase tracking-[5px] text-white/40 text-xs mb-3">
          Événement rapide
        </p>

        <h2 className="text-3xl font-bold mb-4">
          Créer un événement sur place
        </h2>

        <p className="text-white/50 mb-6">
          Utilisez cette option depuis votre téléphone pendant un événement. Entrez le nom du groupe, créez le lien de galerie, affichez le code QR et ajoutez les photos plus tard.
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Nom du groupe / école / artiste"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
          />

          <button
            type="button"
            onClick={createQuickEvent}
            disabled={creatingQuickEvent}
            className="px-8 py-5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-2xl font-bold text-lg transition"
          >
            {creatingQuickEvent
              ? 'Création...'
              : '⚡ Événement rapide'}
          </button>
        </div>

        {quickEvent && (
          <div className="mt-8 rounded-3xl bg-black/50 border border-white/10 p-6">
            <p className="text-green-400 font-semibold mb-3">
              Événement rapide créé
            </p>

            <h3 className="text-2xl font-bold mb-4">
              {quickEvent.title}
            </h3>

            <p className="text-white/50 break-all mb-4">
              {getEventUrl(quickEvent.id)}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    getEventUrl(quickEvent.id)
                  )
                }
                className="px-5 py-3 rounded-xl bg-white text-black font-semibold"
              >
                Copier le lien
              </button>

              <Link
                href={`/event/${quickEvent.id}`}
                target="_blank"
                className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10"
              >
                Ouvrir la galerie
              </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block">
              <img
                src={getQrUrl(quickEvent.id)}
                alt="Code QR"
                className="w-56 h-56"
              />
            </div>
          </div>
        )}
      </div>

      <form
        className="max-w-4xl space-y-6"
        onSubmit={async (e) => {
          e.preventDefault()
          await createEvent()
        }}
      >
        <input
          type="text"
          placeholder="Titre de l’événement"
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
          placeholder="Lieu"
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
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            min="0.5"
            placeholder="Prix photo (€)"
            value={photoPrice}
            onChange={(e) => setPhotoPrice(e.target.value)}
            className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
          />

          <input
            type="number"
            step="0.01"
            min="0.5"
            placeholder="Prix galerie (€)"
            value={galleryPrice}
            onChange={(e) => setGalleryPrice(e.target.value)}
            className="w-full p-5 rounded-2xl bg-zinc-800 border border-zinc-700 text-white text-lg"
          />
        </div>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
          <p className="text-white/70 mb-3">
            Photo de couverture / photos de l’événement — optionnel
          </p>

          <p className="text-white/40 text-sm mb-4">
            Vous pouvez créer un événement sans photos. Les visiteurs verront un message 24–48h et pourront laisser leur e-mail.
          </p>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="w-full text-white text-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition"
          >
            {editingId
              ? 'Mettre à jour'
              : 'Créer l’événement'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-10 py-5 bg-zinc-700 text-white rounded-2xl font-bold text-lg hover:bg-zinc-600 transition"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">
          Événements existants
        </h2>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
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

                <p className="text-white/40 text-sm mt-2">
                  Photo : {event.photo_price || 0}€ · Galerie : {event.gallery_price || 0}€
                </p>

                <p
                  className={`text-sm mt-2 ${
                    event.is_published ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {event.is_published ? 'Publié' : 'Masqué'}
                </p>

                <p className="text-cyan-400 text-sm mt-2">
                  Inscriptions e-mail : {event.email_signups || 0}
                </p>

                {(event.photos_count || 0) === 0 && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Page d’attente active : message 24–48h + formulaire e-mail
                  </p>
                )}

                <p className="text-white/30 text-xs mt-2">
                  {getEventUrl(event.id)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/event/${event.id}`}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition"
                >
                  Voir
                </Link>

                <Link
                  href={`/admin/upload/${event.id}`}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition"
                >
                  Téléverser
                </Link>

                <Link
                  href={`/admin/photos/${event.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                >
                  Photos
                </Link>

                <a
                  href={getQrUrl(event.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                >
                  Code QR
                </a>

                <Link
                  href={`/admin/signups/${event.id}`}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition"
                >
                  Inscriptions
                </Link>

                <button
                  onClick={() => notifySubscribers(event.id)}
                  disabled={notifyingId === event.id}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {notifyingId === event.id
                    ? 'Envoi...'
                    : 'Notifier'}
                </button>

                <button
                  onClick={() =>
                    togglePublish(
                      event.id,
                      event.is_published ?? true
                    )
                  }
                  className={`px-4 py-2 rounded-xl transition ${
                    event.is_published
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {event.is_published ? 'Masquer' : 'Publier'}
                </button>

                <button
                  onClick={() => {
                    setEditingId(event.id)
                    setTitle(event.title || '')
                    setDate(event.date || '')
                    setLocation(event.location || '')
                    setDescription(event.description || '')
                    setCategory(event.category || '')
                    setPhotoPrice(String(event.photo_price || 0.5))
                    setGalleryPrice(String(event.gallery_price || 10))
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}