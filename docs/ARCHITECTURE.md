# ARCHITECTURE.md : architecture technique

Référence pour toute décision technique. En cas de contradiction avec un autre fichier sur la technique, ce document l'emporte.

---

## 1. Vue d'ensemble

```
Navigateur du commerçant (PWA, mobile d'abord)
  │  enregistre la voix (MediaRecorder) ou reçoit du texte
  ▼
Routes API Next.js (serveur)
  ├─ /api/parse    : audio ou texte → transcription + opérations (JSON)
  ├─ /api/summary  : chiffres calculés → résumé en langage simple
  └─ /api/ask      : (V2) question → outils de calcul prédéfinis
  │
  ├─ Gemini API (transcription + extraction), clé côté serveur uniquement
  └─ Supabase (PostgreSQL + Auth + RLS)
```

**Règle centrale : l'IA comprend et formule, le code calcule.**
Le LLM n'additionne jamais, ne calcule aucun total de période, aucun bilan. Il extrait des champs et, au besoin, rédige un texte à partir de chiffres déjà calculés.

---

## 2. Stack et décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Framework | Next.js (App Router), TypeScript strict | Un seul projet pour l'interface et les routes serveur |
| Style | Tailwind CSS avec tokens de `docs/DESIGN.md` | Cohérence et rapidité |
| Animations | CSS d'abord ; `motion` chargé à la demande (feuilles, gestes) | Poids réduit pour téléphones d'entrée de gamme |
| Icônes | lucide-react | Léger, cohérent |
| Graphiques | **SVG maison** (barres par jour) | Éviter une librairie lourde |
| Base et comptes | Supabase (offre gratuite pour démarrer) | Postgres, Auth et RLS inclus |
| IA | API Gemini, appelée depuis le serveur | Offre gratuite pour tester, audio supporté |
| Validation | Zod | Entrées API et sorties de l'IA |
| Hors ligne | Service worker (PWA) + IndexedDB (`idb`) | Réseau instable |
| Tests | Vitest | Logique métier pure |
| Hébergement | Vercel | Déploiement simple, HTTPS (nécessaire pour le micro) |

Aucune dépendance supplémentaire sans justification (voir `AGENTS.md`).

### Points à vérifier tôt (spikes, voir `docs/TASKS.md`)

1. **Formats audio** : Chrome produit souvent du `webm/opus`, Safari de l'`mp4/aac`. Vérifier dans la documentation Gemini à jour quels types MIME sont acceptés. Si un format n'est pas accepté, convertir côté client (par exemple en WAV via `AudioContext`) avant l'envoi.
2. **Limites de l'hébergeur** : taille maximale du corps de requête et durée maximale d'une fonction sur l'offre gratuite. Garder les enregistrements courts (30 secondes maximum conseillées) et compresser l'audio.
3. **Conditions d'utilisation** de l'offre gratuite de Vercel (usage personnel ou commercial) et de l'API gratuite de Gemini (traitement des données). À relire **avant d'ouvrir l'application à de vrais utilisateurs**.
4. **Nom du modèle Gemini** : lu depuis `GEMINI_MODEL` (valeur par défaut `gemini-2.5-flash`). Les noms et quotas changent ; vérifier la documentation.

---

## 3. Structure du dépôt

