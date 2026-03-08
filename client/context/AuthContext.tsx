"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

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
  loginWithApple: () => Promise<void>;
  setLoginCredentials: (email: string, password: string) => void;
  getLoginCredentials: () => { email: string; password: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: toastError } = useToast();
  const router = useRouter();
  
  // Store for pre-filled login credentials after registration
  const [loginCredentials, setLoginCredentialsState] = useState<{ email: string; password: string } | null>(null);

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

  const setLoginCredentials = (email: string, password: string) => {
    setLoginCredentialsState({ email, password });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingLoginCredentials', JSON.stringify({ email, password }));
    }
  };

  const getLoginCredentials = () => {
    if (loginCredentials) return loginCredentials;
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pendingLoginCredentials');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return null;
  };

  const clearLoginCredentials = () => {
    setLoginCredentialsState(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pendingLoginCredentials');
    }
  };

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
      clearLoginCredentials();

      // Handle redirect logic
      if (redirectTo) {
        if (redirectTo === '/appointment') {
          router.push('/dashboard');
        } else {
          router.push(redirectTo);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
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
      
      // Store credentials for auto-fill on login page
      setLoginCredentials(email, password);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

      return { success: true, email, password };
    } catch (err: any) {
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
      clearLoginCredentials();
      success("Logged out successfully!");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toastError("Logout failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = `${API}/api/auth/google`;
    } catch (err) {
      console.error("Google login error:", err);
      toastError("Google login failed");
    }
  };

  const loginWithApple = async () => {
    try {
      // Redirect to backend Apple OAuth endpoint
      window.location.href = `${API}/api/auth/apple`;
    } catch (err) {
      console.error("Apple login error:", err);
      toastError("Apple login failed");
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
        loginWithApple,
        setLoginCredentials,
        getLoginCredentials,
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
