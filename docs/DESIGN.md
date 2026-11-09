# DESIGN.md : cahier des charges UI/UX

Ce document est la référence pour toute l'interface. Il décrit les écrans, les composants, les animations et l'identité visuelle validés.

**Utilisateur de référence :** un commerçant pressé, debout derrière son étal, avec un téléphone d'entrée de gamme, du soleil sur l'écran et un réseau capricieux. Chaque décision part de là.

---

## 1. Principes de conception

1. **Voix d'abord** : l'action principale (parler) est toujours à un tap.
2. **Zéro jargon** : « J'ai vendu », « J'ai dépensé », « Ce qui me reste », jamais « recettes » ni « charges ».
3. **Un écran, une action** : jamais de formulaire long.
4. **Confiance** : l'application montre toujours ce qu'elle a compris avant d'enregistrer.
5. **Résistante au terrain** : lisible en plein soleil, utilisable d'une main, fonctionne hors ligne.
6. **Inclusive** : icônes et mots ensemble, lecture à voix haute possible, textes agrandissables.

---

## 2. Identité visuelle et tokens

### Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `brand-900` | `#0B3D2E` | Vert profond : textes forts, en-têtes |
| `brand-700` | `#116149` | Couleur principale : boutons, onglet actif |
| `brand-100` | `#DDF2E8` | Fonds de cartes positives |
| `accent-500` | `#F5A524` | Ambre chaud : accent, bouton micro, mise en valeur |
| `accent-100` | `#FFF1D6` | Fond « À vérifier » |
| `bg` | `#FAF8F3` | Fond de l'application (blanc cassé) |
| `surface` | `#FFFFFF` | Cartes |
| `text` | `#1B1B18` | Texte principal |
| `text-muted` | `#5E5E57` | Texte secondaire |
| `sale` | `#1F7A4D` | Ventes (toujours avec ↑ et +) |
| `expense` | `#C2551F` | Dépenses (toujours avec ↓ et −) |
| `danger` | `#B42318` | Suppression, erreurs graves |
| `border` | `#E6E2D8` | Séparateurs |

Exigence : **contraste élevé** (AA minimum, viser AAA pour les montants) pour la lecture en plein soleil. Vérifier chaque combinaison texte/fond.

**Ventes et dépenses** : vert et orange, mais **toujours doublés** d'une icône (↑ et ↓) et d'un signe (+ et −), pour les personnes daltoniennes.

### Typographie

- Police : **Nunito** ou **Plus Jakarta Sans** (via `next/font`, avec sous-ensembles latins).
- **Chiffres tabulaires** (`font-variant-numeric: tabular-nums`) pour que les montants s'alignent.
- Format des montants : `12 000 FCFA` (séparateur de milliers insécable).
- Échelle : montants héros 36 px, titres 24 px, texte 16 px, légendes 13 px minimum.

### Espacements, formes, ombres

- Grille d'espacement de 4 px (`4, 8, 12, 16, 24, 32`).
- Rayons : cartes 16 px, boutons 14 px, puces 999 px.
- Ombres douces (jamais dures). Le bouton micro a une ombre plus marquée pour ressortir.

### Composants de base

- **Boutons** : zones tactiles de **48 px minimum**. Le bouton micro fait **72 px**.
- Ton : chaleureux, **tutoiement**, phrases courtes, vocabulaire du quotidien.
- Illustrations : personnages et décors locaux (marchés, étals, pagnes), pas d'images génériques occidentales.
- Icônes : lucide-react, toujours accompagnées d'un libellé quand l'espace le permet.

### Surfaces translucides (« verre ») : usage restreint

Tokens :
- glass-on-dark : fond blanc à 14 % d'opacité, bordure blanche à 28 %, flou 12 px. Réservé aux cartes posées sur la bande verte (brand-900 vers brand-700).
- glass-on-light : fond blanc à 72 % d'opacité, bordure `border`, flou 8 px. Réservé à la barre d'onglets et aux feuilles qui montent du bas.
- tint-soft : brand-100 à 60 % d'opacité, pour les cartes d'astuce et les messages d'information.

STRUCTURE ET TRANSPARENCE (voir la nouvelle section « Surfaces translucides » de docs/DESIGN.md)
Fais de la page de démonstration une vraie page structurée, dans un conteneur de 360 px :
1. Bande d'en-tête verte (dégradé brand-900 vers brand-700, coins du bas arrondis de 24 px) avec une salutation et la date, puis une carte « verre » (glass-on-dark) contenant « Ce qui me reste » en chiffre héros, et en dessous deux sous-blocs côte à côte, « J'ai vendu » et « J'ai dépensé », séparés par un filet fin.
2. Section « Cette semaine » : carte pleine avec une mini-courbe ou de petites barres (valeurs fictives, SVG simple).
3. Section « Dernières opérations » : un seul bloc plein, avec les lignes séparées par des filets fins, et le lien « Voir tout ».
4. Une carte d'astuce en tint-soft.
5. Une barre d'onglets factice en bas (glass-on-light), pour juger le rendu du flou.
Implémente les tokens de verre dans le thème Tailwind, avec repli en couleur pleine via @supports not (backdrop-filter) et prise en compte de prefers-reduced-transparency lorsque le navigateur la gère. Pas plus de 2 éléments avec flou sur la page. Vérifie le contraste du texte sur chaque surface et dis-moi les valeurs mesurées.

