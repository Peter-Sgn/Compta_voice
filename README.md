# Comptavoix

> Le comptable de poche des petits commerçants : tu parles, il note, il fait les comptes.

**Comptavoix** est un nom provisoire. Il est défini à un seul endroit (`NEXT_PUBLIC_APP_NAME`) et se change en deux secondes.

**Statut :** en développement (V1).
**Auteur :** Pierre.

---

## Le problème

Plus de 90 % des emplois au Bénin sont informels (DTDA, Labour Market Profile 2025/2026). La grande majorité des petits commerçants, vendeuses de marché et artisans ne tiennent aucun registre : pas le temps, pas d'outil adapté, pas de formation en comptabilité. Résultat : ils ne savent pas s'ils gagnent de l'argent, ni où il part, et ils n'ont aucune trace pour obtenir un crédit.

## La solution

Le commerçant **parle** à l'application, comme il parlerait à un assistant :

> « J'ai vendu 3 cartons de savon à 8 000 chacun, et j'ai payé le transport 2 500. »

L'application :
1. transcrit la voix,
2. comprend les opérations grâce à un modèle d'IA (LLM),
3. **montre ce qu'elle a compris** et demande confirmation,
4. range tout dans un registre,
5. calcule les totaux **avec du code** (jamais avec l'IA),
6. envoie un bilan simple : ventes, dépenses, ce qui reste.

Rien à apprendre : pas de formulaire, pas de tableau, juste la voix ou un message.

## Pour qui

Petits commerçants, vendeuses de marché, boutiques de quartier, artisans, restauratrices de rue. Utilisation sur **téléphone d'entrée de gamme**, en plein soleil, souvent avec un réseau instable. Langue de départ : **français** (y compris le français parlé du quotidien).

## Fonctionnalités de la V1

- Enregistrer ventes et dépenses **par la voix ou par écrit**
- **Écran de confirmation** avant tout enregistrement (corriger, valider, refaire)
- Corriger ou annuler une opération (annulation possible pendant 5 secondes)
- **Journal** filtrable (jour, semaine, mois, ventes, dépenses) avec recherche
- **Accueil** : ventes, dépenses et reste du jour, courbe de la semaine, série de jours
- **Bilan hebdomadaire et mensuel** avec résumé en langage simple
- **Mode hors ligne** : les opérations sont gardées et synchronisées au retour du réseau
- Application **installable** sur le téléphone (PWA), sans passer par un magasin d'applications
- Code PIN, export et suppression des données

Le détail complet, écran par écran, est dans [`docs/DESIGN.md`](docs/DESIGN.md).

## Stack technique

| Rôle | Technologie |
|---|---|
| Framework | Next.js (App Router) + TypeScript strict |
| Interface | Tailwind CSS, icônes lucide-react, animations CSS + `motion` pour les feuilles et les gestes |
| Base de données et comptes | Supabase (PostgreSQL, Auth, Row Level Security) |
| IA (transcription et extraction) | API Gemini, appelée **uniquement depuis le serveur** |
| Validation | Zod |
| Hors ligne | PWA (service worker) + IndexedDB |
| Tests | Vitest |
| Hébergement | Vercel |

Détails et décisions : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# puis remplir les valeurs (voir ci-dessous)

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir http://localhost:3000. Pour tester le micro sur téléphone, utiliser une URL en HTTPS (déploiement de prévisualisation ou tunnel).

### Variables d'environnement

| Variable | Où | Rôle |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Clé publique Supabase |
| `GEMINI_API_KEY` | **serveur uniquement** | Clé de l'API Gemini |
| `GEMINI_MODEL` | serveur | Modèle utilisé (par défaut `gemini-2.5-flash`, à vérifier) |
| `NEXT_PUBLIC_APP_NAME` | public | Nom affiché de l'application |

Ne jamais publier `.env.local`. Il est dans `.gitignore`.

## Structure du projet

```
src/app/            pages et routes API
src/components/     composants d'interface
src/lib/            logique (argent, dates, statistiques, Gemini, Supabase, hors ligne)
supabase/migrations schéma de la base de données
docs/               DESIGN, ARCHITECTURE, TASKS
AGENTS.md           règles pour l'IA de développement
```

## Principes non négociables

1. **Voix d'abord** : l'action principale est toujours à un tap.
2. **Confiance** : l'application montre ce qu'elle a compris avant d'enregistrer.
3. **L'IA comprend, le code calcule** : tous les totaux viennent de fonctions testées.
4. **Données financières = données sensibles** : secrets côté serveur, accès protégé par utilisateur, suppression possible à tout moment.
5. **Pensé pour le terrain** : lisible en plein soleil, d'une main, hors ligne.

## Feuille de route

- **V1** : onboarding, accueil, capture vocale et texte, confirmation, journal, bilans, hors ligne, PIN
- **V2** : assistant de questions, partage du bilan en image, rappels, produits et stock, réécoute du vocal
- **V3** : dettes clients, factures et reçus, plusieurs boutiques, rapports pour partenaires (microfinance), paiement mobile money

Liste détaillée des tâches : [`docs/TASKS.md`](docs/TASKS.md).

## Documentation

- [`docs/DESIGN.md`](docs/DESIGN.md) : cahier des charges UI/UX
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) : architecture, base de données, API, prompts
- [`docs/TASKS.md`](docs/TASKS.md) : tâches ordonnées
- [`AGENTS.md`](AGENTS.md) : règles de travail pour l'IA

## Captures et démonstration

_À ajouter : captures d'écran des trois écrans clés (accueil, capture vocale, confirmation), GIF de démonstration de 30 secondes, lien vers l'application en ligne._
