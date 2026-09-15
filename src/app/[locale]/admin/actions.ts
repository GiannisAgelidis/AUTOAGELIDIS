"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createEphemeralClient } from "@/lib/supabase/ephemeral";
import { redirect } from "@/i18n/navigation";

export interface SignInState {
  error?: string;
  sent?: boolean;
}

async function getOrigin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");
  return `${proto}://${host}`;
}

/**
 * Two-factor login: a correct password only proves who's asking, it
 * doesn't grant a session. We verify it against a throwaway client (so no
 * cookies get set), then email a Supabase magic link — clicking it is what
 * actually establishes the session, on `/admin/login/confirm`.
 */
export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? "el");

  const verifier = createEphemeralClient();
  const { error: passwordError } = await verifier.auth.signInWithPassword({
    email,
    password,
  });
  await verifier.auth.signOut();

  if (passwordError) {
    return { error: "error" };
  }

  const origin = await getOrigin();
  const { error: otpError } = await verifier.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/${locale}/admin/login/confirm`,
    },
  });

  if (otpError) {
    return { error: otpError.status === 429 ? "rateLimited" : "sendError" };
  }

  return { sent: true };
}

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/admin/login", locale });
}
