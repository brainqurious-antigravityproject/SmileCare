"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noAccount, setNoAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNoAccount(false);
    setLoading(true);
    try {
      await login(email, password, redirectTo);
    } catch (err: any) {
      const msg: string = err.message || "";
      // Detect "no account" type errors from backend
      if (
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("no account") ||
        msg.toLowerCase().includes("does not exist") ||
        msg.toLowerCase().includes("invalid credentials")
      ) {
        setNoAccount(true);
        setError("No account found with these credentials.");
      } else {
        setError(msg || "Invalid credentials. Please try again.");
      }
      setLoading(false);
    }
  };

  const signupHref = `/signup${redirectTo !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`;

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
        <h1 className="text-2xl font-display font-bold text-primary mb-1">Welcome Back</h1>
        <p className="text-slate-500 text-sm mb-6">Premium dental experience awaits.</p>

        {/* Context message for payment redirect */}
        {redirectTo === "/payment" && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary font-medium">
            🔒 Please sign in to complete your payment
          </div>
        )}

        {/* No-account message with animated link */}
        {noAccount && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-semibold mb-1">Account not found</p>
            <p>
              You don&apos;t have an account yet.{" "}
              <Link
                href={signupHref}
                className="font-bold text-primary underline underline-offset-2 animate-pulse hover:animate-none hover:text-primary/80 transition-colors"
              >
                Create an account
              </Link>
              {" "}to get started.
            </p>
          </div>
        )}

        {/* Error (non no-account errors) */}
        {error && !noAccount && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Google & Apple login */}
        <div className="flex flex-col gap-3 mb-6">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert("Google login coming soon — set up NEXT_PUBLIC_GOOGLE_CLIENT_ID in your env."); }}
            className="flex items-center justify-center gap-3 w-full border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert("Apple login coming soon — set up Apple OAuth credentials."); }}
            className="flex items-center justify-center gap-3 w-full border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </a>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3.5 font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href={signupHref}
            className="font-bold text-primary hover:underline transition-all"
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
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
