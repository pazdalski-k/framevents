import Link from 'next/link'
import { supabase } from './lib/supabase'

export default async function Home() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <main className="bg-black text-white min-h-screen">

      <section className="relative min-h-[85vh] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1800&auto=format&fit=crop"
          alt="Photographer"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

       <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 h-full flex flex-col">

          <nav className="flex justify-between items-center px-8 py-6">

            <h1 className="text-4xl font-black tracking-tight">
              EVENTFRAME
            </h1>

            <div className="hidden md:flex gap-8 text-white/70">

              <a href="#">Events</a>
              <a href="#">Pricing</a>
              <a href="#">Contact</a>

            </div>
          </nav>
          <div className="flex-1 flex items-center">

            <div className="max-w-4xl px-8">

              <p className="uppercase tracking-[6px] text-white/50 mb-6">
                Premium Event Photography
              </p>

              <h2 className="text-6xl md:text-8xl font-bold leading-[0.95]">
                Find your
                <br />
                event photos
              </h2>

              <p className="mt-8 text-xl text-white/70 max-w-2xl">
                Search events, discover galleries and access your photos in seconds.
              </p>

              <div className="mt-10 bg-white rounded-full p-3 flex max-w-2xl">

                <input
                  placeholder="Search event, city or date..."
                  className="flex-1 px-6 py-4 rounded-full text-black outline-none"
                />

                <button className="bg-black text-white px-8 rounded-full font-semibold">
                  Search
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>
      <section className="max-w-[1600px] mx-auto px-12 py-32">
        <div className="mb-20 text-center">

          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            Events
          </p>

          <h2 className="text-7xl font-bold mt-4">
            Featured Events
          </h2>

        </div>
        <div className="grid md:grid-cols-2 gap-12">
{data?.map((event) => (
  <Link
    href={`/event/${event.id}`}
    key={event.id}
    className="group bg-[#111111] rounded-[32px] overflow-hidden cursor-pointer hover:-translate-y-3 hover:scale-[1.02] hover:border-white/30 hover:shadow-[0_20px_80px_rgba(255,255,255,0.08)] transition-all duration-500 border border-white/10"
  >
    <div className="relative overflow-hidden">

      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-[320px] object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />

      <div className="absolute top-4 left-4">
        <p className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl text-[11px] uppercase tracking-[3px] text-white border border-white/20">
          {event.category}
        </p>
      </div>

    </div>

    <div className="p-6">

      <h3 className="text-3xl font-bold mt-2 tracking-tight">
        {event.title}
      </h3>

      <p className="text-white/60 mt-3">
        {event.location}
      </p>

      <p className="text-white/40 mt-3 text-sm">
        📅 {event.date}
      </p>

      <p className="text-white/40 mt-2 text-sm">
        📸 Photos: {event.photos_count}
      </p>

      <p className="text-white/50 mt-3 line-clamp-2">
        {event.description}
      </p>

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

              <button className="mt-10 bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition">
                Upload Selfie
              </button>

            </div>

            <div className="border-2 border-dashed border-white/20 rounded-[32px] h-[320px] flex items-center justify-center">

              <div className="text-center">

                <div className="text-7xl mb-6">
                  📸
                </div>

                <p className="text-xl text-white/60">
                  Drag & Drop Selfie
                </p>

              </div>

            </div>

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
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://eventframe.com/demo"
                  alt="QR Code"
                  className="w-[260px] h-[260px]"
                />

              </div>

            </div>

          </div>

        </div>

      </section>
            <section className="max-w-7xl mx-auto px-8 py-28">

        <div className="mb-14">

          <p className="uppercase tracking-[6px] text-white/40 text-sm">
            PRICING
          </p>

          <h2 className="text-6xl font-bold mt-4">
            Choose Your Package
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* PLAN 1 */}

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

          {/* PLAN 2 */}

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

          {/* PLAN 3 */}

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
            <section className="max-w-7xl mx-auto px-8 py-28">

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
                Your EventFrame Account
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

      {/* SECURITY */}

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

{/* FOOTER */}
{/* FOOTER */}

<footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/10">

  <div className="grid md:grid-cols-3 gap-16">

    <div>
      <h3 className="text-3xl font-bold mb-6">
        EVENTFRAME
      </h3>

      <p className="text-white/60 leading-relaxed">
        Premium Event Photography Platform
      </p>

      <div className="mt-8 space-y-2 text-white/60">
        <p>Instagram</p>
        <p>Contact</p>
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
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
        <p>Cloudflare R2</p>
      </div>
    </div>

    <div>
      <h4 className="text-xl font-bold mb-6">
        Payments
      </h4>

      <div className="space-y-2 text-white/60">
        <p>Visa</p>
        <p>Mastercard</p>
        <p>PayPal</p>
        <p>Apple Pay</p>
        <p>Google Pay</p>
      </div>
    </div>

  </div>

  <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-white/40 text-sm">
    <p>© 2026 EventFrame</p>
    <p>Created by Krzysztof Pazdalski</p>
  </div>

</footer>

</main>
    
  )
}