"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAuthErrorKind, loginEmailSchema, type AuthErrorKind } from "@/lib/auth";
import { fr } from "@/lib/i18n/fr";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ hasLinkError = false }: { hasLinkError?: boolean }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<AuthErrorKind | null>(null);

  async function sendLink(targetEmail: string) {
    const parsed = loginEmailSchema.safeParse(targetEmail.trim());

    if (!parsed.success) {
      setFieldError(fr.auth.emailInvalid);
      setFormError(null);
      setIsSent(false);
      return;
    }

    setFieldError(null);
    setFormError(null);
    setIsSending(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: parsed.data,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFormError(getAuthErrorKind(error));
        setIsSent(false);
        return;
      }

      setIsSent(true);
    } catch {
      setFormError("generic");
      setIsSent(false);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendLink(email);
  }

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-title font-bold text-brand-900">{fr.auth.title}</h1>
        <p className="text-body text-text-muted">{fr.auth.subtitle}</p>
      </div>

      {hasLinkError && !isSent ? (
        <p role="alert" className="text-body text-danger">
          {fr.auth.linkExpired}
        </p>
      ) : null}

      {formError ? (
        <p role="alert" className="text-body text-danger">
          {formError === "rateLimit" ? fr.auth.rateLimit : fr.errors.generic}
        </p>
      ) : null}

      {isSent ? (
        <div className="flex flex-col gap-4" aria-live="polite">
          <div className="flex items-start gap-3 rounded-card bg-brand-100 p-4 text-brand-900">
            <svg
              className="w-6 h-6 shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <p className="text-body font-semibold">{fr.auth.sentMessage}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={isSending}
              onClick={() => void sendLink(email)}
            >
              {isSending ? fr.auth.sending : fr.auth.resend}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsSent(false);
                setFormError(null);
                setFieldError(null);
              }}
            >
              {fr.auth.changeEmail}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-body font-semibold text-text">
              {fr.auth.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={fr.auth.emailPlaceholder}
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? "email-error" : undefined}
              className="min-h-12 w-full rounded-button border border-border bg-surface px-4 text-body text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:opacity-50"
            />
            {fieldError ? (
              <p id="email-error" role="alert" className="text-caption text-danger">
                {fieldError}
              </p>
            ) : null}
          </div>

          <Button type="submit" fullWidth disabled={isSending}>
            {isSending ? fr.auth.sending : fr.auth.sendLink}
          </Button>
        </form>
      )}
    </Card>
  );
}
