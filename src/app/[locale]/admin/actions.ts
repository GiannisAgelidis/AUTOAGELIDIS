"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";

export interface SignInState {
  error?: string;
}

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? "el");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "invalid" };
  }

  return redirect({ href: "/admin", locale });
}

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/admin/login", locale });
}
