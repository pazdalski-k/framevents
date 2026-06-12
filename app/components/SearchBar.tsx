'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [search, setSearch] = useState('')

  return (
    <input
      type="text"
      placeholder="Search events..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full max-w-xl mx-auto block bg-[#111111] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
    />
  )
}