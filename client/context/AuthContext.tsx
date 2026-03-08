"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; email?: string; password?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const router = useRouter();

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || data.error || "Login failed";

        // Check if error is "User not found" - prompt to create account
        if (msg.toLowerCase().includes("user not found") || msg.toLowerCase().includes("no user") || msg.toLowerCase().includes("does not exist")) {
          toastError(
            <div>
              User not found. Please{" "}
              <span
                onClick={() => router.push('/register')}
                className="underline cursor-pointer font-bold animate-pulse hover:text-blue-400"
              >
                create an account
              </span>{" "}
              first.
            </div>
          );
        } else {
          toastError(msg);
        }
        throw new Error(msg);
      }

      setUser(data.user);
      success("Login successful!");

      // Clear any pre-fill credentials
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('smilecare_prefill');
      }

      // Handle redirect logic
      if (redirectTo && redirectTo !== '/dashboard') {
        router.push(redirectTo);
      } else if (typeof window !== 'undefined') {
        // Check if user came from homepage
        try {
          const ref = document.referrer;
          if (ref) {
            const refUrl = new URL(ref);
            if (refUrl.origin === window.location.origin && refUrl.pathname === '/') {
              router.push('/');
              return;
            }
          }
        } catch { /* ignore invalid referrer */ }
        router.push(redirectTo || "/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      // Error already shown in toast above
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; email?: string; password?: string }> => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || data.error || "Registration failed";
        toastError(msg);
        throw new Error(msg);
      }

      success("Registration successful! Redirecting to login...");

      // Store credentials for auto-fill on login page via sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('smilecare_prefill', JSON.stringify({ email, password }));
      }

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

      return { success: true, email, password };
    } catch (err: unknown) {
      console.error("Registration error:", err);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('smilecare_prefill');
      }
      success("Logged out successfully!");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toastError("Logout failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Google login error:", err);
      toastError("Google login failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
