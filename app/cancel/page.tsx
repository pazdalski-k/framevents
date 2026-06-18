export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-8">
          Paiement annulé
        </h1>

        <p className="text-white/70 text-xl mb-10">
          Aucun paiement n’a été effectué.
        </p>

        <a
          href="/"
          className="inline-block border border-white/20 px-8 py-4 rounded-full font-semibold"
        >
          Retour à FramEvent
        </a>
      </div>
    </main>
  )
}