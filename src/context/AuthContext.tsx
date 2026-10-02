import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants/config";
import { authService } from "../services/authService";
import { AuthSession, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: AuthSession) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(STORAGE_KEYS.token);
        const storedUser = await SecureStore.getItemAsync(STORAGE_KEYS.user);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn("Failed to restore session", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function persistSession(session: AuthSession) {
    await SecureStore.setItemAsync(STORAGE_KEYS.token, session.token);
    await SecureStore.setItemAsync(
      STORAGE_KEYS.user,
      JSON.stringify(session.user),
    );
    setUser(session.user);
    setToken(session.token);
  }

  async function signIn(email: string, password: string) {
    const session = await authService.login(email, password);
    await persistSession(session);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.token);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.user);
    setUser(null);
    setToken(null);
  }

  async function setSession(session: AuthSession) {
    await persistSession(session);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        signIn,
        signOut,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
