"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ComptePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) setMessage(error.message);
      else setMessage("Compte créé. Vérifie ta boîte mail si une confirmation est demandée, puis connecte-toi.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <p className="text-sm text-inkFaint">Chargement…</p>;

  if (user) {
    return (
      <div>
        <h1 className="font-display text-xl font-bold mb-1">Compte</h1>
        <p className="text-sm text-inkSoft mb-5">Votre profil, vos achats, vos ventes.</p>

        <div className="rounded-xl p-4 mb-4 bg-surface border border-line">
          <p className="text-sm font-semibold">{user.email}</p>
          <p className="text-xs text-inkFaint mt-1">Connecté</p>
        </div>

        <button
          onClick={logout}
          className="w-full rounded-lg py-2.5 text-sm font-semibold border border-line text-inkSoft"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold mb-1">Compte</h1>
      <p className="text-sm text-inkSoft mb-5">Connecte-toi pour vendre et suivre tes achats.</p>

      <div className="flex gap-1.5 rounded-lg p-1 mb-4 bg-surfaceRaised">
        {[
          { id: "login", label: "Connexion" },
          { id: "signup", label: "Créer un compte" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className="flex-1 rounded-md px-2.5 py-1.5 text-xs font-semibold"
            style={{
              backgroundColor: mode === t.id ? "#9C8CFF" : "transparent",
              color: mode === t.id ? "#0D111C" : "#8E9AC0",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-2.5">
        {mode === "signup" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Mot de passe"
          className="rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
        />
        <button type="submit" className="rounded-lg py-2.5 text-sm font-semibold" style={{ backgroundColor: "#9C8CFF", color: "#0D111C" }}>
          {mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      {message && <p className="text-xs text-inkFaint mt-3">{message}</p>}
    </div>
  );
}
