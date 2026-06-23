import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white">
          ← Back to FramEvents
        </Link>

        <h1 className="text-5xl font-bold mt-10 mb-8">
          Privacy Policy / Politique de confidentialité
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
              FramEvents collecte uniquement les données nécessaires au fonctionnement
              du service : consultation des galeries, achat de photographies, paiement,
              téléchargement des fichiers et contact client.
            </p>
            <p className="mt-4">
              Les données peuvent inclure : adresse e-mail, informations de commande,
              identifiant de paiement Stripe, photographies d’événements, messages de
              contact et données techniques de navigation.
            </p>
            <p className="mt-4">
              Les paiements sont traités par Stripe. FramEvents ne stocke pas les numéros
              complets de carte bancaire.
            </p>
            <p className="mt-4">
              Les photographies publiées sur FramEvents peuvent représenter des personnes
              présentes lors d’événements publics ou privés. Toute personne souhaitant
              demander le retrait d’une image peut contacter FramEvents.
            </p>
            <p className="mt-4">
              Conformément au RGPD, vous pouvez demander l’accès, la rectification,
              l’effacement ou la limitation du traitement de vos données.
            </p>
            <p className="mt-4">
              Contact : contact@framevents.fr
            </p>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              🇵🇱 Polski
            </h2>
            <p>
              FramEvents zbiera tylko dane potrzebne do działania serwisu:
              przeglądania galerii, zakupu zdjęć, płatności, pobierania plików
              oraz kontaktu z klientem.
            </p>
            <p className="mt-4">
              Dane mogą obejmować: adres e-mail, informacje o zamówieniu,
              identyfikator płatności Stripe, zdjęcia z wydarzeń, wiadomości
              kontaktowe oraz techniczne dane przeglądania.
            </p>
            <p className="mt-4">
              Płatności obsługuje Stripe. FramEvents nie przechowuje pełnych
              numerów kart płatniczych.
            </p>
            <p className="mt-4">
              Zdjęcia publikowane w FramEvents mogą przedstawiać osoby obecne
              podczas wydarzeń publicznych lub prywatnych. Osoba, która chce
              zgłosić usunięcie zdjęcia, może skontaktować się z FramEvents.
            </p>
            <p className="mt-4">
              Zgodnie z RODO możesz poprosić o dostęp, poprawienie, usunięcie
              lub ograniczenie przetwarzania swoich danych.
            </p>
            <p className="mt-4">
              Kontakt: contact@framevents.fr
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}