/**
 * PAGE TEMPORAIRE - DÉMONSTRATION COMPOSANTS UI (T-020)
 *
 * Cette page sert exclusivement à tester et visualiser les composants de base
 * (Button, Card, Chip, AmountText, Skeleton) et leurs différents états
 * en respectant les tokens de docs/DESIGN.md et les textes de fr.ts.
 *
 * Page temporaire destinée à être supprimée ou conservée en dev.
 */

"use client";

import { useState } from "react";
import { fr } from "@/lib/i18n/fr";
import {
  Button,
  Card,
  Chip,
  AmountText,
  Skeleton,
} from "@/components/ui";

export default function DemoUiPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-8 font-sans">
      <main className="max-w-md mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-1 border-b border-border pb-4">
          <span className="text-caption font-bold uppercase tracking-wider text-accent-500">
            {fr.appName} • T-020
          </span>
          <h1 className="text-title font-bold text-brand-900">
            {fr.confirmation.title}
          </h1>
        </header>

        {/* 1. Boutons */}
        <section className="flex flex-col gap-4">
          <h2 className="text-body font-bold text-brand-900">
            {fr.common.validate} / {fr.common.cancel} / {fr.common.delete} (48 px)
          </h2>
          <div className="flex flex-col gap-3">
            <Button variant="primary" fullWidth>
              {fr.common.validate} (Primaire)
            </Button>
            <Button variant="secondary" fullWidth>
              {fr.common.cancel} (Secondaire)
            </Button>
            <Button variant="danger" fullWidth>
              {fr.common.delete} (Danger)
            </Button>
            <Button variant="primary" disabled fullWidth>
              {fr.common.validate} ({fr.common.loading})
            </Button>
          </div>
        </section>

        {/* 2. Puces (Chips) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-body font-bold text-brand-900">
            {fr.journal.title} ({fr.journal.filters.all})
          </h2>
          <div className="flex flex-wrap gap-2">
            <Chip
              selected={selectedFilter === "all"}
              onClick={() => setSelectedFilter("all")}
            >
              {fr.journal.filters.all}
            </Chip>
            <Chip
              selected={selectedFilter === "today"}
              onClick={() => setSelectedFilter("today")}
            >
              {fr.journal.filters.today}
            </Chip>
            <Chip
              selected={selectedFilter === "sales"}
              onClick={() => setSelectedFilter("sales")}
            >
              {fr.journal.filters.sales}
            </Chip>
            <Chip
              selected={selectedFilter === "expenses"}
              onClick={() => setSelectedFilter("expenses")}
            >
              {fr.journal.filters.expenses}
            </Chip>
            <Chip disabled>
              {fr.journal.filters.month}
            </Chip>
          </div>
        </section>

        {/* 3. Montants (AmountText) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-body font-bold text-brand-900">
            {fr.home.todayBalance}
          </h2>
          <div className="flex flex-col gap-3 bg-surface p-4 rounded-card border border-border shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-caption text-text-muted">
                {fr.home.todaySales}
              </span>
              <AmountText amount={12000} kind="sale" size="title" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-caption text-text-muted">
                {fr.home.todayExpenses}
              </span>
              <AmountText amount={2500} kind="expense" size="title" />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-caption text-text-muted">
                {fr.confirmation.total}
              </span>
              <AmountText amount={9500} kind="neutral" size="hero" />
            </div>
          </div>
        </section>

        {/* 4. Cartes (Cards) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-body font-bold text-brand-900">
            {fr.confirmation.title}
          </h2>
          <div className="flex flex-col gap-3">
            <Card variant="default">
              <p className="font-semibold">{fr.home.todayBalance}</p>
              <AmountText amount={120000} kind="neutral" size="title" />
            </Card>

            <Card variant="positive">
              <p className="font-semibold text-brand-900">{fr.home.todaySales}</p>
              <AmountText amount={35000} kind="sale" size="body" />
            </Card>

            <Card variant="warning">
              <p className="font-semibold text-accent-500">
                {fr.confirmation.toVerify}
              </p>
              <AmountText amount={5000} kind="expense" size="body" />
            </Card>
          </div>
        </section>

        {/* 5. Squelettes (Skeleton) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-body font-bold text-brand-900">
            {fr.common.loading}
          </h2>
          <div className="flex flex-col gap-3 bg-surface p-4 rounded-card border border-border shadow-soft">
            <div className="flex items-center gap-3">
              <Skeleton rounded="full" className="w-12 h-12 shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton rounded="card" className="h-20 w-full mt-2" />
            <Skeleton rounded="button" className="h-12 w-full mt-2" />
          </div>
        </section>
      </main>
    </div>
  );
}

