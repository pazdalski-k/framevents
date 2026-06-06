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

    <div className="max-w-5xl mx-auto px-8 py-4">
      <Link
        href="/"
        className="text-white/70 hover:text-white"
      >
        ← Back to events
      </Link>
    </div>

    <div className="relative h-[85vh] overflow-hidden">

  <img
    src={event.image_url}
    alt={event.title}
    className="absolute inset-0 w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

  <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-8 pb-20">

    <p className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl text-xs uppercase tracking-widest">
      {event.category}
    </p>

    <h1 className="text-6xl md:text-8xl font-bold mt-6">
      {event.title}
    </h1>

    <div className="flex flex-wrap gap-8 mt-8 text-xl text-white/70">

      <p>📍 {event.location}</p>

      <p>📅 {event.date}</p>

      {photos && photos.length > 0 && (
  <p>📸 {photos.length} Photos</p>
)}

    </div>

  </div>

</div>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="uppercase text-white/50">
          {event.category}
        </p>
<div className="flex gap-4 mt-6">

  <button className="bg-white text-black px-8 py-4 rounded-full font-semibold">
    Browse Photos
  </button>

  <button className="border border-white/20 px-8 py-4 rounded-full font-semibold">
    Download Gallery
  </button>

</div>
        

        <p className="text-2xl text-white/80 mt-6 leading-relaxed max-w-4xl">
          {event.description}
        </p>

        <div className="mt-20">
  <h2 className="text-5xl font-bold mb-12">
    Event Photos
  </h2>
<div className="columns-1 md:columns-2 gap-8 space-y-8">
  {photos?.map((photo) => (
    <img
  key={photo.id}
  src={photo.image_url}
  alt=""
  className="w-full mb-8 rounded-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
/>
  ))}
</div>
  </div>

      </div>
    </main>
  )
}