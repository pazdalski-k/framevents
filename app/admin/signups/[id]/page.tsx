import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default async function EventSignupsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventId = Number(id)

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  const { data: signups, error } = await supabase
    .from('event_notifications')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('SIGNUPS LOAD ERROR:', error)
  }

  return (
    <main className="bg-black text-white min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin"
          className="inline-block mb-8 text-white/50 hover:text-white transition"
        >
          ← Back to admin
        </Link>

        <p className="uppercase tracking-[5px] text-white/40 text-sm mb-4">
          Email Signups
        </p>

        <h1 className="text-5xl font-bold mb-4">
          {event?.title || `Event ID ${eventId}`}
        </h1>

        <p className="text-white/50 mb-10">
          Total signups: {signups?.length || 0}
        </p>

        <div className="border border-white/10 rounded-3xl overflow-hidden bg-white/[0.03]">
          {(signups || []).length === 0 ? (
            <div className="p-8 text-white/50">
              No email signups yet.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {(signups || []).map((signup) => (
                <div
                  key={signup.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="text-lg font-medium">
                      {signup.email}
                    </p>

                    <p className="text-white/40 text-sm mt-1">
                      Saved: {new Date(signup.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <p
                    className={`text-sm ${
                      signup.notified ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {signup.notified ? 'Notified' : 'Waiting'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}