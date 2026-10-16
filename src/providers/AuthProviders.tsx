
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode,} from "react";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { supabaseAuthRepository } from "../repo/Supabase/SupabaseAuthRepository";


interface AuthContextValue {
  session: Session | null;
  authUser: AuthUser | null;
  loading: boolean;
  signInWithGoogle: (returnTo: string) => Promise<void>;
  signInWithMagicLink: (
    email: string,
    returnTo: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Restore an existing session when the app opens.
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        console.error("Failed to restore session:", error);
      }

      setSession(data.session);
      setLoading(false);
    });

    // Keep React state in sync with authentication changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;

      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (returnTo: string) => {
    await supabaseAuthRepository.signInWithGoogle(returnTo);
  }, []);

  const signInWithMagicLink = useCallback(
    async (email: string, returnTo: string) => {
      await supabaseAuthRepository.signInWithMagicLink(email, returnTo);
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabaseAuthRepository.signOut();
  }, []);

  const value: AuthContextValue = {
    session,
    authUser: session?.user ?? null,
    loading,
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
