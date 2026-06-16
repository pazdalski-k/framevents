'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
      }),
    })

    const data = await response.json()

    setLoading(false)

    if (!data.success) {
      setError('Wrong password')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const next = params.get('next') || '/admin'

    window.location.href = next
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form
        onSubmit={login}
        className="w-full max-w-md border border-white/10 bg-white/[0.03] rounded-3xl p-8"
      >
        <p className="uppercase tracking-[5px] text-white/40 text-xs mb-4">
          FramEvent Admin
        </p>

        <h1 className="text-4xl font-bold mb-8">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white text-lg"
        />

        {error && (
          <p className="text-red-400 text-sm mt-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 px-8 py-5 rounded-2xl bg-white text-black font-bold disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>
    </main>
  )
}