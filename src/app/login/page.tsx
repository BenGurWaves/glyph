"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email for a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-sm mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-6 stagger">
            <h1 className="text-[28px] font-medium leading-tight tracking-tight lowercase">
              {isSignUp ? "create account" : "sign in"}
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)]">
              {isSignUp
                ? "Create an account to save QR codes and access analytics."
                : "Sign in to manage your QR codes and view analytics."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="label">email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="hw-input"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="label">password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="hw-input"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="module p-3 border-l-2 border-[var(--accent)]">
                  <p className="text-[12px] text-[var(--accent)]">{error}</p>
                </div>
              )}

              {message && (
                <div className="module p-3 border-l-2 border-green-600">
                  <p className="text-[12px] text-green-700">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="keycap keycap-accent keycap-lg disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : isSignUp
                    ? "create account"
                    : "sign in"}
              </button>
            </form>

            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] lowercase transition-colors"
            >
              {isSignUp
                ? "already have an account? sign in"
                : "need an account? sign up"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
