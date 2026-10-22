# TASKS.md : tâches ordonnées

Règles :
- Une tâche à la fois, dans l'ordre, sauf indication contraire.
- On coche (`[x]`) seulement quand la « définition de terminé » de `AGENTS.md` est remplie.
- Une tâche = quelques heures de travail au maximum. Si elle déborde, on la découpe.
- Les tâches `SPIKE` sont des essais courts pour lever un risque ; leur résultat est noté dans le fichier, sous la tâche.

Légende : ⛓ = dépend d'une tâche précédente.

---

## Phase 0 : Mise en place

- [x] **T-001** Créer le dépôt Git et le projet Next.js (App Router, TypeScript strict, Tailwind, ESLint). Ajouter `.gitignore` (avec `.env.local`) et le premier commit contenant README, AGENTS et docs.
- [ ] **T-002** ⛓T-001 Ajouter les scripts `lint`, `typecheck`, `test` (Vitest) et une CI GitHub Actions qui les exécute avec `build`.
- [ ] **T-003** ⛓T-001 Configurer les **tokens** de `docs/DESIGN.md` dans Tailwind (couleurs, rayons, espacements, échelle de texte) et la police via `next/font` avec chiffres tabulaires.
- [ ] **T-004** ⛓T-001 Créer `src/lib/i18n/fr.ts` (structure + premiers textes) et `.env.example`.
- [ ] **T-005** Créer le projet Supabase et appliquer `supabase/migrations/0001_init.sql` (schéma et RLS de `docs/ARCHITECTURE.md`). Vérifier qu'un utilisateur ne peut lire que ses lignes.
- [ ] **T-006** ⛓T-001 Déployer une première version « vide » sur Vercel (HTTPS) et vérifier le build.

## Phase 1 : Spikes (lever les risques tôt)

- [ ] **T-010 SPIKE** Vérifier les **formats audio** acceptés par Gemini (consulter la documentation à jour) et enregistrer un vocal court depuis Chrome Android et Safari iPhone avec `MediaRecorder`. Noter ici les types MIME produits et le format d'envoi retenu (conversion nécessaire ou non).
- [ ] **T-011 SPIKE** ⛓T-006 Vérifier les **limites de l'hébergeur** (taille du corps, durée d'une fonction) avec un envoi audio de 10 s et de 30 s. Noter la durée maximale d'enregistrement retenue.
- [ ] **T-012 SPIKE** Relire les **conditions** de l'offre gratuite de l'API Gemini et de Vercel (usage, données). Noter les conclusions et les actions avant ouverture à de vrais utilisateurs.

## Phase 2 : Fondations de l'interface

- [ ] **T-020** ⛓T-003 Composants de base dans `components/ui/` : `Button` (48 px), `Card`, `Chip`, `AmountText` (couleur + icône + signe pour ventes et dépenses), `Skeleton`. Page de démonstration temporaire pour les voir.
- [ ] **T-021** ⛓T-020 Layout de l'application : **barre d'onglets en bas** (Accueil, Journal, micro, Bilans, Moi), bouton micro central de 72 px avec ombre, transitions légères, barre fixe pendant les changements d'onglet.
- [ ] **T-022** ⛓T-021 Composant `Sheet` (feuille qui monte du bas) avec geste de fermeture et respect de `prefers-reduced-motion`.
- [ ] **T-023** ⛓T-021 `OfflineBanner` et états de base (écran vide, erreur douce) réutilisables.

## Phase 3 : Comptes et profil

- [ ] **T-030** ⛓T-005 Connexion par **lien magique** (Supabase Auth), page `/login`, protection des routes de l'application.
- [ ] **T-031** ⛓T-030 Création automatique du profil à la première connexion.
- [ ] **T-032** ⛓T-031 **Onboarding** : choix de la langue, type de commerce (cartes illustrées), nom du commerce. Enregistrement dans `profiles`. Durée cible : moins de 60 secondes.

## Phase 4 : Logique métier (fonctions pures testées)

- [ ] **T-040** `lib/money.ts` : `formatFCFA`, `parseAmount`, arrondis entiers. Tests Vitest (milliers, zéro, grands nombres, espace insécable).
- [ ] **T-041** `lib/dates.ts` : début et fin de jour, semaine et mois en fuseau `Africa/Porto-Novo`. Tests aux frontières (minuit, changement de semaine).
- [ ] **T-042** ⛓T-040 `lib/parse-postprocess.ts` : recalcul des totaux, flags `missing_price`, `total_mismatch`, `unusual_amount`. Tests sur les cas listés dans `docs/ARCHITECTURE.md` section 7.
- [ ] **T-043** ⛓T-041 `lib/stats.ts` : totaux de période, série par jour, meilleur jour, top produits, plus grosses dépenses, comparaison à la période précédente, série de jours, détection de doublon. Tests.

