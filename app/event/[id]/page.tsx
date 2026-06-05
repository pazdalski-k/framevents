import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

    const { data: photos } = await supabase
  .from('photos')
  .select('*')
  .eq('event_id', id)

console.log('PHOTOS:', photos)

  if (!event) {
    return <div>Event not found</div>
  }

  return (
  <main className="bg-black text-white min-h-screen">

    <div className="max-w-5xl mx-auto px-8 pt-8">
      <Link
        href="/"
        className="text-white/70 hover:text-white"
      >
        ← Back to events
      </Link>
    </div>

    <div className="max-w-7xl mx-auto px-8 pt-8">
  <img
    src={event.image_url}
    alt={event.title}
    className="w-full h-[70vh] object-cover rounded-3xl"
  />
</div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <p className="uppercase text-white/50">
          {event.category}
        </p>

        <h1 className="text-5xl md:text-7xl font-bold mt-4">
          {event.title}
        </h1>

        <p className="text-xl text-white/70 mt-6">
          {event.location}
        </p>

        <p className="text-xl text-white/70 mt-2">
          {event.date}
        </p>

        <p className="text-2xl text-white/80 mt-10 leading-relaxed">
          {event.description}
        </p>
        <div className="mt-20">
  <h2 className="text-4xl font-bold mb-8">
    Event Photos
  </h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {photos?.map((photo) => (
    <img
      key={photo.id}
      src={photo.image_url}
      alt=""
      className="w-full h-[350px] object-cover rounded-2xl hover:scale-105 transition duration-300 cursor-pointer"
    />
  ))}
</div>
  </div>

      </div>
    </main>
  )
}