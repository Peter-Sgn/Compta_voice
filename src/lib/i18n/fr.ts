/**
 * French translations for Comptavoix.
 * Follows guidelines from AGENTS.md and docs/DESIGN.md:
 * - Familiar and warm tone ("tutoiement", short phrases, no accounting jargon).
 * - Centralized interface texts to prevent hardcoded strings in components.
 */

export const fr = {
  appName: "Comptavoix",

  common: {
    currency: "FCFA",
    confirm: "Confirmer",
    cancel: "Annuler",
    validate: "Valider",
    validateAll: "Valider tout",
    redo: "Refaire",
    delete: "Supprimer",
    edit: "Modifier",
    save: "Enregistrer",
    back: "Retour",
    close: "Fermer",
    loading: "Chargement...",
    offline: "Hors ligne : tes opérations sont gardées",
    seeAll: "Voir tout",
  },

  nav: {
    home: "Accueil",
    journal: "Journal",
    capture: "Noter",
    bilans: "Bilans",
    profile: "Moi",
  },

  home: {
    greeting: (name: string) => `Bonjour ${name} ! Voici ta journée.`,
    todaySales: "Ventes du jour",
    todayExpenses: "Dépenses du jour",
    todayBalance: "Ce qui me reste",
    sold: "J'ai vendu",
    spent: "J'ai dépensé",
    thisWeek: "Cette semaine",
    recentOperations: "Dernières opérations",
    emptyDay: "Note ta première vente",
    streak: (days: number) => `${days} jour${days > 1 ? "s" : ""} de suite`,
    tipTitle: "Astuce du jour",
    tipMonday: "Tu vends moins le lundi.",
    bestDay: "Meilleur jour",
  },

  capture: {
    prompt: "Dis-moi ce que tu as vendu ou dépensé.",
    writeInstead: "Écrire plutôt",
    speakInstead: "Parler plutôt",
    inputPlaceholder: "Écris ce que tu as vendu ou dépensé...",
    listening: "Je t'écoute...",
    micPermissionDenied: "Permission micro refusée",
    micPermissionHelp:
      "Pour parler, autorise l'accès au micro dans les réglages de ton navigateur.",
    examplesTitle: "Exemples :",
    examples: [
      "J'ai vendu 3 cartons de savon à 8 000 chacun",
      "J'ai payé le transport 2 500",
      "Vente de riz 12 000",
    ],
  },

  confirmation: {
    title: "Vérifie ce que j'ai compris",
    summary: (details: string, total: string) =>
      `J'ai noté : ${details} (${total} au total). C'est correct ?`,
    toVerify: "À vérifier",
    readAloud: "Lire à voix haute",
    quantity: "Quantité",
    price: "Prix",
    total: "Total",
    missingPriceQuestion: "À quel prix ?",
    missingQuantityQuestion: "Quelle quantité ?",
    unusualAmountWarning: (amount: string) => `${amount}, c'est correct ?`,
    duplicateWarning: "Tu viens de noter la même chose. Garder les deux ?",
  },

  journal: {
    title: "Journal",
    filters: {
      all: "Tout",
      today: "Aujourd'hui",
      week: "Semaine",
      month: "Mois",
      sales: "Ventes",
      expenses: "Dépenses",
    },
    searchPlaceholder: "Rechercher une opération...",
    empty: "Aucune opération enregistrée pour le moment.",
    emptyFiltered: "Aucune opération trouvée pour ce filtre.",
    dayTotal: "Total du jour :",
    undoDelete: "Opération supprimée. Annuler (5s)",
  },

  bilans: {
    title: "Bilans",
    week: "Semaine",
    month: "Mois",
    sales: "Ventes",
    expenses: "Dépenses",
    netProfit: "Ce qui te reste",
    bestDay: (day: string) => `Ta meilleure journée : ${day}`,
    topProducts: "Produits les plus vendus",
    biggestExpenses: "Plus grosses dépenses",
    summaryFallback: (
      periodName: string,
      sales: string,
      expenses: string,
      remaining: string,
      bestDay: string
    ) =>
      `${periodName} : ventes ${sales}, dépenses ${expenses}, il te reste ${remaining}. Ta meilleure journée : ${bestDay}.`,
  },

  errors: {
    generic: "Une petite erreur est survenue. Réessaie dans un instant.",
    misunderstood: "Je n'ai pas bien compris. Tu peux répéter ou écrire ?",
    aiUnavailable:
      "Le service d'analyse vocale est temporairement indisponible. Tu peux entrer ton opération par écrit.",
    rateLimitReached:
      "Tu as atteint la limite de requêtes pour aujourd'hui. Tu peux continuer à noter par écrit.",
  },

  ui: {
    emptyTitle: "Rien par ici pour l'instant",
    emptyBody: "Note ta première vente pour commencer.",
    emptyAction: "Enregistrer une vente",
    retry: "Réessayer",
    toastUndo: "Annuler",
    offlineBanner: "Hors ligne : tes opérations sont gardées",
  },
} as const;

export type TranslationDictionary = typeof fr;
