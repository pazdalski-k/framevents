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
    return new Date(date).toLocaleDateString('en-GB', {
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
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="/hero2-eventframe.jpg"
          alt="Photographer"
          className="absolute inset-0 w-full h-full object-cover object-[60%_28%] opacity-40"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 h-full flex flex-col">
          <nav className="flex justify-between items-center px-8 py-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none tracking-tight">
                  ⌜◉⌟
                </span>

                <h1 className="text-3xl font-semibold tracking-tight">
                  FramEvent
                </h1>
              </div>

              <p className="text-white/50 text-sm mt-1 tracking-wide">
                Event Photography in Normandy
              </p>
            </div>

            <div className="hidden md:flex gap-8 text-white/70">
              <a href="#events">Events</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>

          <div className="flex-1 flex items-center">
            <div className="max-w-4xl px-8">
              <h2 className="text-6xl md:text-8xl font-bold leading-[0.95]">
                Find your
                <br />
                photos.
              </h2>

              <p className="mt-8 text-xl text-white/70 max-w-2xl">
                Find your event photos and download them in seconds.
              </p>

              <form
                action="/"
                className="mt-10 bg-white rounded-full p-3 flex max-w-2xl"
              >
                <input
                  name="q"
                  defaultValue={search}
                  placeholder="Search event, city or date..."
                  className="flex-1 px-6 py-4 rounded-full text-black outline-none"
                />

                <button
                  type="submit"
                  className="bg-black text-white px-8 rounded-full font-semibold flex items-center"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 pt-28 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-white/40 text-sm uppercase tracking-[4px] mb-6">
              Access
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Instant galleries
            </h3>

            <p className="text-white/60 leading-relaxed">
              Scan a QR code, open the event and find your photos in seconds.
            </p>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[32px] p-8">
            <p className="text-white/40 text-sm uppercase tracking-[4px] mb-6">
              Quality
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Premium downloads
            </h3>

            <p className="text-white/60 leading-relaxed">
              Buy high-quality images from events without watermarks.
            </p>
          </div>

          <div className="bg-white text-black rounded-[32px] p-8">
            <p className="text-black/40 text-sm uppercase tracking-[4px] mb-6">
              Smart Search
            </p>

            <h3 className="text-3xl font-bold mb-4">
              Face search ready
            </h3>

            <p className="text-black/60 leading-relaxed">
              Future AI tools will help visitors find photos of themselves faster.
            </p>
          </div>
        </div>
      </section>

      <section id="events" className="max-w-[1600px] mx-auto px-12 pt-12 pb-24">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[6px] text-white/40 text-sm">
              Events
            </p>

            <h2 className="text-5xl md:text-6xl font-bold mt-4">
              Featured Events
            </h2>
          </div>
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
                        Gallery pending
                      </p>
                      <p className="text-3xl font-bold text-white">
                        Photos available soon
                      </p>
                      <p className="text-white/50 mt-4">
                        24–48h after the event
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />

                <div className="absolute top-4 left-4">
                  <p className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl text-[11px] uppercase tracking-[3px] text-white border border-white/20">
                    {event.category}
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
                    View Gallery →
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
            AI SEARCH
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Find Your Photos
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Face Search Selfie
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Upload a selfie and instantly find your photos from the event.
                Fast, simple and secure.
              </p>

              <p className="text-white/40 mt-6 leading-relaxed">
                This is the first step of FramEvent face search. The AI matching
                engine will be connected in the next stage.
              </p>
            </div>

            <SelfieUploadBox />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            QR ACCESS
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Scan Event QR Code
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Instant Event Access
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Scan the QR code during the event and instantly access galleries,
                premium photos and selfie face search.
              </p>

              <button className="mt-10 border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition">
                Open Demo Event
              </button>
            </div>

            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-[32px]">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.framevent.fr"
                  alt="QR Code"
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
            PRICING
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Choose Your Package
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              Single Photo
            </h3>

            <div className="text-6xl font-bold mt-8">
              5€
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Full HD Quality</li>
              <li>✓ No Watermark</li>
              <li>✓ Instant Download</li>
            </ul>

            <button className="mt-10 w-full bg-white text-black py-4 rounded-full font-semibold">
              Select
            </button>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10">
            <h3 className="text-3xl font-bold">
              5 Photos
            </h3>

            <div className="text-6xl font-bold mt-8">
              18€
            </div>

            <ul className="mt-8 space-y-4 text-white/60">
              <li>✓ Full HD Quality</li>
              <li>✓ No Watermark</li>
              <li>✓ Save 10%</li>
            </ul>

            <button className="mt-10 w-full bg-white text-black py-4 rounded-full font-semibold">
              Select
            </button>
          </div>

          <div className="bg-white text-black rounded-[40px] p-10">
            <div className="text-sm font-semibold">
              MOST POPULAR
            </div>

            <h3 className="text-3xl font-bold mt-4">
              Full Gallery
            </h3>

            <div className="text-6xl font-bold mt-8">
              49€
            </div>

            <ul className="mt-8 space-y-4 opacity-70">
              <li>✓ All Photos</li>
              <li>✓ Full HD Quality</li>
              <li>✓ No Watermark</li>
            </ul>

            <button className="mt-10 w-full bg-black text-white py-4 rounded-full font-semibold">
              Select
            </button>
          </div>
        </div>
      </section>

      <section id="account" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            ACCOUNT
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Login & Access
          </h2>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-14">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold">
                Your FramEvent Account
              </h3>

              <p className="text-white/60 text-xl mt-6 leading-relaxed">
                Access your purchased photos, favorite galleries and downloads from one secure account.
              </p>
            </div>

            <div className="bg-black border border-white/10 rounded-[32px] p-8">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-[#111111] rounded-full px-6 py-4 mb-4 outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#111111] rounded-full px-6 py-4 mb-6 outline-none"
              />

              <button className="w-full bg-white text-black py-4 rounded-full font-semibold">
                Login
              </button>

              <button className="w-full mt-4 border border-white/20 py-4 rounded-full">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-28">
        <p className="uppercase tracking-[6px] text-white/40 text-sm mb-4">
          SECURITY
        </p>

        <h2 className="text-6xl font-bold mb-16">
          Your Photos Are Safe
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">🔒 SSL Encrypted</h3>
            <p className="text-white/60">Secure connection and protected data.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">💳 Secure Payments</h3>
            <p className="text-white/60">Stripe, PayPal, Apple Pay and Google Pay.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">📸 HD Quality</h3>
            <p className="text-white/60">Original files without quality loss.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">👤 Private Access</h3>
            <p className="text-white/60">Access only for authorized users.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">⚡ Instant Download</h3>
            <p className="text-white/60">Download photos immediately after purchase.</p>
          </div>

          <div className="bg-[#111111] rounded-[32px] p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">🛡 GDPR Compliant</h3>
            <p className="text-white/60">European privacy standards respected.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-7xl mx-auto px-8 py-28">
        <div className="mb-14">
          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            CONTACT
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Work with FramEvent
          </h2>

          <p className="text-white/60 text-xl mt-6 max-w-3xl leading-relaxed">
            For event coverage, accreditation, private sessions or photo requests,
            contact Krzysztof Pazdalski directly.
          </p>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-[40px] p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Contact details
              </h3>

              <div className="space-y-4 text-white/60 text-lg">
                <p>📍 Normandy, France</p>

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
                Use this contact for event photography, media accreditation,
                gallery questions and commercial photo sessions.
              </p>

              <a
                href="mailto:contact@framevent.fr"
                className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
              >
                Send email
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
              Premium Event Photography Platform
            </p>

            <div className="mt-8 space-y-2 text-white/60">
              <a
                href="mailto:contact@framevent.fr"
                className="block hover:text-white transition"
              >
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

              <Link
                href="/privacy"
                className="block hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="block hover:text-white transition"
              >
                Terms & Conditions
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
              Payments
            </h4>

            <div className="space-y-2 text-white/60">
              <p>Visa</p>
              <p>Mastercard</p>
              <p>Apple Pay</p>
              <p>Google Pay</p>
              <p>PayPal soon</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-white/40 text-sm">
          <p>© 2026 FramEvent</p>
          <p>Created by Krzysztof Pazdalski</p>
        </div>
      </footer>
    </main>
  )
}