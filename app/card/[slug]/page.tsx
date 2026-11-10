import { createClient } from '@supabase/supabase-js'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SITE_URL = 'https://www.framevents.fr'

type VisitCard = {
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
  show_phone: boolean | null
  show_email: boolean | null
  show_address: boolean | null
  show_website: boolean | null
  show_linkedin: boolean | null
  show_instagram: boolean | null
  show_facebook: boolean | null
  show_whatsapp: boolean | null
  published: boolean | null
}

function normalizeUrl(value: string) {
  const clean = value.trim()
  if (!clean) return '#'
  if (/^https?:\/\//i.test(clean)) return clean
  return `https://${clean}`
}

function displayWebsite(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '')
}

function whatsappUrl(value: string | null) {
  if (!value) return null
  const number = value.replace(/[^\d+]/g, '').replace(/^\+/, '')
  return number ? `https://wa.me/${number}` : null
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 4.5 8 4l2 5-2.2 1.5a15 15 0 0 0 5.7 5.7L15 14l5 2-.5 2.5A2 2 0 0 1 17.5 20C10 19.2 4.8 14 4 6.5a2 2 0 0 1 1.5-2Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" d="M10 13.5 8.5 15a4 4 0 0 1-5.7-5.7l3-3A4 4 0 0 1 11.5 6" />
      <path strokeLinecap="round" d="m14 10.5 1.5-1.5a4 4 0 1 1 5.7 5.7l-3 3a4 4 0 0 1-5.7.3" />
      <path strokeLinecap="round" d="m8.5 15.5 7-7" />
    </svg>
  )
}

function ContactTile({
  href,
  title,
  value,
  icon,
  accent,
  primary = false,
  isClassic = false,
}: {
  href: string
  title: string
  value: string
  icon: ReactNode
  accent: string
  primary?: boolean
  isClassic?: boolean
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`group relative flex min-h-[82px] items-center overflow-hidden rounded-[22px] border px-5 py-4 transition ${
        primary
          ? 'text-black shadow-[0_8px_30px_rgba(0,0,0,0.16)]'
          : isClassic
            ? 'border-black/10 bg-black/[0.035] text-black hover:bg-black/[0.06]'
            : 'border-white/10 bg-white/[0.045] text-white hover:bg-white/[0.075]'
      }`}
      style={
        primary
          ? {
              background: `linear-gradient(115deg, ${accent} 0%, ${accent}e8 58%, ${accent}b8 100%)`,
              borderColor: `${accent}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.40), inset 0 -12px 30px rgba(0,0,0,.08), 0 8px 28px ${accent}22`,
            }
          : !isClassic
            ? {
                background: `linear-gradient(115deg, rgba(255,255,255,.075) 0%, rgba(255,255,255,.025) 48%, ${accent}0b 100%)`,
                borderColor: `${accent}38`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,.09), 0 0 0 1px ${accent}12, 0 12px 28px rgba(0,0,0,.24)`,
              }
            : undefined
      }
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: primary
            ? 'linear-gradient(115deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,.08) 28%, transparent 48%, rgba(255,255,255,.08) 72%, transparent 100%)'
            : `linear-gradient(115deg, rgba(255,255,255,.12) 0%, transparent 30%, ${accent}12 70%, transparent 100%)`,
        }}
      />

      <div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-r pr-4 ${
          primary
            ? 'border-black/20'
            : isClassic
              ? 'border-black/10'
              : 'border-white/10'
        }`}
        style={!primary ? { color: accent } : undefined}
      >
        {icon}
      </div>

      <div className="relative z-10 min-w-0 pl-5 text-left">
        <div
          className={`text-[11px] font-semibold uppercase tracking-[2.5px] ${
            primary
              ? 'text-black/60'
              : isClassic
                ? 'text-black/45'
                : 'text-white/45'
          }`}
        >
          {title}
        </div>

        <div className="mt-1 truncate text-[17px] font-semibold sm:text-[18px]">
          {value}
        </div>
      </div>
    </a>
  )
}

