"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (key: string, value: string) => setForm({ ...form, [key]: value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Register
            const regRes = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...form, role: "patient" }),
            });

            const regData = await regRes.json();

            if (!regRes.ok) {
                setError(regData.message || "Registration failed.");
                setLoading(false);
                return;
            }

            // Auto-login after registration
            const loginRes = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (loginRes.ok) {
                router.push("/dashboard");
            } else {
                // Registration succeeded, manual login needed
                router.push("/login");
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
                <h1 className="font-display text-4xl text-primary text-center">Create Account</h1>
                <p className="text-primary/50 text-center mt-2 font-sans">
                    Join the SmileCare experience.
                </p>

                {/* Error */}
                {error && (
                    <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            required
                            className="w-full border border-primary/20 rounded-xl px-4 py-3 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                            placeholder="Alex Sterling"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            required
                            className="w-full border border-primary/20 rounded-xl px-4 py-3 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                            placeholder="alex@smilecare.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Phone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            required
                            className="w-full border border-primary/20 rounded-xl px-4 py-3 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                            placeholder="+91 9876543210"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-primary/40 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => update("password", e.target.value)}
                                required
                                minLength={6}
                                className="w-full border border-primary/20 rounded-xl px-4 py-3 pr-12 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-primary/30"
                                placeholder="Min. 6 characters"
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
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-primary/40 font-sans">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
