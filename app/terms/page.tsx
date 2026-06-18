import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white">
          ← Back to FramEvent
        </Link>

        <h1 className="text-5xl font-bold mt-10 mb-8">
          Terms & Conditions / Conditions générales de vente
        </h1>

        <p className="text-white/60 mb-10">
          Last updated: 18 June 2026
        </p>

        <section className="space-y-8 text-white/75 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              🇫🇷 Français
            </h2>
            <p>
              FramEvent est un service de photographie événementielle permettant
              l’achat et le téléchargement de photographies numériques.
            </p>
            <p className="mt-4">
              Les prix sont indiqués en euros toutes taxes applicables comprises,
              sauf indication contraire. Le paiement est effectué en ligne via Stripe.
            </p>
            <p className="mt-4">
              Après validation du paiement, le client reçoit l’accès au téléchargement
              des photographies achetées.
            </p>
            <p className="mt-4">
              Les fichiers numériques téléchargés ne peuvent pas être retournés comme
              un produit physique. Lorsque le téléchargement commence après accord du
              client, le droit de rétractation peut ne plus s’appliquer conformément
              aux règles relatives aux contenus numériques.
            </p>
            <p className="mt-4">
              L’achat d’une photographie donne au client un droit d’usage personnel.
              Les droits d’auteur restent la propriété du photographe, sauf accord
              écrit spécifique.
            </p>
            <p className="mt-4">
              Toute demande concernant une image, un retrait, une erreur de commande
              ou une question juridique peut être envoyée à : contact@framevent.fr
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              🇵🇱 Polski
            </h2>
            <p>
              FramEvent to serwis fotografii eventowej umożliwiający zakup
              i pobieranie zdjęć cyfrowych.
            </p>
            <p className="mt-4">
              Ceny podane są w euro i obejmują obowiązujące podatki, chyba że
              wskazano inaczej. Płatność odbywa się online przez Stripe.
            </p>
            <p className="mt-4">
              Po potwierdzeniu płatności klient otrzymuje dostęp do pobrania
              zakupionych zdjęć.
            </p>
            <p className="mt-4">
              Pliki cyfrowe po rozpoczęciu pobierania nie są zwracane jak produkt
              fizyczny. Po rozpoczęciu pobierania, za zgodą klienta, prawo odstąpienia
              od umowy może nie mieć zastosowania zgodnie z zasadami dotyczącymi
              treści cyfrowych.
            </p>
            <p className="mt-4">
              Zakup zdjęcia daje klientowi prawo do użytku osobistego. Prawa autorskie
              pozostają własnością fotografa, chyba że osobna pisemna umowa stanowi
              inaczej.
            </p>
            <p className="mt-4">
              W sprawie zdjęcia, usunięcia fotografii, błędu zamówienia lub pytań
              prawnych można pisać na: contact@framevent.fr
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}