import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const siteUrl = 'https://www.framevents.fr'

type VisitCard = {
  slug: string
  first_name?: string | null
  last_name?: string | null
  company?: string | null
  job_title?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
  linkedin?: string | null
  instagram?: string | null
  facebook?: string | null
  whatsapp?: string | null
  bio?: string | null
  logo_url?: string | null
  photo_url?: string | null
  theme?: string | null
  brand_color?: string | null
  show_phone?: boolean | null
  show_email?: boolean | null
  show_address?: boolean | null
  show_website?: boolean | null
  show_linkedin?: boolean | null
  show_instagram?: boolean | null
  show_facebook?: boolean | null
  show_whatsapp?: boolean | null
  published?: boolean | null
}

function SocialButton({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-center font-semibold transition hover:bg-white/10"
    >
      {label}
    </a>
  )
}

export default async function VisitCardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        Configuration Supabase manquante.
      </main>
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data } = await supabase
    .from('visit_cards')
    .select(`
      slug,
      first_name,
      last_name,
      company,
      job_title,
      phone,
      email,
      address,
      website,
      linkedin,
      instagram,
      facebook,
      whatsapp,
      bio,
      logo_url,
      photo_url,
      theme,
      brand_color,
      show_phone,
      show_email,
      show_address,
      show_website,
      show_linkedin,
      show_instagram,
      show_facebook,
      show_whatsapp,
      published
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  const card = data as VisitCard | null

  if (!card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[5px] text-white/40">
            FramEvents Visit Card
          </p>

          <h1 className="mt-5 text-4xl font-black">
            Carte indisponible
          </h1>

          <p className="mt-4 text-white/55">
            Cette carte n’existe pas ou n’est pas encore publiée.
          </p>
        </div>
      </main>
    )
  }

  const fullName =
    `${card.first_name || ''} ${card.last_name || ''}`.trim() ||
    card.company ||
    'Visit Card'

  const initials =
    `${card.first_name?.[0] || ''}${card.last_name?.[0] || ''}`.toUpperCase() ||
    'FE'

  const accent = card.brand_color || '#d6a85f'

  const cardUrl = `${siteUrl}/card/${card.slug}`

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=18&data=${encodeURIComponent(
      cardUrl
    )}`

  const whatsappHref = card.whatsapp
    ? card.whatsapp.startsWith('http')
      ? card.whatsapp
      : `https://wa.me/${card.whatsapp.replace(/\D/g, '')}`
    : ''

  const isClassic = card.theme === 'classic'
  const isBrand = card.theme === 'brand'

  return (
    <main
      className={`min-h-screen px-4 py-8 ${
        isClassic
          ? 'bg-[#f4f1eb] text-black'
          : 'bg-black text-white'
      }`}
      style={
        isBrand
          ? {
              background: `linear-gradient(145deg, #050505 20%, ${accent} 180%)`,
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-md">
        <div
          className={`overflow-hidden rounded-[36px] border p-6 shadow-2xl ${
            isClassic
              ? 'border-black/10 bg-white'
              : 'border-white/10 bg-white/[0.05]'
          }`}
        >
          <div className="flex flex-col items-center text-center">

            {card.logo_url ? (
<img
                src={card.logo_url}
                alt={card.company || fullName}
                className="h-24 w-24 rounded-3xl object-contain"
              />
            ) : card.photo_url ? (
              <img
                src={card.photo_url}
                alt={fullName}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-3xl text-3xl font-black text-black"
                style={{ backgroundColor: accent }}
              >
                {initials}
              </div>
            )}

            <h1 className="mt-6 text-3xl font-black tracking-tight">
              {fullName}
            </h1>

            {card.company && (
              <p
                className="mt-2 text-sm font-bold uppercase tracking-[3px]"
                style={{ color: accent }}
              >
                {card.company}
              </p>
            )}

            {card.job_title && (
              <p
                className={`mt-2 ${
                  isClassic ? 'text-black/55' : 'text-white/55'
                }`}
              >
                {card.job_title}
              </p>
            )}

            {card.bio && (
              <p
                className={`mt-5 leading-relaxed ${
                  isClassic ? 'text-black/65' : 'text-white/65'
                }`}
              >
                {card.bio}
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-3">

            {card.show_phone && card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="flex min-h-[56px] items-center justify-center rounded-2xl px-5 py-3 font-bold text-black"
                style={{ backgroundColor: accent }}
              >
                📞 Appeler
              </a>
            )}

            {card.show_email && card.email && (
              <a
                href={`mailto:${card.email}`}
                className={`flex min-h-[54px] items-center justify-center rounded-2xl border px-5 py-3 font-semibold ${
                  isClassic
                    ? 'border-black/10 bg-black/[0.04]'
                    : 'border-white/10 bg-white/[0.06]'
                }`}
              >
                ✉️ E-mail
              </a>
            )}

            {card.show_website && card.website && (
              <SocialButton href={card.website} label="🌐 Site web" />
            )}

            {card.show_linkedin && card.linkedin && (
              <SocialButton href={card.linkedin} label="LinkedIn" />
            )}

            {card.show_instagram && card.instagram && (
              <SocialButton href={card.instagram} label="Instagram" />
            )}

            {card.show_facebook && card.facebook && (
              <SocialButton href={card.facebook} label="Facebook" />
            )}

            {card.show_whatsapp && whatsappHref && (
              <SocialButton href={whatsappHref} label="WhatsApp" />
            )}
          </div>

          {card.show_address && card.address && (
            <div
              className={`mt-6 rounded-2xl p-4 text-center text-sm ${
                isClassic
                  ? 'bg-black/[0.04] text-black/60'
                  : 'bg-white/[0.05] text-white/60'
              }`}
            >
              📍 {card.address}
            </div>
          )}

          <div className="mt-8 border-t border-current/10 pt-7">
            <p
              className={`text-center text-xs uppercase tracking-[4px] ${
                isClassic ? 'text-black/35' : 'text-white/35'
              }`}
            >
              Partager cette carte
            </p>

            <div className="mx-auto mt-5 max-w-[220px] rounded-3xl bg-white p-4">
              <a
                href={`/card/${card.slug}/contact.vcf`}
                className="mb-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#d6a85f] px-6 py-4 font-semibold text-black transition hover:brightness-110"
              >
                <span className="text-xl">＋</span>
                Ajouter aux contacts
              </a>
              
              <img
                src={qrUrl}
                alt={`QR code ${fullName}`}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        <p
          className={`mt-6 text-center text-xs ${
            isClassic ? 'text-black/35' : 'text-white/30'
          }`}
        >
          Powered by FramEvents
        </p>
      </div>
    </main>
  )
}