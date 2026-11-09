"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { fr } from "@/lib/i18n/fr";

export function TabBar() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isJournalActive = pathname.startsWith("/journal");
  const isBilansActive = pathname.startsWith("/bilans");
  const isMoiActive = pathname.startsWith("/moi");

  const handleMicClick = () => {
    alert("Capture vocale à venir (T-022 / T-052)");
  };

  const navItemBase =
    "flex flex-1 flex-col items-center justify-center min-h-12 min-w-12 py-1 gap-1 transition-colors duration-200 motion-reduce:transition-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 rounded-button";

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface supports-[backdrop-filter]:bg-surface/72 supports-[backdrop-filter]:backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between px-2 h-16 relative">
        {/* 1. Accueil */}
        <Link
          href="/"
          className={`${navItemBase} ${
            isHomeActive ? "text-brand-700 font-semibold" : "text-text-muted hover:text-text font-medium"
          }`}
          aria-current={isHomeActive ? "page" : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isHomeActive ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-caption leading-none">{fr.nav.home}</span>
        </Link>

        {/* 2. Journal */}
        <Link
          href="/journal"
          className={`${navItemBase} ${
            isJournalActive ? "text-brand-700 font-semibold" : "text-text-muted hover:text-text font-medium"
          }`}
          aria-current={isJournalActive ? "page" : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isJournalActive ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
          <span className="text-caption leading-none">{fr.nav.journal}</span>
        </Link>

        {/* 3. Bouton micro central (72 px) */}
        <div className="flex-1 flex justify-center items-center">
          <button
            type="button"
            onClick={handleMicClick}
            aria-label={fr.nav.capture}
            className="w-18 h-18 -translate-y-4 rounded-full bg-accent-500 text-brand-900 shadow-mic flex items-center justify-center cursor-pointer transition-transform duration-150 motion-reduce:transition-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 select-none"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
        </div>

        {/* 4. Bilans */}
        <Link
          href="/bilans"
          className={`${navItemBase} ${
            isBilansActive ? "text-brand-700 font-semibold" : "text-text-muted hover:text-text font-medium"
          }`}
          aria-current={isBilansActive ? "page" : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isBilansActive ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span className="text-caption leading-none">{fr.nav.bilans}</span>
        </Link>

        {/* 5. Moi */}
        <Link
          href="/moi"
          className={`${navItemBase} ${
            isMoiActive ? "text-brand-700 font-semibold" : "text-text-muted hover:text-text font-medium"
          }`}
          aria-current={isMoiActive ? "page" : undefined}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isMoiActive ? 2.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-caption leading-none">{fr.nav.profile}</span>
        </Link>
      </div>
    </nav>
  );
}