function SocialButton({
  href,
  label,
  isClassic,
}: {
  href: string
  label: string
  isClassic: boolean
}) {
  return (
    <a
      href={normalizeUrl(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-[48px] items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        isClassic
          ? 'border-black/10 bg-black/[0.035] text-black/75 hover:bg-black/[0.06]'
          : 'border-white/10 bg-white/[0.045] text-white/75 hover:bg-white/[0.075]'
      }`}
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

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

  const { data: card } = await supabase
    .from('visit_cards')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle<VisitCard>()

  if (!card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Carte indisponible</h1>
          <p className="mt-3 text-white/50">
            Cette Visit Card n’est pas disponible.
          </p>
        </div>
      </main>
    )
  }

  const accent =
    card.brand_color &&
    /^#[0-9a-fA-F]{6}$/.test(card.brand_color)
      ? card.brand_color
      : '#d6a85f'

  const fullName =
    [card.first_name, card.last_name]
      .filter(Boolean)
      .join(' ') ||
    card.company ||
    'Visit Card'

  const initials =
    [card.first_name, card.last_name]
      .filter(Boolean)
      .map((value) => String(value).charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VC'

  const isClassic = card.theme === 'classic'

  const cardUrl =
    `${SITE_URL}/card/${encodeURIComponent(card.slug)}`

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(cardUrl)}`

  const whatsappHref = whatsappUrl(card.whatsapp)

  const mainImage = card.photo_url || card.logo_url

  return (
    <main
      className={`relative min-h-screen overflow-hidden px-4 py-8 sm:py-12 ${
        isClassic
          ? 'bg-[#f4f2ed] text-black'
          : 'bg-black text-white'
      }`}
    >
      {!isClassic && (
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-[220px] -top-[190px] h-[560px] w-[560px] rounded-full blur-[105px]"
            style={{
              background: `radial-gradient(circle, ${accent}66 0%, ${accent}24 32%, transparent 72%)`,
            }}
          />

          <div
            className="absolute -bottom-[230px] -right-[220px] h-[600px] w-[600px] rounded-full blur-[115px]"
            style={{
              background: `radial-gradient(circle, ${accent}55 0%, ${accent}1f 34%, transparent 72%)`,
            }}
          />

          <div
            className="absolute -left-24 top-10 h-[2px] w-[460px] -rotate-[25deg]"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 30px 8px ${accent}55`,
              opacity: 0.45,
            }}
          />

          <div
            className="absolute -right-28 bottom-20 h-[2px] w-[460px] -rotate-[25deg]"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 34px 9px ${accent}44`,
              opacity: 0.35,
            }}
          />
        </div>
      )}

      <div
        className={`relative z-10 mx-auto max-w-[620px] overflow-hidden rounded-[38px] border px-6 py-8 shadow-2xl sm:px-9 sm:py-10 ${
          isClassic
            ? 'border-black/10 bg-white'
            : 'border-white/15 bg-[#0c0c0c]'
        }`}
        style={{
          boxShadow: isClassic
            ? undefined
            : `0 0 0 1px ${accent}38, 0 28px 85px rgba(0,0,0,.60), 0 0 65px ${accent}18`,
          background: isClassic
            ? undefined
            : `
                radial-gradient(circle at 50% 2%, ${accent}2b 0%, ${accent}10 16%, transparent 30%),
                radial-gradient(circle at 3% 40%, ${accent}10 0%, transparent 24%),
                radial-gradient(circle at 97% 72%, ${accent}12 0%, transparent 24%),
                linear-gradient(135deg, rgba(255,255,255,.070) 0%, rgba(255,255,255,.018) 15%, transparent 28%),
                linear-gradient(315deg, rgba(255,255,255,.055) 0%, transparent 28%),
                #0a0a0a
              `,
        }}
      >
        {!isClassic && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[38px]">
            <div
              className="absolute -top-20 left-1/2 h-[260px] w-[520px] -translate-x-1/2 rounded-full blur-[70px]"
              style={{ backgroundColor: `${accent}28` }}
            />

            <div
              className="absolute -left-32 top-[28%] h-[360px] w-[280px] rounded-full blur-[90px]"
              style={{ backgroundColor: `${accent}12` }}
            />

            <div
              className="absolute -right-28 bottom-[15%] h-[340px] w-[300px] rounded-full blur-[95px]"
              style={{ backgroundColor: `${accent}16` }}
            />

            <div
              className="absolute -left-[18%] top-[90px] h-[85px] w-[140%] -rotate-[18deg] opacity-60"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.015) 24%, rgba(255,255,255,.085) 48%, rgba(255,255,255,.02) 68%, transparent 100%)',
              }}
            />

            <div
              className="absolute left-[8%] right-[8%] top-[46%] h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}35, transparent)`,
                boxShadow: `0 0 16px ${accent}25`,
              }}
            />

            <div
              className="absolute left-[12%] right-[12%] bottom-[33%] h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}30, transparent)`,
                boxShadow: `0 0 14px ${accent}18`,
              }}
            />
          </div>
        )}

        <div className="relative z-10 text-center">
          <div
            className="mx-auto flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-full border-2"
            style={{
              borderColor: accent,
              boxShadow: isClassic
                ? undefined
                : `0 0 0 1px ${accent}75, 0 0 38px ${accent}38, 0 12px 40px rgba(0,0,0,.55)`,
            }}
          >
            {mainImage ? (
              <img
                src={mainImage}
                alt={fullName}
                className={`h-full w-full ${
                  card.photo_url
                    ? 'object-cover'
                    : 'bg-white object-contain p-3'
                }`}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-black"
                style={{ backgroundColor: accent }}
              >
                {initials}
              </div>
            )}
          </div>

          <h1 className="mt-7 text-[32px] font-bold leading-tight tracking-[-0.8px] sm:text-[38px]">
            {fullName}
          </h1>

          {card.company && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <span
                className="h-px w-10 opacity-50"
                style={{ backgroundColor: accent }}
              />
              <p
                className="text-[15px] font-bold uppercase tracking-[5px]"
                style={{ color: accent }}
              >
                {card.company}
              </p>
              <span
                className="h-px w-10 opacity-50"
                style={{ backgroundColor: accent }}
              />
            </div>
          )}

          {card.job_title && (
            <p
              className={`mt-3 text-[19px] ${
                isClassic ? 'text-black/55' : 'text-white/55'
              }`}
            >
              {card.job_title}
            </p>
          )}

          {card.bio && (
            <p
              className={`mx-auto mt-5 max-w-md text-sm leading-relaxed ${
                isClassic ? 'text-black/55' : 'text-white/50'
              }`}
            >
              {card.bio}
            </p>
          )}
        </div>

        <div className="relative z-10 mt-9 grid gap-3.5">
          {card.show_phone && card.phone && (
            <ContactTile
              href={`tel:${card.phone}`}
              title="Téléphone"
              value={card.phone}
              icon={<PhoneIcon />}
              accent={accent}
              primary
              isClassic={isClassic}
            />
          )}

          {card.show_email && card.email && (
            <ContactTile
              href={`mailto:${card.email}`}
              title="E-mail"
              value={card.email}
              icon={<MailIcon />}
              accent={accent}
              isClassic={isClassic}
            />
          )}

          {card.show_website && card.website && (
            <ContactTile
              href={normalizeUrl(card.website)}
              title="Site web"
              value={displayWebsite(card.website)}
              icon={<LinkIcon />}
              accent={accent}
              isClassic={isClassic}
            />
          )}
        </div>

        {(card.linkedin ||
          card.instagram ||
          card.facebook ||
          whatsappHref) && (
          <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
            {card.show_linkedin && card.linkedin && (
              <SocialButton
                href={card.linkedin}
                label="LinkedIn"
                isClassic={isClassic}
              />
            )}

            {card.show_instagram && card.instagram && (
              <SocialButton
                href={card.instagram}
                label="Instagram"
                isClassic={isClassic}
              />
            )}

            {card.show_facebook && card.facebook && (
              <SocialButton
                href={card.facebook}
                label="Facebook"
                isClassic={isClassic}
              />
            )}

            {card.show_whatsapp && whatsappHref && (
              <SocialButton
                href={whatsappHref}
                label="WhatsApp"
                isClassic={isClassic}
              />
            )}
          </div>
        )}

        {card.show_address && card.address && (
          <div
            className={`mt-5 rounded-[22px] border p-5 text-center ${
              isClassic
                ? 'border-black/10 bg-black/[0.025]'
                : 'border-white/10 bg-white/[0.035]'
            }`}
          >
            <div
              className={`text-sm ${
                isClassic ? 'text-black/65' : 'text-white/65'
              }`}
            >
              📍 {card.address}
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold"
              style={{ color: accent }}
            >
              Voir sur la carte →
            </a>
          </div>
        )}

        <div
          className={`relative z-10 mt-9 border-t pt-8 ${
            isClassic ? 'border-black/10' : 'border-white/10'
          }`}
        >
          <p
            className={`text-center text-[12px] font-semibold uppercase tracking-[5px] ${
              isClassic ? 'text-black/35' : 'text-white/35'
            }`}
          >
            Partager cette carte
          </p>

          <a
            href={`/card/${card.slug}/contact.vcf`}
            className="mx-auto mt-6 flex min-h-[60px] max-w-[420px] items-center justify-center gap-3 rounded-full px-6 text-base font-bold text-black shadow-lg transition hover:brightness-110"
            style={{
              background: `linear-gradient(115deg, ${accent} 0%, ${accent}e5 60%, ${accent}bd 100%)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.40), 0 10px 35px ${accent}25`,
            }}
          >
            <span className="text-2xl font-light">＋</span>
            Ajouter aux contacts
          </a>

          <div
            className={`mx-auto mt-7 w-fit rounded-[28px] border p-4 ${
              isClassic
                ? 'border-black/10 bg-white'
                : 'border-white/10 bg-[#111111]'
            }`}
            style={
              isClassic
                ? undefined
                : {
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,.08), 0 0 0 1px ${accent}18, 0 12px 38px ${accent}16`,
                    background: `linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.015))`,
                  }
            }
          >
            <img
              src={qrUrl}
              alt={`QR code ${fullName}`}
              width={250}
              height={250}
              className="h-[220px] w-[220px] rounded-2xl bg-white sm:h-[240px] sm:w-[240px]"
            />
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-7 text-center text-sm text-white/25">
        Powered by FramEvents
      </p>
    </main>
  )
}
