import { fr } from "@/lib/i18n/fr";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-title font-bold text-brand-900">{fr.nav.home}</h1>
    </div>
  );
}

