import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-16 text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-white"
        >
          ← Retour à FramEvents
        </Link>

        <header className="mt-10 border-b border-white/10 pb-10">
          <p className="text-xs uppercase tracking-[5px] text-[#d6a85f]">
            Protection des données
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Politique de confidentialité
          </h1>

          <p className="mt-5 text-sm text-white/50">
            Dernière mise à jour : 26 juillet 2026
          </p>

          <p className="mt-7 max-w-3xl leading-relaxed text-white/70">
            La présente politique explique comment FramEvents collecte, utilise,
            conserve et protège les données personnelles dans le cadre de la
            consultation des galeries, de l’achat de photographies, du paiement,
            du téléchargement des fichiers et des échanges avec les utilisateurs.
          </p>
        </header>

        <div className="space-y-12 py-12 leading-relaxed text-white/70">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Responsable du traitement
            </h2>

            <div className="mt-4 space-y-2">
              <p>
                Le responsable du traitement est Krzysztof Pazdalski,
                exploitant du site et du service FramEvents, établi en France.
              </p>

              <p>
                Contact :{' '}
                <a
                  href="mailto:contact@framevents.fr"
                  className="text-[#d6a85f] underline-offset-4 hover:underline"
                >
                  contact@framevents.fr
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Données traitées
            </h2>

            <p className="mt-4">
              Selon l’utilisation du site, FramEvents peut traiter les catégories
              de données suivantes :
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>adresse e-mail et informations de contact ;</li>
              <li>informations relatives aux commandes et téléchargements ;</li>
              <li>
                références, statut et identifiants techniques de paiement transmis
                par Stripe ;
              </li>
              <li>photographies prises lors d’événements ou de séances privées ;</li>
              <li>messages adressés au service client ;</li>
              <li>
                données techniques nécessaires au fonctionnement et à la sécurité
                du site, notamment adresse IP, navigateur, appareil, journaux
                techniques et cookies nécessaires.
              </li>
            </ul>

            <p className="mt-4">
              FramEvents ne reçoit ni ne conserve les numéros complets de cartes
              bancaires.
            </p>

            <p className="mt-4">
              Les données peuvent être fournies directement par l’utilisateur,
              générées lors d’une commande ou recueillies lors de la réalisation
              d’un reportage photographique.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Finalités et bases juridiques
            </h2>

            <p className="mt-4">
              Les données sont traitées pour les objectifs et sur les bases
              juridiques suivants :
            </p>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                gestion des commandes, paiements et téléchargements : exécution
                du contrat conclu avec le client ;
              </li>
              <li>
                gestion de la facturation et des obligations comptables ou
                fiscales : respect des obligations légales ;
              </li>
              <li>
                sécurité du site, prévention des abus et de la fraude : intérêt
                légitime de FramEvents ;
              </li>
              <li>
                réponse aux demandes du service client et gestion des
                contestations : exécution du contrat ou intérêt légitime ;
              </li>
              <li>
                envoi de communications facultatives ou utilisation de traceurs
                non nécessaires : consentement, lorsqu’il est requis ;
              </li>
              <li>
                traitement et publication des photographies : selon le contexte,
                exécution d’un contrat, consentement ou intérêt légitime, dans le
                respect du droit à l’image et de la réglementation applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Données obligatoires ou facultatives
            </h2>

            <p className="mt-4">
              L’adresse e-mail et les informations nécessaires au paiement sont
              obligatoires pour effectuer une commande et recevoir les liens de
              téléchargement. Sans ces informations, FramEvents ne pourra pas
              exécuter la commande.
            </p>

            <p className="mt-4">
              Les informations communiquées dans un message de contact sont
              facultatives, mais certaines peuvent être nécessaires pour répondre
              précisément à la demande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Photographies et droit à l’image
            </h2>

            <p className="mt-4">
              Les galeries peuvent contenir des photographies de personnes
              présentes lors d’événements publics ou privés ou participant à des
              séances photographiques.
            </p>

            <p className="mt-4">
              Toute personne reconnaissable peut demander des informations,
              signaler une photographie ou solliciter son retrait en écrivant à{' '}
              <a
                href="mailto:contact@framevents.fr"
                className="text-[#d6a85f] underline-offset-4 hover:underline"
              >
                contact@framevents.fr
              </a>
              .
            </p>

            <p className="mt-4">
              La demande doit indiquer, dans la mesure du possible, la galerie,
              l’événement et la photographie concernés. Une vérification
              raisonnable de l’identité du demandeur peut être effectuée afin
              d’éviter les demandes frauduleuses ou les suppressions injustifiées.
            </p>

            <p className="mt-4">
              Chaque demande est examinée en fonction de son contexte, des droits
              de la personne concernée, des obligations contractuelles et des
              éventuelles obligations légales de conservation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              6. Prestataires et destinataires
            </h2>

            <p className="mt-4">
              Les données sont accessibles uniquement à FramEvents et aux
              prestataires ou partenaires techniques qui en ont besoin pour
              fournir leurs services, notamment :
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Stripe pour le traitement sécurisé des paiements ;</li>
              <li>Supabase pour les bases de données et le stockage des fichiers ;</li>
              <li>Vercel pour l’hébergement et le fonctionnement du site ;</li>
              <li>Resend pour l’envoi des e-mails transactionnels.</li>
            </ul>

            <p className="mt-4">
              Ces destinataires accèdent uniquement aux données nécessaires à
              leurs missions et conformément à leurs obligations contractuelles
              et réglementaires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              7. Transferts hors de l’Espace économique européen
            </h2>

            <p className="mt-4">
              Certains prestataires peuvent traiter ou rendre accessibles des
              données depuis des pays situés hors de l’Espace économique européen.
              Lorsque de tels transferts ont lieu, ils doivent être encadrés par
              les mécanismes reconnus par le RGPD, notamment une décision
              d’adéquation ou des clauses contractuelles types approuvées par la
              Commission européenne.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              8. Durées de conservation
            </h2>

            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                les documents comptables, factures et pièces justificatives
                peuvent être conservés pendant dix ans conformément aux
                obligations légales applicables ;
              </li>
              <li>
                les données nécessaires à une commande sont conservées pendant la
                durée nécessaire à son exécution, au service après-vente et à la
                gestion des éventuelles réclamations ;
              </li>
              <li>
                les messages de contact sont conservés pendant la durée nécessaire
                au traitement de la demande puis, si nécessaire, pendant la durée
                utile à la constatation, à l’exercice ou à la défense de droits ;
              </li>
              <li>
                les journaux techniques sont conservés pendant une durée limitée
                et proportionnée aux besoins de sécurité ;
              </li>
              <li>
                la durée de mise en ligne des photographies dépend de la galerie
                et de l’événement concernés. Des copies peuvent être conservées
                hors ligne pendant la durée nécessaire à la livraison, au support,
                à l’archivage contractuel ou à la défense des droits de FramEvents.
              </li>
            </ul>

            <p className="mt-4">
              Les données qui ne sont plus nécessaires sont supprimées,
              anonymisées ou placées dans un archivage à accès restreint lorsqu’une
              conservation reste légalement justifiée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              9. Cookies et stockage local
            </h2>

            <p className="mt-4">
              Le site peut utiliser des cookies ou mécanismes de stockage
              strictement nécessaires au panier, à la connexion de
              l’administration, à la sécurité, au paiement et au fonctionnement
              technique du service.
            </p>

            <p className="mt-4">
              Les traceurs non strictement nécessaires, notamment publicitaires
              ou destinés à un suivi externe, ne doivent être activés qu’après
              recueil du consentement lorsque celui-ci est requis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              10. Sécurité
            </h2>

            <p className="mt-4">
              FramEvents met en œuvre des mesures techniques et organisationnelles
              raisonnables destinées à protéger les données contre l’accès non
              autorisé, la perte, l’altération ou la divulgation.
            </p>

            <p className="mt-4">
              Malgré ces mesures, aucun système informatique ou moyen de
              transmission ne peut garantir une sécurité absolue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              11. Droits des personnes
            </h2>

            <p className="mt-4">
              Dans les conditions prévues par le RGPD et la loi Informatique et
              Libertés, toute personne concernée peut demander :
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>l’accès à ses données personnelles ;</li>
              <li>la rectification de données inexactes ;</li>
              <li>l’effacement de ses données lorsque ce droit est applicable ;</li>
              <li>la limitation du traitement ;</li>
              <li>la portabilité des données lorsque ce droit est applicable ;</li>
              <li>l’opposition à certains traitements ;</li>
              <li>
                le retrait de son consentement, sans remettre en cause les
                traitements effectués avant ce retrait.
              </li>
            </ul>

            <p className="mt-4">
              Les demandes doivent être adressées à{' '}
              <a
                href="mailto:contact@framevents.fr"
                className="text-[#d6a85f] underline-offset-4 hover:underline"
              >
                contact@framevents.fr
              </a>
              .
            </p>

            <p className="mt-4">
              Un justificatif d’identité peut être demandé uniquement lorsque cela
              est nécessaire pour vérifier l’identité du demandeur.
            </p>

            <p className="mt-4">
              Toute personne peut également introduire une réclamation auprès de
              la Commission nationale de l’informatique et des libertés —{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noreferrer"
                className="text-[#d6a85f] underline-offset-4 hover:underline"
              >
                CNIL
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              12. Décision automatisée
            </h2>

            <p className="mt-4">
              FramEvents ne prend aucune décision produisant des effets juridiques
              sur un utilisateur sur la seule base d’un traitement entièrement
              automatisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              13. Modification de la politique
            </h2>

            <p className="mt-4">
              Cette politique peut être mise à jour pour tenir compte des
              évolutions du service, des prestataires utilisés ou de la
              réglementation. La date de la dernière modification est indiquée en
              haut de la page.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
