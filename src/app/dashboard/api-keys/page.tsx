"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ApiKey = {
  id: string;
  key_prefix: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
};

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let key = "glyph_";
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();
      if (sub?.plan !== "pro") { router.push("/pricing"); return; }

      const { data } = await supabase
        .from("api_keys")
        .select("id, key_prefix, name, created_at, last_used_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setKeys(data || []);
      setLoading(false);
    });
  }, [router]);

  const createKey = async () => {
    if (!userId) return;
    const key = generateApiKey();
    const hash = await hashKey(key);
    const prefix = key.slice(0, 12) + "...";

    const { error } = await supabase.from("api_keys").insert({
      user_id: userId,
      key_hash: hash,
      key_prefix: prefix,
      name: "default",
    });

    if (!error) {
      setNewKey(key);
      const { data } = await supabase
        .from("api_keys")
        .select("id, key_prefix, name, created_at, last_used_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setKeys(data || []);
    }
  };

  const deleteKey = async (id: string) => {
    await supabase.from("api_keys").delete().eq("id", id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
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
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-6 stagger">
            <Link href="/dashboard" className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline lowercase">&larr; dashboard</Link>

            <h1 className="text-[28px] font-medium lowercase tracking-tight">api keys</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">
              Use API keys to generate QR codes and retrieve analytics programmatically.
            </p>

            {/* New key warning */}
            {newKey && (
              <div className="module p-4 border-l-2 border-[var(--accent)] animate-in">
                <p className="text-[13px] font-medium mb-2">Copy your API key now — it will not be shown again.</p>
                <div className="module-recessed p-3">
                  <code className="font-mono text-[12px] select-all break-all">{newKey}</code>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(newKey); }}
                  className="keycap keycap-light keycap-sm mt-3"
                >
                  copy
                </button>
              </div>
            )}

            <button onClick={createKey} className="keycap keycap-accent keycap-md self-start">
              generate new key
            </button>

            {/* Key list */}
            {keys.length > 0 && (
              <div className="flex flex-col gap-3">
                {keys.map((k) => (
                  <div key={k.id} className="module p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[13px]">{k.key_prefix}</span>
                      <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                        created {new Date(k.created_at).toLocaleDateString()}
                        {k.last_used_at && ` · last used ${new Date(k.last_used_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <button onClick={() => deleteKey(k.id)} className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--accent)]">
                      revoke
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* API Docs */}
            <div className="module p-6 flex flex-col gap-4">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">api reference</h2>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[13px] font-medium">create qr code</span>
                  <div className="module-recessed p-3 mt-2">
                    <pre className="font-mono text-[11px] text-[var(--text-secondary)] whitespace-pre-wrap">{`POST https://glyph.calyvent.com/api/v1/qr
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "My Link",
  "dynamic": true
}`}</pre>
                  </div>
                </div>

                <div>
                  <span className="text-[13px] font-medium">response</span>
                  <div className="module-recessed p-3 mt-2">
                    <pre className="font-mono text-[11px] text-[var(--text-secondary)] whitespace-pre-wrap">{`{
  "id": "uuid",
  "short_code": "abc1234",
  "tracking_url": "https://glyph.calyvent.com/g/abc1234",
  "destination_url": "https://example.com"
}`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