Règles :
1. Maximum 2 éléments avec flou (backdrop-filter) par écran.
2. Les montants et les textes importants ne sont jamais posés sur un fond clair translucide : soit texte blanc sur vert profond (contraste d'au moins 7:1), soit surface pleine.
3. Repli obligatoire : si le navigateur ne gère pas le flou (@supports), ou si l'utilisateur demande moins de transparence, utiliser une couleur pleine équivalente.
4. Listes, graphiques et formulaires : surfaces pleines (surface), jamais translucides.

### Structure type d'une page

1. Bande d'en-tête (brand-900 vers brand-700, coins inférieurs arrondis de 24 px) : salutation, date et carte « verre » avec le chiffre principal.
2. Sections empilées sur le fond bg, chacune avec un titre (20 px gras) et, si utile, un lien « Voir tout » à droite.
3. Une section = une carte pleine ou un groupe de lignes séparées par des filets fins.
4. Espace de 24 px entre sections, 16 px de marge latérale, contenu aligné à gauche.

---

## 3. Navigation

**Barre d'onglets en bas** (zone du pouce), 4 entrées plus un bouton central :

| Onglet | Rôle |
|---|---|
| **Accueil** | La journée en un coup d'œil |
| **Journal** | Toutes les opérations |
| **🎤 (bouton central, plus grand)** | Parler ou écrire une opération |
| **Bilans** | Résultats de la semaine et du mois |
| **Moi** | Profil, réglages, aide |

Le bouton micro dépasse légèrement de la barre, avec une ombre douce et la couleur d'accent : impossible à rater, même pour un premier usage. La barre ne bouge pas pendant les transitions entre onglets.

---

## 4. Écrans et sous-pages

### 4.1 Onboarding (60 secondes maximum)

1. **Langue** : choix avec les noms dans la langue elle-même (V1 : français ; structure prête pour d'autres langues).
2. **Type de commerce** : grandes cartes illustrées (boutique, marché, restauration, couture, boissons, autre).
3. **Connexion** : V1 par email (lien magique). Numéro de téléphone avec code SMS ou code PIN prévus ensuite (voir `docs/TASKS.md`).
4. **Premier essai guidé** : « Dis à voix haute : j'ai vendu 2 sacs de riz à 12 000 ». L'utilisateur voit la magie opérer avant même d'avoir fini de s'inscrire.

Pas de longue présentation de fonctionnalités.

### 4.2 Accueil

- Salutation avec le prénom et la date.
- **Carte du jour** : Ventes, Dépenses, Ce qui me reste, avec des chiffres qui s'animent (compteur).
- Mini-courbe de la semaine.
- **Série de jours** (« 5 jours de suite ») : discrète, pour construire l'habitude.
- Liste des 5 dernières opérations.
- Carte d'astuce quotidienne (« Tu vends moins le lundi »), calculée à partir des données réelles.
- Bouton « Partager mon bilan » (V2 : image).

### 4.3 Capture (feuille qui monte du bas)

- **Grand bouton micro** : un tap pour démarrer, un tap pour arrêter, arrêt automatique après un silence.
- **Onde sonore en direct** ; texte transcrit qui apparaît en temps réel quand c'est possible.
- Phrases d'exemple sous le micro pour guider.
- Bascule vers le **clavier** (« Écrire plutôt »).
- **Permission micro refusée** : écran d'aide pas à pas, avec captures, et bascule automatique vers la saisie texte.

### 4.4 Confirmation (l'écran le plus important)

- Une **carte par opération** : icône du produit, quantité × prix = total.
- Champs touchables pour corriger sur place (pavé numérique grand format).
- Champs incertains surlignés en ambre avec « À vérifier ».
- Glisser une carte pour la supprimer.
- Deux gros boutons : **Valider tout** (principal) et **Refaire** (secondaire).
- Option « Lire à voix haute » pour vérifier sans lire.
- Question de clarification quand une information manque (« À quel prix ? ») au lieu de deviner.

### 4.5 Journal

- Puces de filtre : Aujourd'hui, Semaine, Mois, Ventes, Dépenses.
- Recherche.
- Opérations groupées par jour, avec le total de chaque jour.
- **Page détail** d'une opération : modifier, supprimer, historique des modifications. *Réécouter le vocal d'origine : V2 (stockage audio optionnel, voir `docs/ARCHITECTURE.md`).*

### 4.6 Bilans

- Sélecteur semaine ou mois.
- Trois cartes : ventes, dépenses, bénéfice estimé, avec flèche et pourcentage face à la période précédente.
- Graphique en barres par jour (meilleur jour mis en valeur).
- Produits les plus vendus, plus grosses dépenses.
- **Partager en image** vers WhatsApp (V2) : chaque partage fait connaître l'application.
- Résumé écrit par l'IA en 2 phrases, avec des chiffres calculés par le code.

### 4.7 Assistant de questions (V2)

- Feuille de discussion avec des questions suggérées (« Combien j'ai vendu hier ? », « Quel est mon meilleur produit ? »).
- Réponses sous forme de **cartes de chiffres**, pas de longs paragraphes.

### 4.8 Moi

- Profil et nom du commerce.
- Langue ; unités habituelles (sac, carton, tas, bassine).
- Notifications (heure du rappel du soir) : V2.
- Sécurité : code PIN, empreinte digitale.
- Exporter mes données.
- Aide et contacter le support.
- **Supprimer mes données** : facteur de confiance essentiel pour des données financières.

---

## 5. Fonctionnalités par version

| Version | Contenu |
|---|---|
| **V1** | Onboarding, accueil, capture vocale et texte, confirmation, journal, bilan hebdomadaire et mensuel, hors ligne, code PIN, export et suppression |
| **V2** | Assistant de questions, partage d'image du bilan, notifications, produits et stock, réécoute du vocal |
| **V3** | Dettes clients (« Awa me doit 5 000 », rappels), factures et reçus, plusieurs boutiques et employés, rapports pour partenaires (microfinance), paiement mobile money |

**Priorité de soin** : trois écrans doivent être irréprochables avant tout le reste : **Accueil, Capture, Confirmation**.

---

## 6. Animations et micro-interactions

Toutes courtes (150 à 300 ms), utiles, jamais décoratives.

| Moment | Animation |
|---|---|
| Appui sur le micro | Le bouton « respire » (pulsation douce), vibration légère |
| Pendant l'écoute | Onde sonore qui réagit à la voix |
| Mots transcrits | Apparition fluide, mot par mot |
| Cartes de confirmation | Elles glissent et se superposent en cascade |
| Validation | Coche animée, carte qui vole vers le journal, chiffre du jour qui s'incrémente |
| Chiffres de l'accueil | Compteur qui monte au chargement |
| Suppression | Annulation possible pendant 5 secondes (« Annuler ») |
| Première vente, 7 jours de suite | Petite célébration discrète, sans excès |
| Chargement | Squelettes grisés plutôt que des roues qui tournent |
| Changement d'onglet | Transition légère, la barre de navigation ne bouge pas |

Règles : respecter `prefers-reduced-motion` (désactiver ou réduire), privilégier les animations CSS légères, charger `motion` à la demande pour les feuilles et les gestes.

---

## 7. États et cas limites

| Situation | Comportement |
|---|---|
| **Hors ligne** | Bandeau « Hors ligne : tes opérations sont gardées », petite icône de synchronisation sur chaque ligne en attente |
| **Écran vide** | Illustration chaleureuse et bouton « Note ta première vente » |
| **Erreur de compréhension** | « Je n'ai pas bien compris. Tu peux répéter ou écrire ? » Jamais de message technique |
| **Montant inhabituel** | « 1 200 000 FCFA, c'est correct ? » |
| **Doublon probable** | « Tu viens de noter la même chose. Garder les deux ? » |
| **IA indisponible ou limite atteinte** | Message simple et bascule vers la saisie manuelle |
| **Permission micro refusée** | Aide pas à pas et saisie texte |
| **Chargement** | Squelettes grisés |

---

## 8. Accessibilité

- Lecture vocale des confirmations (utile pour les personnes peu à l'aise à l'écrit).
- Taille de texte réglable.
- Libellés compatibles avec les lecteurs d'écran (`aria-label`, rôles, ordre de focus logique).
- Navigation possible d'une seule main.
- Mode **économie de données** : peu d'images, pas de vidéos, polices limitées.
- Contrastes élevés ; aucune information portée par la couleur seule.

---

## 9. Textes types (ton à respecter)

- Accueil : « Bonjour Awa ! Voici ta journée. »
- Capture : « Dis-moi ce que tu as vendu ou dépensé. »
- Confirmation : « J'ai noté : vente de 3 cartons de savon à 8 000 (24 000 au total). C'est correct ? »
- Bilan : « Cette semaine : ventes 310 000, dépenses 190 000, il te reste 120 000. Ta meilleure journée : samedi. »
- Erreur : « Je n'ai pas bien compris. Tu peux répéter ? »

Tous ces textes vivent dans `src/lib/i18n/fr.ts`.
