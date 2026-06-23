import Link from 'next/link'
import { supabase } from './lib/supabase'
import SelfieUploadBox from './components/SelfieUploadBox'

export const dynamic = 'force-dynamic'

const instagramUrl = 'https://www.instagram.com/kristof.pazdalski'
const contactEmail = 'contact@framevents.fr'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const search = params?.q?.toLowerCase() || ''

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: false })

  if (error) {
    console.log('EVENTS LOAD ERROR:', error)
  }

  const events = data || []

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const filteredEvents = events.filter((event) => {
    const text = `
      ${event.title}
      ${event.location}
      ${event.date}
      ${event.category}
      ${event.description}
    `.toLowerCase()

    return text.includes(search)
  })

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-28 text-white md:pb-0">
      <section className="relative min-h-[100svh] overflow-hidden md:min-h-[92vh]">
        <img
          src="/hero-framevent-2026.jpg"
          alt="FramEvents"
          className="absolute inset-0 h-full w-full object-cover object-[60%_35%] opacity-100 md:object-[70%_28%]"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(0,0,0,0.86) 0%,
                rgba(0,0,0,0.58) 36%,
                rgba(0,0,0,0.18) 70%,
                rgba(0,0,0,0.04) 100%
              ),
              linear-gradient(
                180deg,
                rgba(0,0,0,0.60) 0%,
                rgba(0,0,0,0.18) 18%,
                rgba(0,0,0,0) 34%
              ),
              linear-gradient(
                0deg,
                rgba(0,0,0,1) 0%,
                rgba(0,0,0,0.92) 10%,
                rgba(0,0,0,0.70) 24%,
                rgba(0,0,0,0.38) 44%,
                rgba(0,0,0,0.10) 68%,
                rgba(0,0,0,0) 86%
              )
            `,
          }}
        />

        <div className="relative z-10 flex min-h-[100svh] flex-col md:min-h-[92vh]">
          <nav className="flex items-start justify-between px-5 py-6 md:px-8">
            <div>
              <div className="flex items-center gap-3 md:gap-5">
                <div className="relative h-10 w-10 shrink-0 md:h-16 md:w-16">
                  <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-white md:h-5 md:w-5" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-white md:h-5 md:w-5" />
                  <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/95 md:h-11 md:w-11" />
                  <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:h-8 md:w-8" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  FramEvents
                </h1>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-9 bg-[#d6a85f] md:w-14" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#d6a85f] md:text-xs md:tracking-[0.35em]">
                  L’instant. L’émotion. L’image.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a
                href="#events"
                className="rounded-full border border-[#d6a85f]/60 bg-black/25 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition hover:border-[#d6a85f] hover:bg-[#d6a85f] hover:text-black"
              >
                Galeries
              </a>

              <a
                href="#qr"
                className="rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-xl transition hover:border-[#d6a85f]/70 hover:text-white"
              >
                QR Code
              </a>

              <a
                href="#contact"
                className="rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-xl transition hover:border-[#d6a85f]/70 hover:text-white"
              >
                Contact
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-xl transition hover:border-[#d6a85f]/70 hover:text-white"
              >
                Instagram
              </a>
            </div>
          </nav>

          <div className="flex flex-1 items-end pb-20 md:items-center md:pb-0">
            <div className="w-full max-w-[370px] px-5 md:max-w-3xl md:px-8">
              <h2 className="text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl">
                Vos photos.
                <br />
                Tout simplement.
              </h2>

              <div className="mt-5 h-px w-12 bg-[#d6a85f] md:mt-7 md:w-14" />

              <p className="mt-5 max-w-sm text-base leading-relaxed text-white/80 md:mt-7 md:max-w-lg md:text-lg">
                Retrouvez votre galerie. Téléchargez vos images en HD.
              </p>

              <form
                action="/"
                className="mt-7 flex w-full max-w-sm rounded-full border border-white/10 bg-white p-2 shadow-2xl md:mt-10 md:max-w-xl md:p-3"
              >
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Rechercher..."
                  className="min-w-0 flex-1 rounded-full px-4 py-3 text-sm text-black outline-none md:px-6 md:py-4 md:text-base"
                />

                <button
                  type="submit"
                  className="flex items-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-[#d6a85f] hover:text-black md:px-8 md:text-base"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="qr" className="mx-auto max-w-7xl px-5 pt-16 pb-20 md:px-8">
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          <a
            href="#events"
            className="group rounded-[32px] border border-white/10 bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d6a85f]/50 hover:bg-[#151515] md:p-8"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-2xl text-[#d6a85f]">
              ⚡
            </div>

            <p className="mb-5 text-xs uppercase tracking-[4px] text-[#d6a85f] md:text-sm">
              ACCÈS
            </p>

            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">
                  Galeries instantanées
                </h3>

                <p className="mt-4 leading-relaxed text-white/60">
                  Scannez le QR code et ouvrez directement votre événement.
                </p>
              </div>

              <span className="mt-2 text-3xl text-[#d6a85f] transition group-hover:translate-x-1">
                ›
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-[#d6a85f]">
              Découvrir
            </p>
          </a>

          <a
            href="#pricing"
            className="group rounded-[32px] border border-white/10 bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d6a85f]/50 hover:bg-[#151515] md:p-8"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-2xl text-[#d6a85f]">
              ↓
            </div>

            <p className="mb-5 text-xs uppercase tracking-[4px] text-[#d6a85f] md:text-sm">
              QUALITÉ
            </p>

            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">
                  Téléchargements HD
                </h3>

                <p className="mt-4 leading-relaxed text-white/60">
                  Des images propres, haute qualité, sans filigrane après achat.
                </p>
              </div>

              <span className="mt-2 text-3xl text-[#d6a85f] transition group-hover:translate-x-1">
                ›
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-[#d6a85f]">
              Découvrir
            </p>
          </a>

          <a
            href="#selfie"
            className="group rounded-[32px] border border-white/10 bg-[#111111] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d6a85f]/50 hover:bg-[#151515] md:p-8"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-2xl text-[#d6a85f]">
              ◎
            </div>

            <p className="mb-5 text-xs uppercase tracking-[4px] text-[#d6a85f] md:text-sm">
              RECHERCHE
            </p>

            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">
                  Recherche faciale
                </h3>

                <p className="mt-4 leading-relaxed text-white/60">
                  Bientôt, retrouvez vos photos avec un simple selfie.
                </p>
              </div>

              <span className="mt-2 text-3xl text-[#d6a85f] transition group-hover:translate-x-1">
                ›
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-[#d6a85f]">
              Bientôt disponible
            </p>
          </a>
        </div>
      </section>

      <section
        id="events"
        className="mx-auto max-w-[1600px] px-5 pt-8 pb-24 md:px-12"
      >
        <div className="mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            ÉVÉNEMENTS
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            Galeries disponibles
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-3 md:gap-10">
          {filteredEvents.map((event) => (
            <Link
              href={`/event/${event.id}`}
              key={event.id}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:border-white/30 hover:shadow-[0_30px_90px_rgba(255,255,255,0.10)] md:rounded-[36px]"
            >
              <div className="relative overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-110 md:h-[420px]"
                  />
                ) : (
                  <div className="flex h-[300px] w-full items-center justify-center bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)] md:h-[420px]">
                    <div className="px-8 text-center">
                      <p className="mb-4 text-xs uppercase tracking-[5px] text-white/40">
                        Galerie en préparation
                      </p>

                      <p className="text-3xl font-bold text-white">
                        Bientôt disponible
                      </p>

                      <p className="mt-4 text-white/50">
                        24–48h après l’événement
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className="absolute inset-x-0 bottom-0 h-[45%]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 12%, rgba(0,0,0,0.75) 28%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.15) 78%, rgba(0,0,0,0) 100%)',
                  }}
                />

                <div className="absolute left-4 top-4">
                  <p className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-[11px] uppercase tracking-[3px] text-white backdrop-blur-xl">
                    {event.category || 'Événement'}
                  </p>
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-3xl font-bold tracking-tight">
                  {event.title}
                </h3>

                <p className="mt-3 text-white/50">
                  📍 {event.location}
                </p>

                <p className="mt-2 text-white/35">
                  📅 {formatDate(event.date)}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-white/50">
                    📸 {event.photos_count || 0} photos
                  </p>

                  <span className="font-medium text-white transition-transform group-hover:translate-x-1">
                    Ouvrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="selfie" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <div className="mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            RECHERCHE IA
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            Retrouvez vos images
          </h2>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-[#111111] p-7 md:rounded-[40px] md:p-14">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="text-3xl font-bold md:text-4xl">
                Recherche par selfie
              </h3>

              <p className="mt-6 text-lg leading-relaxed text-white/60 md:text-xl">
                Une recherche simple, rapide et pensée pour les galeries événementielles.
              </p>

              <p className="mt-6 leading-relaxed text-white/40">
                Le moteur IA sera connecté dans une prochaine version.
              </p>
            </div>

            <SelfieUploadBox />
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <div className="mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            TARIFS
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            Prix par galerie
          </h2>

          <p className="mt-6 max-w-3xl text-lg text-white/50 md:text-xl">
            Chaque événement peut avoir son propre tarif.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-3 md:gap-8">
          <div className="rounded-[36px] border border-white/10 bg-[#111111] p-8 md:rounded-[40px] md:p-10">
            <h3 className="text-3xl font-bold">
              Photo individuelle
            </h3>

            <div className="mt-8 text-5xl font-bold">
              Dès 2,99€
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Qualité HD</li>
              <li>✓ Sans filigrane</li>
              <li>✓ Prix selon événement</li>
            </ul>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-[#111111] p-8 md:rounded-[40px] md:p-10">
            <h3 className="text-3xl font-bold">
              Pack photos
            </h3>

            <div className="mt-8 text-5xl font-bold">
              Sur mesure
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Plusieurs images</li>
              <li>✓ Tarifs ajustables</li>
              <li>✓ Idéal familles/groupes</li>
            </ul>
          </div>

          <div className="rounded-[36px] bg-white p-8 text-black md:rounded-[40px] md:p-10">
            <div className="text-sm font-semibold">
              PREMIUM
            </div>

            <h3 className="mt-4 text-3xl font-bold">
              Galerie complète
            </h3>

            <div className="mt-8 text-5xl font-bold">
              Selon événement
            </div>

            <ul className="mt-8 space-y-4 opacity-70">
              <li>✓ Toutes les photos</li>
              <li>✓ Qualité HD</li>
              <li>✓ Prix défini dans l’admin</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(214,168,95,0.16),transparent_38%),#111111] p-8 md:rounded-[44px] md:p-14">
          <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[5px] text-[#d6a85f] md:text-sm md:tracking-[6px]">
                PHOTOGRAPHE EN NORMANDIE
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
                Photographe événementiel à Caen et en Normandie
              </h2>

              <div className="mt-6 h-px w-16 bg-[#d6a85f]" />

              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl">
                FramEvents accompagne les événements sportifs, privés et professionnels
                en Normandie avec des galeries photo élégantes, rapides et sécurisées.
                Chaque galerie permet de retrouver ses images, d’acheter une photo
                individuelle ou une galerie complète, puis de télécharger les fichiers
                HD après paiement.
              </p>

              <p className="mt-6 max-w-3xl leading-relaxed text-white/45">
                Basé près de Caen, Krzysztof Pazdalski réalise des reportages photo
                pour les événements à Caen, Deauville, Ouistreham et dans toute la
                Normandie : sport, danse, triathlon, événements associatifs, entreprises,
                mariages, portraits et séances photo privées.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-black/40 p-7 md:p-8">
              <h3 className="text-2xl font-bold">
                Services photo
              </h3>

              <div className="mt-7 space-y-4 text-white/60">
                <p>• Photographie événementielle à Caen</p>
                <p>• Galeries photo pour événements sportifs</p>
                <p>• Reportages privés et professionnels</p>
                <p>• Photos de mariage, couple, famille et portrait</p>
                <p>• Téléchargement HD sécurisé après achat</p>
              </div>

              <a
                href="#contact"
                className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#d6a85f]"
              >
                Demander une prestation
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-28">
        <div className="mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            CONTACT
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-6xl">
            Travailler ensemble
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
            Événements, accréditations, galeries privées et séances photo.
          </p>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-[#111111] p-8 md:rounded-[40px] md:p-14">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Krzysztof Pazdalski
              </h3>

              <div className="space-y-4 text-lg text-white/60">
                <p>📍 Normandie, France</p>

                <a
                  href={`mailto:${contactEmail}`}
                  className="block transition hover:text-white"
                >
                  ✉️ {contactEmail}
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition hover:text-white"
                >
                  📸 Instagram
                </a>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-black p-8">
              <p className="leading-relaxed text-white/60">
                Pour une galerie, une demande photo ou une accréditation média.
              </p>

              <a
                href={`mailto:${contactEmail}`}
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-[#d6a85f]"
              >
                Envoyer un e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/10 px-5 py-20 md:px-8">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <h3 className="mb-6 text-3xl font-bold">
              FramEvents
            </h3>

            <p className="leading-relaxed text-white/60">
              Photographie événementielle premium.
            </p>

            <div className="mt-8 space-y-2 text-white/60">
              <a
                href={`mailto:${contactEmail}`}
                className="block transition hover:text-white"
              >
                Contact
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-white"
              >
                Instagram
              </a>

              <Link href="/privacy" className="block transition hover:text-white">
                Confidentialité
              </Link>

              <Link href="/terms" className="block transition hover:text-white">
                Conditions de vente
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xl font-bold">
              Technologie
            </h4>

            <div className="space-y-2 text-white/60">
              <p>Next.js</p>
              <p>Supabase</p>
              <p>Stripe</p>
              <p>Vercel</p>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-xl font-bold">
              Paiements
            </h4>

            <div className="space-y-2 text-white/60">
              <p>Carte bancaire</p>
              <p>Apple Pay</p>
              <p>Google Pay</p>
              <p>PayPal</p>
              <p>Revolut Pay</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between border-t border-white/10 pt-8 text-sm text-white/40 md:flex-row">
          <p>© 2026 FramEvents</p>
          <p>Créé par Krzysztof Pazdalski</p>
        </div>
      </footer>

      <nav className="fixed inset-x-4 bottom-4 z-50 rounded-[32px] border border-white/15 bg-black/78 px-3 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-4 gap-1 text-center">
          <a
            href="#events"
            className="rounded-[24px] border border-[#d6a85f]/60 bg-[#d6a85f]/10 px-2 py-3 text-[#d6a85f]"
          >
            <span className="block text-xl leading-none">▧</span>
            <span className="mt-1 block text-[11px] font-medium">Galeries</span>
          </a>

          <a
            href="#qr"
            className="rounded-[24px] px-2 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="block text-xl leading-none">⌗</span>
            <span className="mt-1 block text-[11px] font-medium">QR</span>
          </a>

          <a
            href="#contact"
            className="rounded-[24px] px-2 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="block text-xl leading-none">✉</span>
            <span className="mt-1 block text-[11px] font-medium">Contact</span>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[24px] px-2 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="block text-xl leading-none">◎</span>
            <span className="mt-1 block text-[11px] font-medium">Instagram</span>
          </a>
        </div>
      </nav>
    </main>
  )
}