"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { Suspense } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to original destination (payment, dashboard, etc.)
                router.push(redirectTo);
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch {
            setError("Unable to connect to server. Please try again later.");
        }

        setLoading(false);
    };

    return (
        <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-light px-4 py-16">
            <div className="max-w-md w-full bg-pearl rounded-2xl shadow-xl border border-primary/10 p-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-3xl font-display font-bold text-primary">
                        SmileCare<span className="text-accent-gold">.</span>
                    </Link>
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl text-primary text-center">Welcome Back</h1>
                <p className="text-primary/50 text-center mt-2 font-sans">
                    Premium dental experience awaits.
                </p>

                {/* Context message for payment redirect */}
                {redirectTo === "/payment" && (
                    <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-xl text-primary text-sm font-medium text-center">
                        🔒 Please sign in to complete your payment
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-primary/20 rounded-xl px-4 py-3 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                            placeholder="alex@smilecare.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-primary/20 rounded-xl px-4 py-3 pr-12 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary"
                            >
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white rounded-xl py-3 font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-primary/40 font-sans">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={`/signup${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="text-primary font-semibold hover:underline"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </main>
        }>
            <LoginForm />
        </Suspense>
    );
}
