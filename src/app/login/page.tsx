import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";
import { fr } from "@/lib/i18n/fr";

export const metadata: Metadata = {
  title: fr.auth.title,
};

type LoginSearchParams = Promise<{
  error?: string | string[];
}>;

export default function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  return (
    <main className="min-h-dvh w-full flex items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-md">
        <Suspense fallback={<Skeleton className="h-72 w-full rounded-card" />}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: LoginSearchParams;
}) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return <LoginForm hasLinkError={error === "link"} />;
}
