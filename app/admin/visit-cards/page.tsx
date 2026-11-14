'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type VisitCard = {
  id: string
  slug: string
  first_name: string | null
  last_name: string | null
  company: string | null
  job_title: string | null
  phone: string | null
  email: string | null
  address: string | null
  website: string | null
  linkedin: string | null
  instagram: string | null
  facebook: string | null
  whatsapp: string | null
  bio: string | null
  logo_url: string | null
  photo_url: string | null
  theme: string | null
  brand_color: string | null
  published: boolean | null
  show_address: boolean | null
  subscription_start_date: string | null
  subscription_end_date: string | null
  subscription_plan: string | null
  subscription_price: number | null
  subscription_notes: string | null
}

const EMPTY_FORM = {
  slug: '',
  first_name: '',
  last_name: '',
  company: '',
  job_title: '',
  phone: '',
  email: '',
  address: '',
  website: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  whatsapp: '',
  bio: '',
  logo_url: '',
  photo_url: '',
  theme: 'dark',
  brand_color: '#d6a85f',
  published: true,
  show_address: false,
  subscription_start_date: '',
  subscription_end_date: '',
  subscription_plan: 'Premium',
  subscription_price: '',
  subscription_notes: '',
}

export default function VisitCardsAdminPage() {
  const [cards, setCards] = useState<VisitCard[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'photo' | null>(null)

  const loadCards = async () => {
    setLoading(true)

    const response = await fetch('/api/admin/visit-cards', {
      cache: 'no-store',
    })

    const data = await response.json()

    if (response.ok) {
      setCards(data.cards || [])
    } else {
      alert(data.error || 'Erreur de chargement')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadCards()
  }, [])

  const updateField = (
    field: keyof typeof EMPTY_FORM,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const uploadAsset = async (
    file: File,
    kind: 'logo' | 'photo'
  ) => {
    setUploading(kind)

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('kind', kind)

      const response = await fetch('/api/admin/visit-card-upload', {
        method: 'POST',
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Erreur d'upload")
        return
      }

      updateField(
        kind === 'logo' ? 'logo_url' : 'photo_url',
        data.url
      )
    } finally {
      setUploading(null)
    }
  }

  const removeAsset = async (
    kind: 'logo' | 'photo'
  ) => {
    const field = kind === 'logo' ? 'logo_url' : 'photo_url'
    const currentUrl = form[field]

    if (!currentUrl) return

    const message =
      kind === 'logo'
        ? 'Supprimer le logo ?'
        : 'Supprimer la photo ?'

    if (!confirm(message)) return

    setUploading(kind)

    try {
      const nextForm = {
        ...form,
        [field]: '',
      }

      // Najpierw wyczyść URL w bazie
      if (editingId) {
        const saveResponse = await fetch('/api/admin/visit-cards', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...nextForm,
            id: editingId,
            subscription_price: nextForm.subscription_price
              ? Number(nextForm.subscription_price)
              : null,
          }),
        })

        const saveData = await saveResponse.json()

        if (!saveResponse.ok) {
          alert(saveData.error || "Erreur de suppression")
          return
        }
      }

      setForm(nextForm)

      // Następnie usuń sam plik ze Storage
      const deleteResponse = await fetch(
        '/api/admin/visit-card-upload',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: currentUrl,
          }),
        }
      )

      if (!deleteResponse.ok) {
        console.warn(
          "L'image a été retirée de la carte, mais le fichier n'a pas pu être supprimé du stockage."
        )
      }
    } finally {
      setUploading(null)
    }
  }

  const saveCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.slug.trim()) {
      alert('Le slug est obligatoire.')
      return
    }

    setSaving(true)

    const response = await fetch('/api/admin/visit-cards', {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        id: editingId,
        subscription_price: form.subscription_price
          ? Number(form.subscription_price)
          : null,
      }),
    })

    const data = await response.json()

    setSaving(false)

    if (!response.ok) {
      alert(data.error || 'Erreur')
      return
    }

    resetForm()
    await loadCards()
  }

  const editCard = (card: VisitCard) => {
    setEditingId(card.id)

    setForm({
      slug: card.slug || '',
      first_name: card.first_name || '',
      last_name: card.last_name || '',
      company: card.company || '',
      job_title: card.job_title || '',
      phone: card.phone || '',
      email: card.email || '',
      address: card.address || '',
      website: card.website || '',
      linkedin: card.linkedin || '',
      instagram: card.instagram || '',
      facebook: card.facebook || '',
      whatsapp: card.whatsapp || '',
      bio: card.bio || '',
      logo_url: card.logo_url || '',
      photo_url: card.photo_url || '',
      theme: card.theme || 'dark',
      brand_color: card.brand_color || '#d6a85f',
      published: card.published !== false,
      show_address: card.show_address === true,
      subscription_start_date: card.subscription_start_date || '',
      subscription_end_date: card.subscription_end_date || '',
      subscription_plan: card.subscription_plan || 'Premium',
      subscription_price:
        card.subscription_price !== null
          ? String(card.subscription_price)
          : '',
      subscription_notes: card.subscription_notes || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const deleteCard = async (id: string) => {
    if (!confirm('Supprimer cette Visit Card ?')) return

    const response = await fetch(
      `/api/admin/visit-cards?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    )

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || 'Erreur')
      return
    }

    await loadCards()
  }

  const subscriptionStatus = (endDate: string | null) => {
    if (!endDate) {
      return {
        text: 'Sans date',
        className: 'text-white/40',
      }
    }

    const today = new Date()
    const end = new Date(`${endDate}T23:59:59`)
    const days = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (days < 0) {
      return {
        text: 'Expiré',
        className: 'text-red-400',
      }
    }

    if (days <= 30) {
      return {
        text: `Expire dans ${days} j`,
        className: 'text-orange-400',
      }
    }

    return {
      text: 'Actif',
      className: 'text-green-400',
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[5px] text-[#d6a85f]">
              FramEvents
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              Visit Cards
            </h1>

            <p className="mt-3 text-white/50">
              Clients, cartes numériques, QR et abonnements.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center font-semibold"
          >
            ← Administration
          </Link>
        </div>

        <form
          onSubmit={saveCard}
          className="rounded-[32px] border border-white/10 bg-[#111] p-5 md:p-8"
        >
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-white/35">
                Client
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {editingId
                  ? 'Modifier la Visit Card'
                  : 'Nouvelle Visit Card'}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-zinc-800 px-4 py-2"
              >
                Annuler
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.first_name}
              onChange={(e) =>
                updateField('first_name', e.target.value)
              }
              placeholder="Prénom"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.last_name}
              onChange={(e) =>
                updateField('last_name', e.target.value)
              }
              placeholder="Nom"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.company}
              onChange={(e) =>
                updateField('company', e.target.value)
              }
              placeholder="Entreprise"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.job_title}
              onChange={(e) =>
                updateField('job_title', e.target.value)
              }
              placeholder="Fonction / métier"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.slug}
              onChange={(e) =>
                updateField(
                  'slug',
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
                )
              }
              placeholder="slug : jean-dupont"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.phone}
              onChange={(e) =>
                updateField('phone', e.target.value)
              }
              placeholder="Téléphone"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField('email', e.target.value)
              }
              placeholder="E-mail"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.address}
              onChange={(e) =>
                updateField('address', e.target.value)
              }
              placeholder="Adresse"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <label className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <input
                type="checkbox"
                checked={form.show_address}
                onChange={(e) =>
                  updateField('show_address', e.target.checked)
                }
                className="h-5 w-5"
              />
              <span>Afficher l’adresse sur la carte</span>
            </label>

            <input
              value={form.website}
              onChange={(e) =>
                updateField('website', e.target.value)
              }
              placeholder="Site web"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.linkedin}
              onChange={(e) =>
                updateField('linkedin', e.target.value)
              }
              placeholder="LinkedIn"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.instagram}
              onChange={(e) =>
                updateField('instagram', e.target.value)
              }
              placeholder="Instagram"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.facebook}
              onChange={(e) =>
                updateField('facebook', e.target.value)
              }
              placeholder="Facebook"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <input
              value={form.whatsapp}
              onChange={(e) =>
                updateField('whatsapp', e.target.value)
              }
              placeholder="WhatsApp"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />

            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <p className="mb-3 font-semibold">Logo</p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadAsset(file, 'logo')
                }}
              />

              {uploading === 'logo' && (
                <p className="mt-2 text-sm text-[#d6a85f]">
                  Envoi du logo...
                </p>
              )}

              {form.logo_url && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={form.logo_url}
                    alt="Logo"
                    className="h-20 w-20 rounded-xl bg-white object-contain p-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeAsset('logo')}
                    disabled={uploading !== null}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Supprimer le logo
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <p className="mb-3 font-semibold">Photo</p>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadAsset(file, 'photo')
                }}
              />

              {uploading === 'photo' && (
                <p className="mt-2 text-sm text-[#d6a85f]">
                  Envoi de la photo...
                </p>
              )}

              {form.photo_url && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={form.photo_url}
                    alt="Photo"
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeAsset('photo')}
                    disabled={uploading !== null}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Supprimer la photo
                  </button>
                </div>
              )}
            </div>
          </div>

          <textarea
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Courte présentation"
            rows={3}
            className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
          />

          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-[4px] text-[#d6a85f]">
              Apparence
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={form.theme}
                onChange={(e) =>
                  updateField('theme', e.target.value)
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
              >
                <option value="classic">Classic</option>
                <option value="dark">Dark Premium</option>
                <option value="brand">Brand Color</option>
              </select>

              <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
                <input
                  type="color"
                  value={form.brand_color}
                  onChange={(e) =>
                    updateField('brand_color', e.target.value)
                  }
                  className="h-11 w-16"
                />

                <span>Couleur de marque</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-[4px] text-[#d6a85f]">
              Abonnement
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="date"
                value={form.subscription_start_date}
                onChange={(e) =>
                  updateField(
                    'subscription_start_date',
                    e.target.value
                  )
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
              />

              <input
                type="date"
                value={form.subscription_end_date}
                onChange={(e) =>
                  updateField(
                    'subscription_end_date',
                    e.target.value
                  )
                }
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
              />

              <input
                value={form.subscription_plan}
                onChange={(e) =>
                  updateField(
                    'subscription_plan',
                    e.target.value
                  )
                }
                placeholder="Plan : Premium"
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
              />

              <input
                type="number"
                step="0.01"
                value={form.subscription_price}
                onChange={(e) =>
                  updateField(
                    'subscription_price',
                    e.target.value
                  )
                }
                placeholder="Prix (€)"
                className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
              />
            </div>

            <textarea
              value={form.subscription_notes}
              onChange={(e) =>
                updateField(
                  'subscription_notes',
                  e.target.value
                )
              }
              placeholder="Notes privées sur l’abonnement"
              rows={2}
              className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            />
          </div>

          <label className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                updateField('published', e.target.checked)
              }
              className="h-5 w-5"
            />

            <span>Carte publiée et accessible par QR / NFC</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-lg font-bold text-black disabled:opacity-50 md:w-auto"
          >
            {saving
              ? 'Enregistrement...'
              : editingId
                ? 'Enregistrer les modifications'
                : 'Créer la Visit Card'}
          </button>
        </form>

        <section className="mt-12">
          <h2 className="mb-6 text-3xl font-black">
            Clients
          </h2>

          {loading ? (
            <p className="text-white/50">
              Chargement...
            </p>
          ) : cards.length === 0 ? (
            <p className="text-white/50">
              Aucune Visit Card.
            </p>
          ) : (
            <div className="grid gap-4">
              {cards.map((card) => {
                const status = subscriptionStatus(
                  card.subscription_end_date
                )

                const publicUrl =
                  `https://www.framevents.fr/card/${card.slug}`

                const qrUrl =
                  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(
                    publicUrl
                  )}`

                return (
                  <article
                    key={card.id}
                    className="rounded-[28px] border border-white/10 bg-[#111] p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold">
                          {card.first_name}{' '}
                          {card.last_name}
                        </h3>

                        <p className="mt-1 text-white/50">
                          {card.company}
                        </p>

                        <p
                          className={`mt-3 text-sm font-semibold ${status.className}`}
                        >
                          ● {status.text}
                        </p>

                        <p className="mt-2 text-xs text-white/30">
                          {publicUrl}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/card/${card.slug}`}
                          target="_blank"
                          className="rounded-xl bg-white px-4 py-2 font-semibold text-black"
                        >
                          Voir
                        </Link>

                        <a
                          href={qrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-green-600 px-4 py-2"
                        >
                          QR
                        </a>

                        <button
                          type="button"
                          onClick={() => editCard(card)}
                          className="rounded-xl bg-zinc-700 px-4 py-2"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteCard(card.id)
                          }
                          className="rounded-xl bg-red-600 px-4 py-2"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-5">
                      <img
                        src={qrUrl}
                        alt="QR"
                        className="h-20 w-20 rounded-xl bg-white p-2"
                      />

                      <div className="text-sm">
                        <p className="font-semibold">
                          {card.subscription_plan ||
                            'Sans plan'}
                        </p>

                        {card.subscription_end_date && (
                          <p className="mt-1 text-white/45">
                            Jusqu’au{' '}
                            {card.subscription_end_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
