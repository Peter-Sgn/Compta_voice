import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ensureProfile,
  getProfile,
  type Profile,
} from "@/lib/supabase/ensure-profile";

type UpsertCall = {
  values: unknown;
  options: unknown;
};

function createFakeClient({
  userId = "user-1" as string | null,
  upsertError = null as { message: string } | null,
  profile = null as Profile | null,
  selectError = null as { message: string } | null,
}: {
  userId?: string | null;
  upsertError?: { message: string } | null;
  profile?: Profile | null;
  selectError?: { message: string } | null;
} = {}) {
  const upsertCalls: UpsertCall[] = [];
  const getUser = vi.fn(async () => ({
    data: { user: userId ? { id: userId } : null },
    error: null,
  }));
  const upsert = vi.fn(async (values: unknown, options: unknown) => {
    upsertCalls.push({ values, options });
    return { data: null, error: upsertError };
  });
  const maybeSingle = vi.fn(async () => ({
    data: profile,
    error: selectError,
  }));
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ upsert, select }));

  const client = {
    auth: { getUser },
    from,
  } as unknown as SupabaseClient;

  return { client, getUser, upsert, upsertCalls, select, eq, maybeSingle, from };
}

describe("ensureProfile", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("inserts the profile with the user id, ignoring duplicates", async () => {
    const { client, upsertCalls } = createFakeClient({ userId: "abc-123" });

    await ensureProfile(client);

    expect(upsertCalls).toHaveLength(1);
    expect(upsertCalls[0]?.values).toEqual({ id: "abc-123" });
    expect(upsertCalls[0]?.options).toEqual({
      onConflict: "id",
      ignoreDuplicates: true,
    });
  });

  it("does nothing when there is no signed-in user", async () => {
    const { client, upsert, from } = createFakeClient({ userId: null });

    await ensureProfile(client);

    expect(from).not.toHaveBeenCalled();
    expect(upsert).not.toHaveBeenCalled();
  });

  it("does not throw when the insert fails", async () => {
    const { client } = createFakeClient({
      upsertError: { message: "rls denied" },
    });

    await expect(ensureProfile(client)).resolves.toBeUndefined();
  });

  it("does not throw when the client throws", async () => {
    const client = {
      auth: {
        getUser: vi.fn(async () => {
          throw new Error("network down");
        }),
      },
      from: vi.fn(),
    } as unknown as SupabaseClient;

    await expect(ensureProfile(client)).resolves.toBeUndefined();
  });
});

describe("getProfile", () => {
  const profile: Profile = {
    id: "user-1",
    display_name: null,
    business_name: null,
    business_type: null,
    language: "fr",
    currency: "XOF",
    reminder_time: null,
    created_at: "2026-11-16T00:00:00Z",
  };

  it("returns the profile of the signed-in user", async () => {
    const { client, eq } = createFakeClient({ profile });

    await expect(getProfile(client)).resolves.toEqual(profile);
    expect(eq).toHaveBeenCalledWith("id", "user-1");
  });

  it("returns null when there is no signed-in user", async () => {
    const { client, from } = createFakeClient({ userId: null });

    await expect(getProfile(client)).resolves.toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it("returns null when the profile does not exist or read fails", async () => {
    const { client } = createFakeClient({
      profile: null,
      selectError: { message: "not found" },
    });

    await expect(getProfile(client)).resolves.toBeNull();
  });
});
