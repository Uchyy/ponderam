
import { supabase } from "../../utils/supabase";
import type { AuthRepository } from "../AuthRepository";

export function getCallbackUrl(returnTo = "/lobby") {
  const baseUrl = import.meta.env.BASE_URL;
  const callbackUrl = new URL(
    `${baseUrl}auth/callback`,
    window.location.origin
  );

  callbackUrl.searchParams.set("returnTo", returnTo);

  return callbackUrl.toString();
}

export const supabaseAuthRepository: AuthRepository = {
 
  async signInWithGoogle(returnTo) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getCallbackUrl(returnTo),
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) throw error;
  },

  async signInWithMagicLink(email, returnTo) {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: getCallbackUrl(returnTo),
        shouldCreateUser: true,
      },
    });

    if (error) throw error;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },
};
