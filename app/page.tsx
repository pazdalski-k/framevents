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
    .order('date', { ascending: true })

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
      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src="/hero-framevent-2026.jpg"
          alt="Photographe FramEvent"
          className="absolute inset-0 w-full h-full object-cover object-[74%_36%] opacity-90"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/10" />

        <div className="relative z-10 min-h-[82vh] flex flex-col">
          <nav className="flex justify-between items-start px-8 py-7">
            <div>
              <div className="flex items-center gap-5">
                <div className="relative h-16 w-16">
                  <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-white" />
                  <span className="absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-white" />
                  <span className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/95" />
                  <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>

                <h1 className="text-5xl font-bold tracking-tight">
                  FramEvent
                </h1>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <span className="h-px w-14 bg-[#d6a85f]" />
                <p className="text-[#d6a85f] text-xs uppercase tracking-[0.35em]">
                  Capturez l’instant. Revivez l’émotion.
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

          <div className="flex-1 flex items-center">
            <div className="max-w-4xl px-8">
              <h2 className="text-6xl md:text-8xl font-bold leading-[0.95]">
                Retrouvez vos
                <br />
                photos.
              </h2>

              <div className="mt-6 h-px w-14 bg-[#d6a85f]" />

              <p className="mt-6 text-xl text-white/80 max-w-2xl leading-relaxed">
                Retrouvez les photos de votre événement et téléchargez-les en quelques secondes.
              </p>

              <form
                action="/"
                className="mt-10 bg-white rounded-full p-3 flex max-w-2xl shadow-2xl"
              >
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Rechercher un événement, une ville ou une date..."
                  className="flex-1 px-6 py-4 rounded-full text-black outline-none"
                />

                <button
                  type="submit"
                  className="bg-black text-white px-8 rounded-full font-semibold flex items-center"
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 pt-28 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-[#d6a85f] text-sm uppercase tracking-[4px] mb-6">
              ACCÈS
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Galeries instantanées
            </h3>

            <p className="text-white/60 leading-relaxed">
              Scannez un QR code, ouvrez l’événement et retrouvez vos photos en quelques secondes.
            </p>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-[#d6a85f] text-sm uppercase tracking-[4px] mb-6">
              QUALITÉ
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Téléchargements premium
            </h3>

            <p className="text-white/60 leading-relaxed">
              Achetez des photos en haute qualité, sans filigrane.
            </p>
          </div>

          <div className="bg-white text-black rounded-[32px] p-8">
            <p className="text-[#b7832f] text-sm uppercase tracking-[4px] mb-6">
              RECHERCHE INTELLIGENTE
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Recherche faciale prête
            </h3>

            <p className="text-black/60 leading-relaxed">
              Les futurs outils IA aideront les visiteurs à retrouver leurs photos plus rapidement.
            </p>
          </div>
        </div>
      </section>

      <section id="events" className="max-w-[1600px] mx-auto px-12 pt-12 pb-24">
        <div className="mb-16">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            ÉVÉNEMENTS
          </p>

          <h2 className="text-5xl md:text-6xl font-bold mt-4">
            Événements disponibles
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mt-20">
          {filteredEvents.map((event) => (
            <Link
              href={`/event/${event.id}`}
              key={event.id}
              className="group bg-[#111111] rounded-[36px] overflow-hidden cursor-pointer hover:-translate-y-4 hover:scale-[1.025] hover:border-white/40 hover:shadow-[0_30px_120px_rgba(255,255,255,0.12)] transition-all duration-700 border border-white/10"
            >
              <div className="relative overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-[600px] object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-[600px] bg-[radial-gradient(circle_at_top,#27272a,transparent_45%),linear-gradient(135deg,#111111,#000000)] flex items-center justify-center">
                    <div className="text-center px-8">
                      <p className="text-white/40 uppercase tracking-[5px] text-xs mb-4">
                        Galerie en préparation
                      </p>
                      <p className="text-3xl font-bold text-white">
                        Photos bientôt disponibles
                      </p>
                      <p className="text-white/50 mt-4">
                        24–48h après l’événement
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <p className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl text-[11px] uppercase tracking-[3px] text-white border border-white/20">
                    {event.category || 'Événement'}
                  </p>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-4xl font-bold tracking-tight">
                  {event.title}
                </h3>

                <p className="text-white/50 mt-3 text-lg">
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
                    Voir la galerie →
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
            Retrouvez vos photos
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Recherche par selfie
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Téléversez un selfie et retrouvez rapidement vos photos de l’événement.
              </p>

              <p className="text-white/40 mt-6 leading-relaxed">
                C’est la première étape de la recherche faciale FramEvent. Le moteur IA sera connecté dans une prochaine version.
              </p>
            </div>

            <SelfieUploadBox />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            ACCÈS QR
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Scannez le QR code de l’événement
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Accès instantané
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Scannez le QR code pendant l’événement pour accéder à la galerie, aux photos premium et aux futurs outils de recherche.
              </p>

              <a
                href="#events"
                className="inline-block mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition"
              >
                Voir les événements
              </a>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-[32px]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.framevent.fr"
                  alt="Code QR FramEvent"
                  className="w-[260px] h-[260px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            TARIFS
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Choisissez votre formule
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              Photo individuelle
            </h3>

            <div className="text-5xl font-bold mt-8">
              À partir de 2,99€
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Qualité HD</li>
              <li>✓ Sans filigrane</li>
              <li>✓ Prix selon l’événement</li>
            </ul>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              Pack photos
            </h3>

            <div className="text-5xl font-bold mt-8">
              Réduction disponible
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Plusieurs photos</li>
              <li>✓ Qualité HD</li>
              <li>✓ Tarifs avantageux</li>
            </ul>
          </div>

          <div className="bg-white text-black rounded-[40px] p-10">
            <div className="text-sm font-semibold">
              SELON L’ÉVÉNEMENT
            </div>

            <h3 className="text-3xl font-bold mt-4">
              Galerie complète
            </h3>

            <div className="text-5xl font-bold mt-8">
              Prix personnalisé
            </div>

            <ul className="mt-8 space-y-4 opacity-70">
              <li>✓ Toutes les photos</li>
              <li>✓ Qualité HD</li>
              <li>✓ Prix défini par événement</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="account" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            COMPTE
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Connexion & accès
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Votre compte FramEvent
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Accédez à vos photos achetées, galeries favorites et téléchargements depuis un compte sécurisé.
              </p>
            </div>

            <div className="bg-black border border-white/10 rounded-[32px] p-8">
              <input
                type="email"
                placeholder="Adresse e-mail"
                className="w-full bg-[#111111] rounded-full px-6 py-4 mb-4 outline-none"
              />

              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full bg-[#111111] rounded-full px-6 py-4 mb-6 outline-none"
              />

              <button className="w-full bg-white text-black py-4 rounded-full font-semibold">
                Se connecter
              </button>

              <button className="w-full mt-4 border border-white/20 py-4 rounded-full">
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-28">
        <p className="uppercase tracking-[6px] text-white/40 text-sm mb-4">
          SÉCURITÉ
        </p>

        <h2 className="text-6xl font-bold mb-16">
          Vos photos sont protégées
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">🔒 Connexion chiffrée</h3>
            <p className="text-white/60">Connexion sécurisée et données protégées.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">💳 Paiements sécurisés</h3>
            <p className="text-white/60">Stripe, PayPal, Apple Pay, Revolut Pay et Google Pay.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">📸 Qualité HD</h3>
            <p className="text-white/60">Fichiers originaux sans perte de qualité.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">👤 Accès privé</h3>
            <p className="text-white/60">Accès réservé aux utilisateurs autorisés.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">⚡ Téléchargement immédiat</h3>
            <p className="text-white/60">Téléchargez vos photos immédiatement après l’achat.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">🛡 Conforme RGPD</h3>
            <p className="text-white/60">Conforme au RGPD européen.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            CONTACT
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Travaillez avec FramEvent
          </h2>

          <p className="text-white/60 text-xl mt-6 max-w-3xl leading-relaxed">
            Pour une couverture événementielle, une accréditation média, une séance photo privée ou une demande liée à une galerie, contactez directement Krzysztof Pazdalski.
          </p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Coordonnées
              </h3>

              <div className="space-y-4 text-white/60 text-lg">
                <p>📍 Normandie, France</p>

                <a
                  href="mailto:contact@framevent.fr"
                  className="block hover:text-white transition"
                >
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
                Utilisez ce contact pour la photographie événementielle, les accréditations média, les questions de galerie et les séances photo commerciales.
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
              Plateforme premium de photographie événementielle
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
                Politique de confidentialité
              </Link>

              <Link href="/terms" className="block hover:text-white transition">
                Conditions générales de vente
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">
              Technologies
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
              <p>Visa</p>
              <p>Mastercard</p>
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