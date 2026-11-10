/**
 * DONNÉES FICTIVES TEMPORAIRES - ACCUEIL STATIQUE (T-024)
 *
 * Ces données sont exclusivement destinées à valider le rendu visuel de
 * la maquette d'accueil (src/app/(app)/page.tsx) avant l'implémentation
 * réelle de la base de données et des calculs métier (T-080).
 *
 * Fichier temporaire à remplacer à la tâche T-080.
 */

export interface MockOperation {
  id: string;
  kind: "sale" | "expense";
  label: string;
  detail: string;
  amount: number;
  icon: "soap" | "truck" | "rice" | "phone" | "package";
}

export interface MockDayBar {
  day: string;
  shortLabel: string;
  amount: number;
  isBest?: boolean;
}

export interface MockHomeData {
  userName: string;
  currentDate: string;
  balance: number;
  sales: number;
  expenses: number;
  streakDays: number;
  tip: string;
  weeklyBars: MockDayBar[];
  recentOperations: MockOperation[];
}

export const mockHomeData: MockHomeData = {
  userName: "Awa",
  currentDate: "Lundi 9 novembre",
  balance: 34500,
  sales: 48000,
  expenses: 13500,
  streakDays: 5,
  tip: "Tu vends moins le lundi.",
  weeklyBars: [
    { day: "Lundi", shortLabel: "L", amount: 14000 },
    { day: "Mardi", shortLabel: "M", amount: 28000 },
    { day: "Mercredi", shortLabel: "M", amount: 21500 },
    { day: "Jeudi", shortLabel: "J", amount: 33000 },
    { day: "Vendredi", shortLabel: "V", amount: 39500 },
    { day: "Samedi", shortLabel: "S", amount: 48000, isBest: true },
    { day: "Dimanche", shortLabel: "D", amount: 16500 },
  ],
  recentOperations: [
    {
      id: "op-1",
      kind: "sale",
      label: "Savon de Marseille",
      detail: "3 cartons × 8 000 FCFA",
      amount: 24000,
      icon: "soap",
    },
    {
      id: "op-2",
      kind: "expense",
      label: "Transport marchandise",
      detail: "1 course de livraison",
      amount: 2500,
      icon: "truck",
    },
    {
      id: "op-3",
      kind: "sale",
      label: "Sac de riz 25 kg",
      detail: "1 sac × 17 500 FCFA",
      amount: 17500,
      icon: "rice",
    },
    {
      id: "op-4",
      kind: "expense",
      label: "Crédit téléphonique",
      detail: "Recharge Orange / MTN",
      amount: 1000,
      icon: "phone",
    },
    {
      id: "op-5",
      kind: "sale",
      label: "Savon liquide",
      detail: "13 flacons × 500 FCFA",
      amount: 6500,
      icon: "package",
    },
  ],
};

