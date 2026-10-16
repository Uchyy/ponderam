
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode,} from "react";

import { useAuth } from "./AuthProviders";
import type { UserProfile } from "../repo/UserRepository";
import { userRepository } from "../repo";


interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { authUser, loading: authLoading } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (authLoading) return;

    if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
        const profile = await userRepository.getById(authUser.id);
        setUser(profile);
    } catch (error) {
        console.error("Could not refresh user profile:", error);
        throw error;
    } finally {
        setLoading(false);
    }
    }, [authUser, authLoading]);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      if (authLoading) return;

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const profile = await userRepository.getById(authUser.id);

        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        console.error("Could not load user profile:", error);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