## Phase 5 : Capture par texte (premier flux complet)

- [ ] **T-050** ⛓T-040 Client Gemini côté serveur (`lib/gemini.ts`) avec sortie JSON structurée, prompt de `docs/ARCHITECTURE.md`, validation Zod, réessais avec backoff.
- [ ] **T-051** ⛓T-050 ⛓T-042 Route `POST /api/parse` en mode **texte** : session, quota quotidien (`ai_usage_daily`), post-traitement, réponse `ParseResult`. Jamais de clé ni de log sensible.
- [ ] **T-052** ⛓T-022 **Feuille de capture** (texte) : champ « Écris ce que tu as vendu ou dépensé », phrases d'exemple, états de chargement.
- [ ] **T-053** ⛓T-051 ⛓T-052 **Écran de confirmation** : une carte par opération (quantité × prix = total), champs corrigeables avec pavé numérique, champs à vérifier en ambre, glisser pour supprimer, boutons « Valider tout » et « Refaire ». Question de clarification quand une information manque.
- [ ] **T-054** ⛓T-053 Enregistrement des opérations validées dans Supabase (UUID client), animation de validation (coche, carte vers le journal, chiffre du jour qui s'incrémente), annulation possible 5 secondes.
- [ ] **T-055** ⛓T-054 Détection de **doublon probable** et de **montant inhabituel** avec les messages de `docs/DESIGN.md`.

## Phase 6 : Capture vocale

- [ ] **T-060** ⛓T-010 ⛓T-011 `MicButton` (72 px) et enregistrement `MediaRecorder` avec arrêt manuel et arrêt automatique après un silence, durée maximale selon le spike.
- [ ] **T-061** ⛓T-060 `Waveform` : onde sonore en direct pendant l'écoute (animation légère).
- [ ] **T-062** ⛓T-060 Étendre `POST /api/parse` au mode **audio** (taille et durée limitées, transcription puis extraction).
- [ ] **T-063** ⛓T-062 Brancher le vocal sur la feuille de capture : transcription affichée, passage vers la confirmation. Gérer la **permission micro refusée** (aide pas à pas, bascule vers le texte).
- [ ] **T-064** ⛓T-063 Option « **Lire à voix haute** » sur l'écran de confirmation (synthèse vocale du navigateur).
- [ ] **T-065** ⛓T-063 Tester avec 20 phrases réelles de commerçants (français parlé, montants à l'oral). Noter les erreurs dans un fichier `docs/ERREURS-IA.md` et ajuster le prompt.

## Phase 7 : Journal

- [ ] **T-070** ⛓T-054 Page **Journal** : liste groupée par jour avec total par jour, puces de filtre (Aujourd'hui, Semaine, Mois, Ventes, Dépenses), recherche.
- [ ] **T-071** ⛓T-070 Page **détail** d'une opération : modifier, supprimer (suppression douce), historique des modifications (`operation_edits`).
- [ ] **T-072** ⛓T-070 États vide, chargement et erreur du Journal.

## Phase 8 : Accueil

- [ ] **T-080** ⛓T-043 ⛓T-054 **Accueil** : salutation, carte du jour (ventes, dépenses, reste) avec compteurs animés, liste des 5 dernières opérations.
- [ ] **T-081** ⛓T-080 Mini-courbe de la semaine (SVG maison) et **série de jours** discrète.
- [ ] **T-082** ⛓T-080 Carte d'astuce quotidienne calculée sur les données réelles (par exemple jour le plus faible).
- [ ] **T-083** ⛓T-080 Écran vide d'accueil (« Note ta première vente ») et célébrations discrètes (première vente, 7 jours de suite).

## Phase 9 : Bilans

- [ ] **T-090** ⛓T-043 Page **Bilans** : sélecteur semaine ou mois, trois cartes (ventes, dépenses, bénéfice estimé) avec flèche et pourcentage face à la période précédente.
- [ ] **T-091** ⛓T-090 Graphique en barres par jour (SVG maison, meilleur jour mis en valeur), produits les plus vendus, plus grosses dépenses.
- [ ] **T-092** ⛓T-090 Route `POST /api/summary` et résumé en 2 phrases avec **texte de secours** si l'IA échoue. Vérifier qu'aucun chiffre n'est inventé.

## Phase 10 : Hors ligne et PWA

- [ ] **T-100** Manifest, icônes et **service worker** (mise en cache de l'enveloppe). Application installable.
- [ ] **T-101** ⛓T-100 File d'attente **IndexedDB** : écriture locale d'abord, synchronisation avec backoff, idempotence par UUID.
- [ ] **T-102** ⛓T-101 Indicateurs d'état (bandeau hors ligne, icône de synchronisation par ligne) et mise en cache du Journal récent.
- [ ] **T-103** ⛓T-102 Tests manuels en avion, réseau instable et retour du réseau (aucun doublon, aucune perte).

## Phase 11 : « Moi », sécurité et données

- [ ] **T-110** Page **Moi** : profil, nom du commerce, langue, unités habituelles (`custom_units`).
- [ ] **T-111** ⛓T-110 **Code PIN** local (verrouillage de l'application) ; empreinte digitale si disponible.
- [ ] **T-112** ⛓T-110 **Export** des données (CSV) et **suppression complète** du compte et des données avec confirmation claire.
- [ ] **T-113** ⛓T-110 Écran « Ce que nous gardons, pourquoi, comment tout supprimer » et aide / contact.

## Phase 12 : Qualité, accessibilité et vitrine

- [ ] **T-120** Passe **accessibilité** : libellés, ordre du focus, contrastes (plein soleil), tailles de texte réglables, zones tactiles de 48 px, `prefers-reduced-motion`.
- [ ] **T-121** Passe **performance** : poids du JavaScript, chargement de `motion` à la demande, polices, images. Lighthouse mobile ≥ 90.
- [ ] **T-122** Test sur un **vrai téléphone Android d'entrée de gamme** (3G simulée, plein soleil, une main). Corriger.
- [ ] **T-123** Compléter les **tests unitaires** manquants et vérifier la couverture de `money`, `stats`, `parse-postprocess`, `dates`.
- [ ] **T-124** Soigner le **README** : captures d'écran des trois écrans clés, GIF de démonstration de 30 secondes, schéma d'architecture, lien vers l'application en ligne.
- [ ] **T-125** Relire les **conditions** des offres gratuites (voir T-012) avant d'ouvrir à de vrais utilisateurs ; renseigner la limite quotidienne d'appels IA.

## Phase 13 : Pilote avec de vrais commerçants

- [ ] **T-130** Préparer un **questionnaire d'entretien** (10 questions : habitudes de notes, revenus, ce qu'ils paient déjà, prêts à payer, langue utilisée).
- [ ] **T-131** Faire tester l'application à **5 à 10 commerçants** pendant 2 semaines. Noter chaque erreur (mauvais chiffre, mot incompris, unité ratée) dans `docs/ERREURS-IA.md`.
- [ ] **T-132** Mesurer : pourcentage d'opérations comprises du premier coup, commerçants encore actifs après 2 semaines, temps passé par jour (objectif : moins de 2 minutes).
- [ ] **T-133** Rédiger l'**étude de cas** (problème, choix techniques, ce qui a été appris, chiffres du pilote) pour le portfolio et LinkedIn ; enregistrer une démonstration vidéo de 60 secondes.

---

## Backlog V2

- [ ] Assistant de questions (outils `totals`, `top_products`, `best_day`, `compare`) : feuille de discussion et cartes de chiffres.
- [ ] Partage du bilan en **image** pour WhatsApp.
- [ ] **Notifications** et rappel du soir.
- [ ] **Produits et stock** : catalogue qui se construit tout seul, alertes de stock bas.
- [ ] **Réécoute du vocal** (optionnelle, consentement, conservation limitée).
- [ ] Connexion par **numéro de téléphone** (code SMS) selon le budget.
- [ ] Autres langues (fon, yoruba…) après mesure de la qualité de transcription.
- [ ] Canal **WhatsApp** en complément de l'application web.

## Backlog V3

- [ ] **Dettes clients** : « Awa me doit 5 000 », rappels, marquer comme payé.
- [ ] **Factures et reçus** partageables.
- [ ] **Plusieurs boutiques** et employés.
- [ ] **Rapports pour partenaires** (microfinance, ONG) avec consentement du commerçant.
- [ ] Paiement et abonnement via **mobile money**.

---

## Journal des décisions

_À remplir au fil du projet (date, décision, raison)._

- 2026-10-21 : stack validée = Next.js + Supabase + Gemini, application web installable (PWA).
- 2026-10-21 : nom provisoire « Comptavoix » (modifiable via `NEXT_PUBLIC_APP_NAME`).
- 2026-10-21 : pas d'audio conservé en V1 (confidentialité) ; réécoute du vocal repoussée en V2.
- 2026-10-21 : connexion par lien magique en V1 (SMS payant repoussé).
