import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getVisitCardMeta } from './_meta'

const SITE_URL = 'https://www.framevents.fr'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const card = await getVisitCardMeta(slug)

  if (!card) {
    return {
      title: 'Visit Card | FramEvents',
      description: 'Carte de visite numérique.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const fullName =
    [card.first_name, card.last_name].filter(Boolean).join(' ') ||
    card.company ||
    'Visit Card'

  const title =
    card.company && card.company !== fullName
      ? `${fullName} — ${card.company}`
      : fullName

  const description =
    [card.job_title, card.company, card.bio]
      .filter(Boolean)
      .join(' · ')
      .slice(0, 180) ||
    `Carte de visite numérique de ${fullName}.`

  const cardUrl = `${SITE_URL}/card/${encodeURIComponent(slug)}`

  return {
    title,
    description,

    alternates: {
      canonical: cardUrl,
    },

    openGraph: {
      title,
      description,
      url: cardUrl,
      siteName: 'FramEvents',
      locale: 'fr_FR',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function VisitCardLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
