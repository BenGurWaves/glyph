"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SubscriptionInfo = {
  plan: string;
  status: string;
  payment_method: string;
  is_pro: boolean;
  is_trial: boolean;
  is_expired: boolean;
  show_warning: boolean;
  days_until_expiry: number | null;
  expires_at: string | null;
  amount?: string;
  interval?: string;
  next_billing_date?: string;
  start_date?: string;
  card_brand?: string;
  card_last4?: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/user/subscription", {
        headers: { Authorization: `Bearer ${session?.access_token || ""}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCancel = async () => {
    if (!user?.id) return;
    setCancelLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/account/cancel", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token || ""}` },
    });
    const data = await res.json();

    if (res.ok) {
      setMessage("Subscription cancelled. You will retain Pro access until the end of your billing period.");
      setSubscription((prev) => prev ? { ...prev, status: "cancelled" } : prev);
    } else {
      setError(data.error || "Failed to cancel subscription.");
    }
    setCancelLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setDeleteLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${session?.access_token || ""}` },
    });
    const data = await res.json();

    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      setError(data.error || "Failed to delete account.");
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <><Nav /><main className="flex-1 pt-14"><div className="max-w-lg mx-auto px-6 pt-20 flex items-center gap-3">
        <span className="led led-active" /><span className="text-[13px] text-[var(--text-secondary)]">loading...</span>
      </div></main><Footer /></>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8">
            <Link href="/dashboard" className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline lowercase">&larr; dashboard</Link>

            <h1 className="text-[28px] font-medium lowercase tracking-tight">settings</h1>

            {/* Account info */}
            <div className="module p-5 flex flex-col gap-4">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">account</h2>
              <div className="flex flex-col gap-1">
                <span className="label">email</span>
                <span className="text-[14px]">{user?.email}</span>
              </div>
              {subscription && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="label">plan</span>
                    <div className="flex items-center gap-2">
                      <span className={`led ${subscription.status === "active" ? "led-active" : ""}`} />
                      <span className="text-[14px] lowercase">{subscription.plan} · {subscription.status}</span>
                    </div>
                  </div>
                  {subscription.is_pro && (
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="label">amount</span>
                        <span className="text-[14px]">{subscription.amount || "$3"}/{subscription.interval || "month"}</span>
                      </div>
                      {subscription.is_trial && subscription.expires_at && (
                        <div className="flex items-center gap-2">
                          <span className="label">trial ends</span>
                          <span className="text-[14px]">
                            {new Date(subscription.expires_at).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric",
                            })}
                            {subscription.days_until_expiry !== null && (
                              <span className="text-[var(--accent)] ml-1">
                                ({subscription.days_until_expiry} day{subscription.days_until_expiry !== 1 ? "s" : ""} left)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      {!subscription.is_trial && subscription.start_date && (
                        <div className="flex items-center gap-2">
                          <span className="label">started</span>
                          <span className="text-[14px]">{subscription.start_date}</span>
                        </div>
                      )}
                      {subscription.next_billing_date && subscription.status === "active" && !subscription.is_trial && (
                        <div className="flex items-center gap-2">
                          <span className="label">next payment</span>
                          <span className="text-[14px]">{subscription.next_billing_date}</span>
                        </div>
                      )}
                      {subscription.card_brand && subscription.card_last4 && (
                        <div className="flex items-center gap-2">
                          <span className="label">payment method</span>
                          <span className="text-[14px] capitalize">{subscription.card_brand} ···· {subscription.card_last4}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {/* Sign Out */}
              <div className="module p-5 flex flex-col gap-3">
                <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">session</h2>
                <button onClick={handleSignOut} className="keycap keycap-light keycap-sm self-start">sign out</button>
              </div>

              {/* Add Payment Method — for trial users */}
              {subscription && subscription.is_trial && subscription.show_warning && (
                <div className="module p-5 flex flex-col gap-3 border border-[var(--accent)]/20">
                  <h2 className="text-[11px] font-medium text-[var(--accent)] uppercase tracking-[0.15em]">keep your pro</h2>
                  <p className="text-[13px] text-[var(--text-secondary)]">
                    Your trial expires in <strong>{subscription.days_until_expiry} day{subscription.days_until_expiry !== 1 ? "s" : ""}</strong>.
                    Add a payment method now to avoid losing Pro features.
                  </p>
                  <Link href="/pricing" className="keycap keycap-accent keycap-sm no-underline self-start">
                    add payment method
                  </Link>
                </div>
              )}

              {/* Cancel Subscription */}
              {subscription && subscription.is_pro && subscription.status === "active" && subscription.payment_method === "stripe" && (
                <div className="module p-5 flex flex-col gap-3">
                  <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">billing</h2>
                  <p className="text-[13px] text-[var(--text-secondary)]">
                    Cancelling stops future charges. You keep Pro access until the end of your current billing period.
                  </p>
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="keycap keycap-light keycap-sm self-start"
                  >
                    {cancelLoading ? "cancelling..." : "cancel subscription"}
                  </button>
                </div>
              )}

              {/* Delete Account */}
              <div className="module p-5 flex flex-col gap-3 border border-[var(--accent)]/20">
                <h2 className="text-[11px] font-medium text-[var(--accent)] uppercase tracking-[0.15em]">danger zone</h2>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Permanently delete your account and all data. This cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="keycap keycap-light keycap-sm self-start text-[var(--accent)]"
                  >
                    delete account
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-[13px] text-[var(--accent)] font-medium">
                      Are you sure? All QR codes, analytics, and account data will be permanently erased.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="keycap keycap-accent keycap-sm"
                      >
                        {deleteLoading ? "deleting..." : "yes, delete everything"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleteLoading}
                        className="keycap keycap-light keycap-sm"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="module p-4 border-l-2 border-[var(--accent)]">
                <p className="text-[13px] text-[var(--text-primary)]">{message}</p>
              </div>
            )}
            {error && (
              <div className="module p-4 border-l-2 border-red-400">
                <p className="text-[13px] text-red-400">{error}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