```
comptavoix/
├─ AGENTS.md
├─ README.md
├─ docs/
│  ├─ DESIGN.md
│  ├─ ARCHITECTURE.md
│  └─ TASKS.md
├─ supabase/
│  └─ migrations/              # fichiers SQL numérotés
├─ public/                     # icônes PWA, manifest
└─ src/
   ├─ app/
   │  ├─ (auth)/login/page.tsx
   │  ├─ onboarding/page.tsx
   │  ├─ (app)/layout.tsx           # barre d'onglets + bouton micro
   │  ├─ (app)/page.tsx             # Accueil
   │  ├─ (app)/journal/page.tsx
   │  ├─ (app)/journal/[id]/page.tsx
   │  ├─ (app)/bilans/page.tsx
   │  ├─ (app)/moi/page.tsx
   │  └─ api/
   │     ├─ parse/route.ts
   │     ├─ summary/route.ts
   │     └─ ask/route.ts            # V2
   ├─ components/
   │  ├─ ui/                        # Button, Card, Chip, AmountText, Sheet, Skeleton…
   │  ├─ capture/                   # MicButton, Waveform, CaptureSheet
   │  ├─ confirmation/              # OperationCard, ConfirmationList
   │  └─ layout/                    # TabBar, OfflineBanner
   └─ lib/
      ├─ i18n/fr.ts                 # tous les textes
      ├─ money.ts                   # formatFCFA, parse montants, calculs
      ├─ dates.ts                   # semaines, jours, fuseau (Africa/Porto-Novo)
      ├─ stats.ts                   # totaux, séries, meilleur jour, top produits
      ├─ parse-postprocess.ts       # vérifications après l'IA
      ├─ gemini.ts                  # client Gemini (serveur)
      ├─ supabase/                  # clients navigateur et serveur
      └─ offline/                   # file d'attente IndexedDB + synchronisation
```

---

## 4. Variables d'environnement (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=            # serveur uniquement
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_NAME=Comptavoix
```

Règles : seules les variables préfixées `NEXT_PUBLIC_` peuvent aller dans le navigateur. N'utiliser **aucune clé « service role »** Supabase côté client ; préférer des requêtes faites avec la session de l'utilisateur et protégées par RLS.

---

## 5. Base de données (Supabase / PostgreSQL)

Fichier de migration initial : `supabase/migrations/0001_init.sql`.

```sql
-- Profil de l'utilisateur
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  business_name text,
  business_type text check (business_type in
    ('boutique','marche','restauration','couture','boissons','autre')),
  language text not null default 'fr',
  currency text not null default 'XOF',
  reminder_time time,
  created_at timestamptz not null default now()
);

-- Opérations (ventes et dépenses)
create table operations (
  id uuid primary key,                       -- généré côté client (idempotence hors ligne)
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('sale','expense')),
  label text not null,                       -- ex. "savon", "transport"
  category text,
  quantity numeric,
  unit text,                                 -- ex. "carton", "sac"
  unit_price bigint,                         -- FCFA, entier
  total_amount bigint not null check (total_amount >= 0),  -- FCFA, entier
  occurred_at timestamptz not null default now(),
  source text not null check (source in ('voice','text','manual')),
  transcript text,                           -- texte compris (pas d'audio en V1)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz                     -- suppression douce
);
create index operations_user_date_idx on operations (user_id, occurred_at desc);

-- Historique des modifications
create table operation_edits (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid not null references operations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  changed_at timestamptz not null default now(),
  before jsonb not null,
  after jsonb not null
);

-- Unités personnalisées (« tas », « bassine »…)
create table custom_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  aliases text[] not null default '{}'
);

-- Compteur d'appels IA (protège le quota gratuit)
create table ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  calls int not null default 0,
  primary key (user_id, day)
);

-- Row Level Security : chacun ne voit que ses lignes
alter table profiles enable row level security;
alter table operations enable row level security;
alter table operation_edits enable row level security;
alter table custom_units enable row level security;
alter table ai_usage_daily enable row level security;

create policy "own profile" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own operations" on operations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own edits" on operation_edits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own units" on custom_units
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own usage" on ai_usage_daily
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

