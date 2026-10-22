# AGENTS.md : règles pour l'IA de développement

Tu es l'assistant de développement du projet **Comptavoix** (nom provisoire), une application web mobile-first de comptabilité vocale pour petits commerçants. Ces règles s'appliquent à chaque session, quel que soit l'outil utilisé.

## 1. Avant toute tâche : lire ces fichiers, dans cet ordre

1. `README.md` : vision, principes, périmètre
2. `docs/DESIGN.md` : écrans, composants, animations, identité visuelle
3. `docs/ARCHITECTURE.md` : stack, base de données, API, prompts, sécurité
4. `docs/TASKS.md` : liste des tâches et état d'avancement

Si un de ces fichiers est introuvable ou illisible, **arrête-toi et dis-le**. Ne travaille pas de mémoire.

**Ordre de priorité en cas de contradiction :**
- Pour l'interface : `docs/DESIGN.md` l'emporte.
- Pour la technique : `docs/ARCHITECTURE.md` l'emporte.
- Pour ce qu'il faut faire maintenant : `docs/TASKS.md` l'emporte.
- Signale toute contradiction que tu trouves, sans la résoudre toi-même en silence.

## 2. Méthode de travail

1. **Une seule tâche à la fois.** Prends celle que l'utilisateur indique, sinon la première tâche non cochée de `docs/TASKS.md` dont les prérequis sont terminés.
2. **Annonce un plan court** (3 à 6 lignes) avant d'écrire du code : fichiers créés ou modifiés, approche.
3. **Reste dans le périmètre.** Ne refactorise pas, ne renomme pas, n'ajoute pas de fonctionnalités qui ne sont pas dans la tâche. Si tu vois un problème ailleurs, note-le à la fin au lieu de le corriger.
4. **Si c'est ambigu, pose une question** plutôt que deviner. Une seule question claire, avec ta proposition par défaut.
5. **À la fin de la tâche :**
   - lance les vérifications (`npm run lint`, `npm run typecheck`, `npm run test` quand ils existent),
   - coche la tâche dans `docs/TASKS.md`,
   - résume en 3 lignes maximum ce qui a changé,
   - explique **comment tester à la main** (étapes concrètes),
   - propose un message de commit (format : `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).

## 3. Règles de code

- **TypeScript strict.** Pas de `any`. Pas de `@ts-ignore` sans commentaire justifié.
- Composants **fonctionnels** React. Composants serveur par défaut, composants client (`"use client"`) seulement quand c'est nécessaire (interactivité, micro, animations).
- Noms de fichiers en `kebab-case`, composants en `PascalCase`, fonctions et variables en `camelCase`.
- Code et commentaires techniques en **anglais** ; textes affichés à l'utilisateur en **français**.
- **Aucun texte d'interface écrit en dur** dans les composants : tout passe par `src/lib/i18n/fr.ts`.
- Styles : **Tailwind uniquement**, avec les tokens définis dans `docs/DESIGN.md` (couleurs, espacements, rayons). Pas de couleurs ou de tailles arbitraires.
- Valider toutes les entrées des routes API avec **Zod**.
- Gérer les états de chargement, de vide, d'erreur et hors ligne pour chaque écran (voir `docs/DESIGN.md`, section États).
- **Pas de nouvelle dépendance** sans la justifier en une phrase (poids, alternative native). Le poids du JavaScript initial compte.
- Petites fonctions pures et testées pour la logique métier (`src/lib/money.ts`, `stats.ts`, `parse-postprocess.ts`).

## 4. Règles métier invariantes

1. **Les montants sont des entiers en FCFA (XOF).** Jamais de décimales pour l'argent. Affichage : `12 000 FCFA` (espace insécable comme séparateur).
2. **L'IA ne calcule jamais les totaux ni les bilans.** Elle extrait et formule. Tous les chiffres viennent de fonctions de code testées. Le texte du bilan est écrit par l'IA **à partir de chiffres déjà calculés**, avec un texte de secours si l'IA est indisponible.
3. **Rien n'est enregistré sans confirmation de l'utilisateur** (écran de confirmation), sauf paramètre explicite ajouté plus tard.
4. **En cas d'incertitude (prix manquant, quantité floue, unité inconnue), on pose la question.** On ne devine jamais un montant.
5. **Suppression douce** des opérations (`deleted_at`) avec annulation possible 5 secondes dans l'interface.
6. **Chaque opération a un identifiant généré côté client** (UUID) pour que la synchronisation hors ligne ne crée pas de doublons.

## 5. Sécurité et confidentialité

- Les clés (`GEMINI_API_KEY`, etc.) restent **côté serveur**. Jamais dans le code client, jamais dans Git.
- Toutes les tables ont **Row Level Security** : un utilisateur ne voit que ses lignes.
- Ne jamais écrire de données personnelles ou financières dans les logs.
- Ne jamais commiter `.env.local`. Vérifier `.gitignore` avant le premier commit.
- Respecter les limites gratuites : limiter les appels IA par utilisateur et par jour (voir `docs/ARCHITECTURE.md`).

## 6. Règles d'interface

- Mobile d'abord (largeur de référence : 360 px). Une main, un pouce.
- Zones tactiles **48 px minimum** ; le bouton micro fait **72 px**.
- Les ventes et les dépenses se distinguent par **couleur + icône + signe** (↑ +, ↓ −), jamais par la couleur seule.
- Respecter `prefers-reduced-motion`. Animations courtes (150 à 300 ms) et utiles.
- Langage simple, tutoiement, phrases courtes, aucun jargon comptable.
- Jamais de message d'erreur technique affiché à l'utilisateur.

## 7. Interdits

- Écrire ou modifier du code hors de la tâche en cours.
- Inventer des fonctionnalités, des écrans ou des champs absents de `docs/DESIGN.md`.
- Contourner une règle de ce fichier « pour aller plus vite ».
- Affirmer que quelque chose fonctionne sans l'avoir vérifié (build, lint, test ou exécution).
- Supprimer des fichiers ou des tests pour faire passer une vérification.

## 8. Définition de « terminé »

Une tâche est terminée seulement si :
- [ ] le comportement demandé fonctionne (testé à la main, étapes données),
- [ ] `lint`, `typecheck` et les tests passent,
- [ ] tous les états (chargement, vide, erreur, hors ligne) sont gérés quand c'est pertinent,
- [ ] l'accessibilité de base est respectée (libellés, contraste, zones tactiles),
- [ ] `docs/TASKS.md` est à jour,
- [ ] aucun secret n'est exposé.

## 9. Phrase de démarrage de session (à coller si l'outil ne lit pas AGENTS.md tout seul)

```
Lis AGENTS.md, README.md, docs/DESIGN.md, docs/ARCHITECTURE.md et docs/TASKS.md.
Confirme en 2 lignes que tu as tout lu, puis traite uniquement la tâche : <ID et titre de la tâche>.
Annonce ton plan avant de coder.
```
