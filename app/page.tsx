import Link from 'next/link'
import { supabase } from './lib/supabase'
import SelfieUploadBox from './components/SelfieUploadBox'

export const dynamic = 'force-dynamic'

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
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="/hero-framevent-2026.jpg"
          alt="FramEvent"
          className="absolute inset-0 h-full w-full object-cover object-[62%_28%] opacity-100 md:object-[70%_28%]"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(0,0,0,0.78) 0%,
                rgba(0,0,0,0.35) 28%,
                rgba(0,0,0,0.35) 48%,
                rgba(0,0,0,0.92) 100%
              ),
              linear-gradient(
                90deg,
                rgba(0,0,0,0.82) 0%,
                rgba(0,0,0,0.46) 46%,
                rgba(0,0,0,0.08) 100%
              )
            `,
          }}
        />

        <div className="relative z-10 flex min-h-[100svh] flex-col">
          <nav className="flex items-start justify-between px-4 py-5 md:px-8 md:py-6">
            <div>
              <div className="flex items-center gap-3 md:gap-5">
                <div className="relative h-10 w-10 shrink-0 md:h-16 md:w-16">
                  <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-white md:h-5 md:w-5" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-white md:h-5 md:w-5" />
                  <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/95 md:h-11 md:w-11" />
                  <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:h-8 md:w-8" />
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  FramEvent
                </h1>
              </div>

              <div className="mt-3 flex items-center gap-3 md:mt-4">
                <span className="h-px w-8 bg-[#d6a85f] md:w-14" />
                <p className="text-[9px] uppercase tracking-[0.22em] text-[#d6a85f] md:text-xs md:tracking-[0.35em]">
                  L’instant. L’émotion. L’image.
                </p>
              </div>
            </div>

            <div className="hidden gap-10 text-base text-white/90 md:flex">
              <a href="#events" className="border-b border-[#d6a85f] pb-2 transition hover:text-white">
                Événements
              </a>
              <a href="#pricing" className="border-b border-[#d6a85f] pb-2 transition hover:text-white">
                Tarifs
              </a>
              <a href="#contact" className="border-b border-[#d6a85f] pb-2 transition hover:text-white">
                Contact
              </a>
            </div>
          </nav>

          <div className="flex flex-1 items-end px-4 pb-12 md:items-center md:px-8 md:pb-0">
            <div className="w-full max-w-[390px] md:max-w-3xl">
              <h2 className="text-[38px] font-bold leading-[0.95] tracking-tight md:text-6xl">
                Vos photos.
                <br />
                Tout simplement.
              </h2>

              <div className="mt-5 h-px w-12 bg-[#d6a85f] md:mt-7 md:w-14" />

              <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-white/80 md:mt-7 md:max-w-lg md:text-lg">
                Retrouvez votre galerie. Téléchargez vos images en HD.
              </p>

              <form
                action="/"
                className="mt-7 flex w-full max-w-[340px] rounded-full bg-white p-2 shadow-2xl md:mt-10 md:max-w-xl md:p-3"
              >
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Rechercher..."
                  className="min-w-0 flex-1 rounded-full px-4 py-3 text-sm text-black outline-none md:px-6 md:py-4 md:text-base"
                />

                <button
                  type="submit"
                  className="flex items-center rounded-full bg-black px-5 text-sm font-semibold text-white md:px-8 md:text-base"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 md:rounded-[32px] md:p-8">
            <p className="mb-4 text-xs uppercase tracking-[4px] text-[#d6a85f] md:mb-6 md:text-sm">
              ACCÈS
            </p>
            <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
              Galeries instantanées
            </h3>
            <p className="leading-relaxed text-white/60">
              Scannez le QR code et ouvrez directement votre événement.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111111] p-6 md:rounded-[32px] md:p-8">
            <p className="mb-4 text-xs uppercase tracking-[4px] text-[#d6a85f] md:mb-6 md:text-sm">
              QUALITÉ
            </p>
            <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
              Téléchargements HD
            </h3>
            <p className="leading-relaxed text-white/60">
              Des images propres, haute qualité, sans filigrane après achat.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 text-black md:rounded-[32px] md:p-8">
            <p className="mb-4 text-xs uppercase tracking-[4px] text-[#b7832f] md:mb-6 md:text-sm">
              RECHERCHE
            </p>
            <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
              Recherche faciale
            </h3>
            <p className="leading-relaxed text-black/60">
              Bientôt, retrouvez vos photos avec un simple selfie.
            </p>
          </div>
        </div>
      </section>

      <section id="events" className="mx-auto max-w-[1600px] px-4 py-14 md:px-12 md:py-24">
        <div className="mb-8 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            ÉVÉNEMENTS
          </p>

          <h2 className="mt-3 text-3xl font-bold md:mt-4 md:text-6xl">
            Galeries disponibles
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10">
          {filteredEvents.map((event) => (
            <Link
              href={`/event/${event.id}`}
              key={event.id}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:border-white/30 hover:shadow-[0_30px_90px_rgba(255,255,255,0.10)] md:rounded-[36px]"
            >
              <div className="relative overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-110 md:h-[420px]"
                  />
                ) : (
                  <div className="flex h-[260px] w-full items-center justify-center bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)] md:h-[420px]">
                    <div className="px-8 text-center">
                      <p className="mb-4 text-xs uppercase tracking-[5px] text-white/40">
                        Galerie en préparation
                      </p>
                      <p className="text-2xl font-bold text-white md:text-3xl">
                        Bientôt disponible
                      </p>
                      <p className="mt-4 text-white/50">
                        24–48h après l’événement
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <p className="mb-4 text-xs uppercase tracking-[4px] text-[#d6a85f]">
                  {event.category || 'Événement'}
                </p>

                <h3 className="text-2xl font-bold leading-tight md:text-3xl">
                  {event.title}
                </h3>

                <p className="mt-4 text-white/50">
                  📍 {event.location}
                </p>

                <p className="mt-2 text-white/35">
                  📅 {formatDate(event.date)}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-white/50">
                    📸 {event.photos_count || 0} photos
                  </p>

                  <span className="shrink-0 font-medium text-white transition-transform group-hover:translate-x-1">
                    Ouvrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
        <div className="mb-8 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            RECHERCHE IA
          </p>

          <h2 className="mt-3 text-3xl font-bold md:mt-4 md:text-6xl">
            Retrouvez vos images
          </h2>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[#111111] p-6 md:rounded-[40px] md:p-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <h3 className="text-2xl font-bold md:text-4xl">
                Recherche par selfie
              </h3>

              <p className="mt-5 text-base leading-relaxed text-white/60 md:mt-6 md:text-xl">
                Une recherche simple, rapide et pensée pour les galeries événementielles.
              </p>

              <p className="mt-5 leading-relaxed text-white/40 md:mt-6">
                Le moteur IA sera connecté dans une prochaine version.
              </p>
            </div>

            <SelfieUploadBox />
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
        <div className="mb-8 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            TARIFS
          </p>

          <h2 className="mt-3 text-3xl font-bold md:mt-4 md:text-6xl">
            Prix par galerie
          </h2>

          <p className="mt-5 max-w-3xl text-base text-white/50 md:mt-6 md:text-xl">
            Chaque événement peut avoir son propre tarif.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="rounded-[30px] border border-white/10 bg-[#111111] p-6 md:rounded-[40px] md:p-10">
            <h3 className="text-2xl font-bold md:text-3xl">
              Photo individuelle
            </h3>
            <div className="mt-6 text-4xl font-bold md:mt-8 md:text-5xl">
              Dès 2,99€
            </div>
            <ul className="mt-6 space-y-4 text-white/60 md:mt-8">
              <li>✓ Qualité HD</li>
              <li>✓ Sans filigrane</li>
              <li>✓ Prix selon événement</li>
            </ul>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#111111] p-6 md:rounded-[40px] md:p-10">
            <h3 className="text-2xl font-bold md:text-3xl">
              Pack photos
            </h3>
            <div className="mt-6 text-4xl font-bold md:mt-8 md:text-5xl">
              Sur mesure
            </div>
            <ul className="mt-6 space-y-4 text-white/60 md:mt-8">
              <li>✓ Plusieurs images</li>
              <li>✓ Tarifs ajustables</li>
              <li>✓ Idéal familles/groupes</li>
            </ul>
          </div>

          <div className="rounded-[30px] bg-white p-6 text-black md:rounded-[40px] md:p-10">
            <div className="text-sm font-semibold">
              PREMIUM
            </div>
            <h3 className="mt-4 text-2xl font-bold md:text-3xl">
              Galerie complète
            </h3>
            <div className="mt-6 text-4xl font-bold md:mt-8 md:text-5xl">
              Selon événement
            </div>
            <ul className="mt-6 space-y-4 opacity-70 md:mt-8">
              <li>✓ Toutes les photos</li>
              <li>✓ Qualité HD</li>
              <li>✓ Prix défini dans l’admin</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-28">
        <div className="mb-8 md:mb-14">
          <p className="text-xs uppercase tracking-[5px] text-white/40 md:text-sm md:tracking-[6px]">
            CONTACT
          </p>

          <h2 className="mt-3 text-3xl font-bold md:mt-4 md:text-6xl">
            Travailler ensemble
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/60 md:mt-6 md:text-xl">
            Événements, accréditations, galeries privées et séances photo.
          </p>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[#111111] p-6 md:rounded-[40px] md:p-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <h3 className="mb-5 text-2xl font-bold md:mb-6 md:text-3xl">
                Krzysztof Pazdalski
              </h3>

              <div className="space-y-4 text-base text-white/60 md:text-lg">
                <p>📍 Normandie, France</p>

                <a href="mailto:contact@framevent.fr" className="block transition hover:text-white">
                  ✉️ contact@framevent.fr
                </a>

                <a
                  href="https://www.instagram.com/kristof.pazdalski"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition hover:text-white"
                >
                  📸 Instagram
                </a>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black p-6 md:rounded-[32px] md:p-8">
              <p className="leading-relaxed text-white/60">
                Pour une galerie, une demande photo ou une accréditation média.
              </p>

              <a
                href="mailto:contact@framevent.fr"
                className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:scale-105 md:px-8"
              >
                Envoyer un e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/10 px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
          <div>
            <h3 className="mb-5 text-3xl font-bold md:mb-6">
              FramEvent
            </h3>

            <p className="leading-relaxed text-white/60">
              Photographie événementielle premium.
            </p>

            <div className="mt-8 space-y-2 text-white/60">
              <a href="mailto:contact@framevent.fr" className="block transition hover:text-white">
                Contact
              </a>

              <a
                href="https://www.instagram.com/kristof.pazdalski"
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
            <h4 className="mb-5 text-xl font-bold md:mb-6">
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
            <h4 className="mb-5 text-xl font-bold md:mb-6">
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

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/40 md:mt-16 md:flex-row md:justify-between">
          <p>© 2026 FramEvent</p>
          <p>Créé par Krzysztof Pazdalski</p>
        </div>
      </footer>
    </main>
  )
}