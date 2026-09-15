import { createClient } from "@/lib/supabase/client";

/**
 * Supabase's invite/recovery/magic-link redirects can land with either a
 * PKCE `?code=` query param or a legacy `#access_token=&refresh_token=`
 * hash, depending on project auth settings. supabase-js's automatic
 * detectSessionInUrl doesn't reliably win the race against the page's own
 * render, so both cases are exchanged for a session explicitly here.
 */
export async function establishSessionFromUrl(): Promise<boolean> {
  const supabase = createClient();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    window.history.replaceState({}, "", url.pathname);
    return !error;
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    window.history.replaceState({}, "", url.pathname);
    return !error;
  }

  // No tokens in the URL — maybe a session already exists (e.g. page refresh).
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}
