"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((response) => {
        if (response.ok) router.replace("/nsdtheadmin/dashboard");
      })
      .catch(() => undefined);

  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials.");
        return;
      }

      const next = search.get("next");
      router.replace(next && next.startsWith("/nsdtheadmin/") ? next : "/nsdtheadmin/dashboard");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07070a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 p-7 md:p-9">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">Private control plane</p>
            <h1 className="text-xl font-display font-bold">NSD Creations Admin</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2" htmlFor="admin-username">
              Username (optional)
            </label>
            <input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-indigo-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2" htmlFor="admin-password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="w-4 h-4 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 py-3 outline-none focus:border-indigo-400 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3.5 font-semibold flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {busy ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-zinc-600">
          This area is protected with server-side sessions. Credentials are never stored in browser storage.
        </p>
      </div>
    </main>
  );
}
