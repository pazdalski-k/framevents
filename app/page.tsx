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
    <main className="bg-black text-white min-h-screen">
      <section className="relative min-h-[100svh] md:min-h-[92vh] overflow-hidden">
  <img
    src="/hero-framevent-2026.jpg"
    alt="FramEvent"
    className="absolute inset-0 w-full h-full object-cover object-[58%_35%] md:object-[72%_30%] opacity-100"
  />

  <div
    className="absolute inset-0"
    style={{
      background:
        'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0) 100%), linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.50) 20%, rgba(0,0,0,0.10) 48%, rgba(0,0,0,0) 75%)',
    }}
  />

  <div className="relative z-10 min-h-[100svh] md:min-h-[92vh] flex flex-col">
    <nav className="flex justify-between items-start px-5 md:px-8 py-6">
      <div>
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative h-10 w-10 md:h-16 md:w-16">
            <span className="absolute left-0 top-0 h-3 w-3 md:h-5 md:w-5 border-l-2 border-t-2 border-white" />
            <span className="absolute right-0 bottom-0 h-3 w-3 md:h-5 md:w-5 border-r-2 border-b-2 border-white" />
            <span className="absolute left-1/2 top-1/2 h-7 w-7 md:h-11 md:w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/95" />
            <span className="absolute left-1/2 top-1/2 h-5 w-5 md:h-8 md:w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            FramEvent
          </h1>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-9 md:w-14 bg-[#d6a85f]" />
          <p className="text-[#d6a85f] text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.35em]">
            L’instant. L’émotion. L’image.
          </p>
        </div>
      </div>

      <div className="hidden md:flex gap-10 text-white/90 text-base">
        <a href="#events" className="hover:text-white transition border-b border-[#d6a85f] pb-2">
          Événements
        </a>
        <a href="#pricing" className="hover:text-white transition border-b border-[#d6a85f] pb-2">
          Tarifs
        </a>
        <a href="#contact" className="hover:text-white transition border-b border-[#d6a85f] pb-2">
          Contact
        </a>
      </div>
    </nav>

    <div className="flex-1 flex items-end md:items-center pb-20 md:pb-0">
      <div className="w-full max-w-[360px] md:max-w-3xl px-5 md:px-8">
        <h2 className="text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight">
          Vos photos.
          <br />
          Tout simplement.
        </h2>

        <div className="mt-5 md:mt-7 h-px w-12 md:w-14 bg-[#d6a85f]" />

        <p className="mt-5 md:mt-7 text-base md:text-lg text-white/80 max-w-sm md:max-w-lg leading-relaxed">
          Retrouvez votre galerie. Téléchargez vos images en HD.
        </p>

        <form
          action="/"
          className="mt-7 md:mt-10 bg-white rounded-full p-2 md:p-3 flex w-full max-w-sm md:max-w-xl shadow-2xl"
        >
          <input
            name="q"
            defaultValue={search}
            placeholder="Rechercher..."
            className="flex-1 min-w-0 px-4 md:px-6 py-3 md:py-4 rounded-full text-black outline-none text-sm md:text-base"
          />

          <button
            type="submit"
            className="bg-black text-white px-5 md:px-8 rounded-full font-semibold flex items-center text-sm md:text-base"
          >
            OK
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

      <section className="max-w-7xl mx-auto px-8 pt-16 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-[#d6a85f] text-sm uppercase tracking-[4px] mb-6">
              ACCÈS
            </p>
            <h3 className="text-3xl font-bold mb-4">
              Galeries instantanées
            </h3>
            <p className="text-white/60 leading-relaxed">
              Scannez le QR code et ouvrez directement votre événement.
            </p>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-[#d6a85f] text-sm uppercase tracking-[4px] mb-6">
              QUALITÉ
            </p>
            <h3 className="text-3xl font-bold mb-4">
              Téléchargements HD
            </h3>
            <p className="text-white/60 leading-relaxed">
              Des images propres, haute qualité, sans filigrane après achat.
            </p>
          </div>

          <div className="bg-white text-black rounded-[32px] p-8">
            <p className="text-[#b7832f] text-sm uppercase tracking-[4px] mb-6">
              RECHERCHE
            </p>
            <h3 className="text-3xl font-bold mb-4">
              Recherche faciale
            </h3>
            <p className="text-black/60 leading-relaxed">
              Bientôt, retrouvez vos photos avec un simple selfie.
            </p>
          </div>
        </div>
      </section>

      <section id="events" className="max-w-[1600px] mx-auto px-8 md:px-12 pt-8 pb-24">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            ÉVÉNEMENTS
          </p>

          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Galeries disponibles
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <Link
              href={`/event/${event.id}`}
              key={event.id}
              className="group bg-[#111111] rounded-[36px] overflow-hidden hover:-translate-y-2 hover:scale-[1.015] hover:border-white/30 hover:shadow-[0_30px_90px_rgba(255,255,255,0.10)] transition-all duration-500 border border-white/10"
            >
              <div className="relative overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-[420px] object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-[420px] bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)] flex items-center justify-center">
                    <div className="text-center px-8">
                      <p className="text-white/40 uppercase tracking-[5px] text-xs mb-4">
                        Galerie en préparation
                      </p>
                      <p className="text-3xl font-bold text-white">
                        Bientôt disponible
                      </p>
                      <p className="text-white/50 mt-4">
                        24–48h après l’événement
                      </p>
                    </div>
                  </div>
                )}

                <div
  className="absolute inset-x-0 bottom-0 h-[45%]"
  style={{
    background:
      'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 12%, rgba(0,0,0,0.75) 28%, rgba(0,0,0,0.45) 52%, rgba(0,0,0,0.15) 78%, rgba(0,0,0,0) 100%)'
  }}
