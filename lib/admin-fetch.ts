"use client";

import { createClient } from "@/lib/supabase/client";

export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  const headers = new Headers(init.headers);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  return fetch(input, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  });
}
