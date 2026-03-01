"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, phone: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await fetch(`${API}/api/auth/me`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            // 401 = not authenticated, expected for public pages — do NOT log
            if (error?.status !== 401 && error?.message !== 'Unauthorized') {
                console.error('Auth refresh error:', error);
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Login failed");
        }
        await refreshUser();
        router.push("/dashboard");
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
        const res = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, phone, password, role: "patient" }),
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Registration failed");
        }
        await login(email, password);
    };

    const logout = async () => {
        await fetch(`${API}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        }).catch(() => null);
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