/>

                <div className="absolute top-4 left-4">
                  <p className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl text-[11px] uppercase tracking-[3px] text-white border border-white/20">
                    {event.category || 'Événement'}
                  </p>
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-3xl font-bold tracking-tight">
                  {event.title}
                </h3>

                <p className="text-white/50 mt-3">
                  📍 {event.location}
                </p>

                <p className="text-white/35 mt-2">
                  📅 {formatDate(event.date)}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-white/50 text-sm">
                    📸 {event.photos_count || 0} photos
                  </p>

                  <span className="text-white font-medium group-hover:translate-x-1 transition-transform">
                    Ouvrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            RECHERCHE IA
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Retrouvez vos images
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Recherche par selfie
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Une recherche simple, rapide et pensée pour les galeries événementielles.
              </p>

              <p className="text-white/40 mt-6 leading-relaxed">
                Le moteur IA sera connecté dans une prochaine version.
              </p>
            </div>

            <SelfieUploadBox />
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            TARIFS
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Prix par galerie
          </h2>

          <p className="text-white/50 text-xl mt-6 max-w-3xl">
            Chaque événement peut avoir son propre tarif.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              Photo individuelle
            </h3>
            <div className="text-5xl font-bold mt-8">
              Dès 2,99€
            </div>
            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Qualité HD</li>
              <li>✓ Sans filigrane</li>
              <li>✓ Prix selon événement</li>
            </ul>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              Pack photos
            </h3>
            <div className="text-5xl font-bold mt-8">
              Sur mesure
            </div>
            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Plusieurs images</li>
              <li>✓ Tarifs ajustables</li>
              <li>✓ Idéal familles/groupes</li>
            </ul>
          </div>

          <div className="bg-white text-black rounded-[40px] p-10">
            <div className="text-sm font-semibold">
              PREMIUM
            </div>
            <h3 className="text-3xl font-bold mt-4">
              Galerie complète
            </h3>
            <div className="text-5xl font-bold mt-8">
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

      <section id="contact" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            CONTACT
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Travailler ensemble
          </h2>

          <p className="text-white/60 text-xl mt-6 max-w-3xl leading-relaxed">
            Événements, accréditations, galeries privées et séances photo.
          </p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Krzysztof Pazdalski
              </h3>

              <div className="space-y-4 text-white/60 text-lg">
                <p>📍 Normandie, France</p>

                <a href="mailto:contact@framevent.fr" className="block hover:text-white transition">
                  ✉️ contact@framevent.fr
                </a>

                <a
                  href="https://www.instagram.com/kristof.pazdalski"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition"
                >
                  📸 Instagram
                </a>
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-[32px] p-8">
              <p className="text-white/60 leading-relaxed">
                Pour une galerie, une demande photo ou une accréditation média.
              </p>

              <a
                href="mailto:contact@framevent.fr"
                className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
              >
                Envoyer un e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">
              FramEvent
            </h3>

            <p className="text-white/60 leading-relaxed">
              Photographie événementielle premium.
            </p>

            <div className="mt-8 space-y-2 text-white/60">
              <a href="mailto:contact@framevent.fr" className="block hover:text-white transition">
                Contact
              </a>

              <a
                href="https://www.instagram.com/kristof.pazdalski"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition"
              >
                Instagram
              </a>

              <Link href="/privacy" className="block hover:text-white transition">
                Confidentialité
              </Link>

              <Link href="/terms" className="block hover:text-white transition">
                Conditions de vente
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">
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
            <h4 className="text-xl font-bold mb-6">
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

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-white/40 text-sm">
          <p>© 2026 FramEvent</p>
          <p>Créé par Krzysztof Pazdalski</p>
        </div>
      </footer>
    </main>
  )
}