import { LogoutButton } from "@/components/auth/logout-button";
import { Card } from "@/components/ui/card";
import { fr } from "@/lib/i18n/fr";

export default function MoiPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-title font-bold text-brand-900">{fr.nav.profile}</h1>
      <Card>
        <LogoutButton />
      </Card>
    </div>
  );
}

