'use client'

import { useEffect, useState } from 'react'

type SectionId = 'events' | 'seances' | 'qr' | 'contact'

export default function SectionNav({
  instagramUrl,
  variant,
}: {
  instagramUrl: string
  variant: 'desktop' | 'mobile'
}) {
  const [active, setActive] = useState<SectionId>('events')
  const [hovered, setHovered] = useState<SectionId | 'instagram' | null>(null)

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace('#', '')

      if (
        hash === 'events' ||
        hash === 'seances' ||
        hash === 'qr' ||
        hash === 'contact'
      ) {
        setActive(hash)
      }
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)

    return () => {
      window.removeEventListener('hashchange', syncHash)
    }
  }, [])

  const choose = (id: SectionId) => {
    setActive(id)
  }

  if (variant === 'desktop') {
    const desktopClass = (id: SectionId) =>
      (hovered ?? active) === id
        ? 'rounded-full border border-[#d6a85f] bg-[#d6a85f] px-6 py-3 text-sm font-medium text-black backdrop-blur-xl transition'
        : 'rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-xl transition'

    const instagramClass =
      hovered === 'instagram'
        ? 'rounded-full border border-[#d6a85f] bg-[#d6a85f] px-6 py-3 text-sm font-medium text-black backdrop-blur-xl transition'
        : 'rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur-xl transition'

    return (
      <div className="hidden items-center gap-3 md:flex">
        <a
          href="#events"
          onClick={() => choose('events')}
          onMouseEnter={() => setHovered('events')}
          onMouseLeave={() => setHovered(null)}
          className={desktopClass('events')}
        >
          Galeries
        </a>

        <a
          href="#seances"
          onClick={() => choose('seances')}
          onMouseEnter={() => setHovered('seances')}
          onMouseLeave={() => setHovered(null)}
          className={desktopClass('seances')}
        >
          Séances
        </a>

        <a
          href="#qr"
          onClick={() => choose('qr')}
          onMouseEnter={() => setHovered('qr')}
          onMouseLeave={() => setHovered(null)}
          className={desktopClass('qr')}
        >
          QR Code
        </a>

        <a
          href="#contact"
          onClick={() => choose('contact')}
          onMouseEnter={() => setHovered('contact')}
          onMouseLeave={() => setHovered(null)}
          className={desktopClass('contact')}
        >
          Contact
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered('instagram')}
          onMouseLeave={() => setHovered(null)}
          className={instagramClass}
        >
          Instagram
        </a>
      </div>
    )
  }

  const mobileClass = (id: SectionId) =>
    active === id
      ? 'rounded-[24px] border border-[#d6a85f]/70 bg-[#d6a85f]/15 px-2 py-3 text-[#d6a85f] shadow-[0_0_24px_rgba(214,168,95,0.12)] transition'
      : 'rounded-[24px] border border-transparent px-2 py-3 text-white/75 transition'

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 rounded-[32px] border border-white/15 bg-black/78 px-3 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-5 gap-1 text-center">
        <a
          href="#events"
          onClick={() => choose('events')}
          className={mobileClass('events')}
        >
          <span className="block text-xl leading-none">▧</span>
          <span className="mt-1 block text-[11px] font-medium">Galeries</span>
        </a>

        <a
          href="#seances"
          onClick={() => choose('seances')}
          className={mobileClass('seances')}
        >
          <span className="block text-xl leading-none">◌</span>
          <span className="mt-1 block text-[11px] font-medium">Séances</span>
        </a>

        <a
          href="#qr"
          onClick={() => choose('qr')}
          className={mobileClass('qr')}
        >
          <span className="block text-xl leading-none">⌗</span>
          <span className="mt-1 block text-[11px] font-medium">QR</span>
        </a>

        <a
          href="#contact"
          onClick={() => choose('contact')}
          className={mobileClass('contact')}
        >
          <span className="block text-xl leading-none">✉</span>
          <span className="mt-1 block text-[11px] font-medium">Contact</span>
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[24px] border border-transparent px-2 py-3 text-white/75 transition"
        >
          <span className="block text-xl leading-none">◎</span>
          <span className="mt-1 block text-[11px] font-medium">Instagram</span>
        </a>
      </div>
    </nav>
  )
}
