import { NextResponse } from "next/server";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link`);
  }

  await ensureProfile(supabase);

  return NextResponse.redirect(`${origin}/`);
}
