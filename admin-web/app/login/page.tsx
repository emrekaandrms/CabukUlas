"use client";

import { FormEvent, useMemo, useState } from "react";
import SessionGate from "@/components/session-gate";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/overview` : undefined,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("Magic link e-posta adresinize gönderildi.");
    }

    setLoading(false);
  };

  return (
    <SessionGate publicRoute>
      <div className="screenCenter">
        <div className="loginCard">
          <p className="eyebrow">CabukUlas</p>
          <h1>Admin girişi</h1>
          <p>
            İç operasyon paneline giriş yapmak için admin hesabınıza bağlı e-posta adresini
            kullanın.
          </p>

          <form className="stack" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="fieldFull">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@cabukulas.com"
                required
              />
            </div>
            <button className="primaryButton" type="submit" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Magic link gönder"}
            </button>
          </form>

          {message ? <p style={{ marginTop: 16, color: "var(--success)" }}>{message}</p> : null}
          {error ? <p style={{ marginTop: 16, color: "var(--danger)" }}>{error}</p> : null}
        </div>
      </div>
    </SessionGate>
  );
}
