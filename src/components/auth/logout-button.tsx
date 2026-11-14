"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fr } from "@/lib/i18n/fr";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    setHasError(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setHasError(true);
        setIsSigningOut(false);
        return;
      }

      router.replace("/login");
    } catch {
      setHasError(true);
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {hasError ? (
        <p role="alert" className="text-caption text-danger">
          {fr.errors.generic}
        </p>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
      >
        {isSigningOut ? fr.auth.loggingOut : fr.auth.logout}
      </Button>
    </div>
  );
}