Notes :
- Les montants sont des **entiers** (le franc CFA n'a pas de centimes).
- La « série de jours » et tous les bilans sont **calculés à la volée** depuis `operations`, pas stockés.
- Les dates sont stockées en UTC ; l'affichage et le découpage en jours utilisent le fuseau `Africa/Porto-Novo` (UTC+1).
- Les opérations supprimées (`deleted_at` non nul) sont exclues de tous les calculs.
- Aucun fichier audio n'est conservé en V1 (voir section 10).

---

## 6. API

### 6.1 `POST /api/parse`

Corps : `multipart/form-data` avec `audio` (fichier, optionnel) **ou** `text` (chaîne, optionnel). Au moins l'un des deux.

Réponse (validée par Zod des deux côtés) :

```ts
type ParsedOperation = {
  kind: 'sale' | 'expense';
  label: string;                 // "savon", "transport"
  category?: string | null;
  quantity?: number | null;
  unit?: string | null;          // "carton", "sac"…
  unit_price?: number | null;    // FCFA entier
  total_amount: number | null;   // FCFA entier, null si inconnu
  confidence: 'high' | 'medium' | 'low';
  flags: Array<'missing_price' | 'missing_quantity' | 'total_mismatch'
              | 'unusual_amount' | 'unknown_unit'>;
};

type ParseResult = {
  transcript: string;
  operations: ParsedOperation[];
  uncertainties: Array<{ field: string; question: string }>;
};
```

Étapes côté serveur :
1. Vérifier la session et le quota quotidien (`ai_usage_daily`).
2. Si audio : taille et durée maximales ; transcription.
3. Extraction avec **sortie structurée** (réponse JSON contrainte par un schéma) et le prompt de la section 7.
4. **Post-traitement par du code** (`parse-postprocess.ts`) :
   - si `quantity` et `unit_price` existent : recalculer `total_amount = quantity × unit_price` ; si le total annoncé diffère, flag `total_mismatch` et garder le calcul du code comme proposition ;
   - si le total manque mais quantité et prix existent : le calculer ;
   - si aucun montant : flag `missing_price` et poser la question ;
   - flag `unusual_amount` si le montant dépasse un seuil (par défaut 1 000 000 FCFA, ou largement au-dessus de l'habitude de l'utilisateur) ;
   - arrondir les montants en entiers, refuser les négatifs.
5. Retourner `ParseResult`. **Rien n'est enregistré à cette étape.**

Erreurs : `429` ou erreur Gemini → réessai avec backoff exponentiel (2 tentatives), puis message simple côté interface et bascule vers la saisie manuelle.

### 6.2 `POST /api/summary`

Entrée : les chiffres **déjà calculés** de la période (ventes, dépenses, reste, meilleur jour, variation, top produits). Sortie : 2 phrases en langage simple.
Le prompt interdit d'utiliser un chiffre absent de l'entrée. Si l'appel échoue : **texte de secours** construit par un gabarit dans `i18n/fr.ts`.

### 6.3 `POST /api/ask` (V2)

L'IA choisit parmi des **outils prédéfinis** (appel de fonctions) : `totals(period)`, `top_products(period)`, `best_day(period)`, `compare(period_a, period_b)`. Le code exécute ces outils sur les données de l'utilisateur. L'IA n'écrit jamais de SQL libre.

### 6.4 Lecture et écriture des opérations

Depuis le client, avec la session Supabase et RLS (pas de route API nécessaire pour le CRUD simple). Les écritures passent par la file d'attente hors ligne (section 9).

---

## 7. Prompt d'extraction (point de départ)

Placé dans `src/lib/gemini.ts` (constante). À affiner avec les erreurs réelles des tests.

```
Tu es un assistant qui transforme une phrase de commerçant en opérations comptables.

Entrée : le texte (ou la transcription) d'un commerçant, en français parlé du quotidien,
parfois avec des mots locaux.

Tu extrais des opérations de deux types :
- "sale" : ce que le commerçant a vendu ou encaissé (« j'ai vendu », « il m'a payé »)
- "expense" : ce qu'il a acheté, payé ou dépensé (« j'ai acheté », « j'ai payé »)

Pour chaque opération, remplis : kind, label, category, quantity, unit, unit_price,
total_amount, confidence.

Règles strictes :
- Les montants sont en FCFA, en nombres entiers.
- Comprends les nombres dits à l'oral : « douze mille » = 12000, « huit mille cinq cents » = 8500,
  « cinq mille » = 5000, « 5 mille » = 5000, « 2k » = 2000.
- « à 8 000 chacun » signifie unit_price = 8000.
- N'INVENTE JAMAIS un montant, une quantité ou une unité. Si une information manque,
  mets null et ajoute une question dans "uncertainties".
- Ne calcule pas de total général ni de bilan. Tu peux reprendre un total dit explicitement par la personne.
- Unités fréquentes : sac, carton, tas, bassine, paquet, kilo, litre, pièce, boîte, bouteille.
  Si l'unité est inconnue, garde le mot tel quel.
- Si le texte ne contient aucune opération, renvoie une liste vide et une question qui demande de reformuler.
- Réponds uniquement avec le JSON demandé.
```

Cas de test à garder dans `src/lib/__tests__/` (et à compléter) :
- « j'ai vendu 3 cartons de savon à 8 000 chacun et j'ai payé le transport 2 500 »
- « vente de riz 12 000 » (pas de quantité)
- « j'ai acheté du stock pour 30 000 » (dépense sans détail)
- « dix mille moins cinq cents » (formulation arithmétique)
- « j'ai vendu du riz » (prix manquant : doit poser la question)
- Un texte sans rapport (« il pleut aujourd'hui ») : liste vide

---

## 8. Statistiques et argent (`lib/money.ts`, `lib/stats.ts`)

Fonctions pures, **entièrement testées avec Vitest** :
- `formatFCFA(n)` → `12 000 FCFA` ; `parseAmount(str)` pour la saisie manuelle
- `totalsForPeriod(operations, period)` → ventes, dépenses, reste
- `dailySeries(operations, range)` → tableau pour le graphique
- `bestDay`, `topProducts`, `biggestExpenses`, `compareToPrevious`
- `currentStreak(operations, today)` → série de jours avec au moins une opération
- `detectDuplicate(candidate, recent)` → doublon probable (même type, libellé, montant dans les 2 minutes)

---

## 9. Hors ligne et PWA

- **Manifest** (nom, icônes, couleurs, `display: standalone`) et **service worker** : mise en cache de l'enveloppe de l'application (pages, polices, icônes).
- **File d'attente IndexedDB** : toute opération confirmée est d'abord écrite localement avec son UUID, marquée « en attente », puis synchronisée vers Supabase quand le réseau revient (réessais avec backoff). L'UUID rend la synchronisation **idempotente** (pas de doublons).
- **Sans réseau** : la saisie texte et la confirmation manuelle fonctionnent ; l'extraction par IA nécessite le réseau. L'interface le dit clairement et garde le texte pour l'analyser plus tard.
- **Indicateurs** : bandeau « Hors ligne », icône de synchronisation par ligne en attente.
- **Lecture** : le journal des dernières semaines est mis en cache pour consultation hors ligne.

---

## 10. Confidentialité et sécurité

- **RLS** sur toutes les tables (section 5).
- **Secrets côté serveur uniquement.** Aucune clé d'IA dans le navigateur.
- **Aucun audio conservé en V1** : l'audio est envoyé pour transcription puis jeté. La réécoute du vocal (V2) sera **optionnelle**, avec consentement, durée de conservation limitée (par exemple 30 jours) et stockage chiffré.
- **Pas de données personnelles ou financières dans les logs.**
- **Droits de l'utilisateur** : export (CSV) et suppression complète du compte et des données depuis « Moi ».
- **Limites d'usage** : quota d'appels IA par utilisateur et par jour (par exemple 100 appels), compté dans `ai_usage_daily`, pour ne pas épuiser l'offre gratuite.
- **Authentification V1** : lien magique par email (gratuit). Numéro de téléphone avec code SMS et code PIN local viennent ensuite ; le SMS est payant, à décider selon le budget.
- **Entrées** : validation Zod sur toutes les routes ; refus des fichiers trop gros ou de types inattendus.
- **Transparence** : écran d'information simple (« Ce que nous gardons, pourquoi, comment tout supprimer »).

---

## 11. Qualité et performance

- Objectifs : Lighthouse mobile ≥ 90 en performance et accessibilité ; JavaScript initial le plus petit possible ; images optimisées ; polices limitées.
- Tests unitaires obligatoires sur `money.ts`, `stats.ts`, `parse-postprocess.ts`, `dates.ts`.
- Test manuel de référence : téléphone Android d'entrée de gamme, réseau 3G simulé, plein soleil (luminosité maximale), une main.
- CI minimale (GitHub Actions) : `lint`, `typecheck`, `test`, `build`.
- Commits petits, lisibles, au format `feat: …`, `fix: …`, `docs: …`, `chore: …`. 
- Commits en français de préférence 

