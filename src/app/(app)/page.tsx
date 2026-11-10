/**
 * PAGE TEMPORAIRE - ACCUEIL STATIQUE (T-024)
 *
 * Cette page présente une version statique de l'écran d'accueil avec des données
 * fictives pour valider le rendu visuel, la hiérarchie d'information, les tokens
 * de couleur, et le contraste en plein soleil (docs/DESIGN.md).
 *
 * Animations ajoutées (T-024, suite) :
 * - Compteur animé (AnimatedAmount, composant client) sur les 3 montants de l'en-tête.
 * - Apparition en cascade (CSS slide-up) sur chaque bloc avec animation-delay.
 * - Barres SVG qui grandissent depuis le bas (CSS bar-grow) avec décalage par index.
 * - prefers-reduced-motion : désactiver toutes les animations via CSS.
 *
 * Elle sera remplacée par l'accueil réel connecté aux données et au moteur de calcul
 * lors de la tâche T-080.
 */

import Link from "next/link";
import { fr } from "@/lib/i18n/fr";
import { mockHomeData, type MockOperation } from "@/lib/fixtures/home";
import { Card } from "@/components/ui";
import { AnimatedAmount } from "@/components/ui/animated-amount";

function OperationIcon({ type }: { type: MockOperation["icon"] }) {
  const iconProps = {
    className: "w-5 h-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "soap":
      return (
        <svg {...iconProps}>
          <rect x="3" y="8" width="18" height="12" rx="4" />
          <path d="M7 8V6a3 3 0 0 1 6 0v2" />
          <circle cx="16" cy="14" r="1.5" />
        </svg>
      );
    case "truck":
      return (
        <svg {...iconProps}>
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10Z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "rice":
      return (
        <svg {...iconProps}>
          <path d="M6 2h12a2 2 0 0 1 2 2v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4a2 2 0 0 1 2-2Z" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </svg>
      );
    case "phone":
      return (
        <svg {...iconProps}>
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case "package":
    default:
      return (
        <svg {...iconProps}>
          <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" x2="12" y1="22" y2="12" />
        </svg>
      );
  }
}

export default function HomePage() {
  const {
    userName,
    currentDate,
    balance,
    sales,
    expenses,
    streakDays,
    weeklyBars,
    recentOperations,
  } = mockHomeData;

  // Calcul d'échelle pour l'histogramme SVG hebdomadaire
  const maxWeeklyAmount = 50000;
  const chartHeight = 70;
  const chartBaseline = 90;

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* 1. Bande d'en-tête — délai 0 ms */}
      <header
        className="bg-gradient-to-b from-brand-900 to-brand-700 rounded-b-[24px] px-4 pt-6 pb-6 shadow-soft text-surface animate-slide-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-caption font-medium text-brand-100">
            {currentDate}
          </span>
          <h1 className="text-title font-bold text-surface tracking-tight">
            {fr.home.greeting(userName)}
          </h1>
        </div>

        {/* Carte « verre » (glass-on-dark : fond blanc 14 %, bordure blanche 28 %, flou 12 px)
            — délai 80 ms (après l'en-tête) */}
        <div
          className="mt-5 rounded-card p-4 border border-white/28 bg-brand-900 supports-[backdrop-filter]:bg-white/14 supports-[backdrop-filter]:backdrop-blur-[12px] shadow-soft animate-slide-up"
          aria-label={fr.home.todayBalance}
          style={{ animationDelay: "80ms" }}
        >
          {/* Chiffre héros animé : Ce qui me reste */}
          <div className="flex flex-col gap-1">
            <span className="text-caption font-medium text-brand-100">
              {fr.home.todayBalance}
            </span>
            <AnimatedAmount
              amount={balance}
              duration={700}
              className="text-hero font-bold !text-surface"
              ariaLabel={fr.home.todayBalance}
            />
          </div>

          {/* Deux sous-blocs côte à côte séparés par un filet fin */}
          <div className="grid grid-cols-2 divide-x divide-white/20 border-t border-white/20 mt-4 pt-3">
            {/* Ventes */}
            <div className="pr-3 flex flex-col gap-0.5">
              <span className="text-caption font-medium text-brand-100">
                {fr.home.sold}
              </span>
              {/* Icône ↑ + fixe ; seul le chiffre est animé */}
              <span
                className="inline-flex items-center gap-1.5 text-body font-bold text-surface tabular-nums"
                aria-label={fr.home.sold}
              >
                <span aria-hidden="true" className="inline-flex items-center gap-0.5">
                  <svg
                    className="w-[1em] h-[1em] inline-block shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  <span>+</span>
                </span>
                <AnimatedAmount
                  amount={sales}
                  duration={700}
                  className="font-bold text-surface"
                />
              </span>
            </div>

            {/* Dépenses */}
            <div className="pl-3 flex flex-col gap-0.5">
              <span className="text-caption font-medium text-brand-100">
                {fr.home.spent}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-body font-bold text-surface tabular-nums"
                aria-label={fr.home.spent}
              >
                <span aria-hidden="true" className="inline-flex items-center gap-0.5">
                  <svg
                    className="w-[1em] h-[1em] inline-block shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                  <span>−</span>
                </span>
                <AnimatedAmount
                  amount={expenses}
                  duration={700}
                  className="font-bold text-surface"
                />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Section « Cette semaine » — délai 160 ms */}
      <section
        className="px-4 flex flex-col gap-3 animate-slide-up"
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-title font-bold text-text">
            {fr.home.thisWeek}
          </h2>
          {/* Pastille "5 jours de suite" */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 text-brand-900 text-caption font-bold border border-brand-700/20 shadow-soft">
            <span aria-hidden="true">🔥</span>
            <span>{fr.home.streak(streakDays)}</span>
          </span>
        </div>

        {/* Carte pleine avec barres par jour en SVG simple */}
        <Card variant="default" className="p-4">
          <div className="w-full">
            <svg
              viewBox="0 0 280 120"
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label={fr.home.thisWeek}
            >
              {weeklyBars.map((bar, index) => {
                const colWidth = 280 / weeklyBars.length;
                const barWidth = 18;
                const barX = index * colWidth + (colWidth - barWidth) / 2;
                const barHeight = Math.max(
                  8,
                  Math.round((bar.amount / maxWeeklyAmount) * chartHeight)
                );
                const barY = chartBaseline - barHeight;
                const textX = index * colWidth + colWidth / 2;
                // Délai décalé par barre : 200 ms + 40 ms * index
                const barDelay = `${200 + index * 40}ms`;

                return (
                  <g key={bar.day}>
                    {/* Indicateur meilleur jour */}
                    {bar.isBest && (
                      <text
                        x={textX}
                        y={barY - 8}
                        textAnchor="middle"
                        className="fill-accent-500 font-bold text-[10px]"
                      >
                        ★
                      </text>
                    )}

                    {/* Barre du jour — animation bar-grow depuis le bas */}
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      ry="4"
                      className={`animate-bar-grow ${
                        bar.isBest
                          ? "fill-accent-500"
                          : "fill-brand-100 hover:fill-brand-700/30 transition-colors"
                      }`}
                      style={{ animationDelay: barDelay }}
                    />

                    {/* Libellé du jour (L, M, M, J, V, S, D) */}
                    <text
                      x={textX}
                      y={chartBaseline + 18}
                      textAnchor="middle"
                      className={
                        bar.isBest
                          ? "fill-brand-900 font-bold text-[13px]"
                          : "fill-text-muted font-medium text-[13px]"
                      }
                    >
                      {bar.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>
      </section>

      {/* 3. Section « Dernières opérations » — délai 240 ms */}
      <section
        className="px-4 flex flex-col gap-3 animate-slide-up"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-title font-bold text-text">
            {fr.home.recentOperations}
          </h2>
          <Link
            href="/journal"
            className="text-body font-semibold text-brand-700 hover:underline min-h-12 inline-flex items-center"
          >
            {fr.common.seeAll}
          </Link>
        </div>

        {/* Bloc plein avec 5 lignes séparées par des filets fins */}
        <Card variant="default" className="p-0 overflow-hidden divide-y divide-border">
          {recentOperations.map((op) => (
            <div
              key={op.id}
              className="flex items-center justify-between p-3.5 sm:p-4 min-h-12 hover:bg-bg/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    op.kind === "sale"
                      ? "bg-brand-100 text-brand-700"
                      : "bg-accent-100 text-expense"
                  }`}
                >
                  <OperationIcon type={op.icon} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-body font-semibold text-text truncate">
                    {op.label}
                  </span>
                  <span className="text-caption text-text-muted truncate">
                    {op.detail}
                  </span>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {/* AmountText statique pour les opérations (pas de compteur) */}
                <span
                  className={`inline-flex items-center gap-1.5 tabular-nums text-body font-semibold ${
                    op.kind === "sale" ? "text-sale" : "text-expense"
                  }`}
                  aria-label={`${op.kind === "sale" ? "+" : "−"} ${op.amount} FCFA`}
                >
                  <span aria-hidden="true">
                    {op.kind === "sale" ? "↑ +" : "↓ −"}
                  </span>
                  <span className="tabular-nums">
                    {/* Réutilise la même logique que AmountText */}
                    {op.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")}{"\u00A0"}FCFA
                  </span>
                </span>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* 4. Carte d'astuce en tint-soft — délai 320 ms */}
      <section
        className="px-4 animate-slide-up"
        style={{ animationDelay: "320ms" }}
      >
        <aside
          className="rounded-card p-4 bg-brand-100/60 border border-brand-700/20 text-brand-900 shadow-soft flex items-start gap-3"
          aria-label={fr.home.tipTitle}
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 text-brand-700 mt-0.5">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-caption font-bold uppercase tracking-wider text-brand-700">
              {fr.home.tipTitle}
            </span>
            <p className="text-body font-semibold text-brand-900">
              {fr.home.tipMonday}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
