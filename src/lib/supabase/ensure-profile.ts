import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  display_name: string | null;
  business_name: string | null;
  business_type: string | null;
  language: string;
  currency: string;
  reminder_time: string | null;
  created_at: string;
};

async function getSessionUserId(
  supabase: SupabaseClient,
): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user?.id ?? null;
}

/**
 * Creates the profiles row for the signed-in user on first login.
 * Uses insert-or-ignore so an existing profile is never modified.
 * Never throws: login must succeed even if profile creation fails.
 * No personal data is written to logs.
 */
export async function ensureProfile(supabase: SupabaseClient): Promise<void> {
  try {
    const userId = await getSessionUserId(supabase);
    if (!userId) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(
        { id: userId },
        { onConflict: "id", ignoreDuplicates: true },
      );

    if (error) {
      console.error("ensureProfile: profile creation failed");
    }
  } catch {
    console.error("ensureProfile: profile creation failed");
  }
}

/** Reads the profile of the signed-in user, or null if absent/unauthorized. */
export async function getProfile(
  supabase: SupabaseClient,
): Promise<Profile | null> {
  const userId = await getSessionUserId(supabase);
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Profile;
}
