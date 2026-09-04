"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function VendrePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: "", cat: "produits", prix: "", description: "", emoji: "📦" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      setLoading(false);
      if (data.user) loadOffers(data.user.id);
    });
  }, []);

  const loadOffers = async (userId) => {
    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });
    setOffers(data || []);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.titre.trim() || !form.prix.trim()) return;
    setMessage(null);
    const { error } = await supabase.from("offers").insert({
      seller_id: user.id,
      title: form.titre,
      description: form.description,
      price: parseFloat(form.prix.replace(",", ".")),
      category: form.cat,
      emoji: form.emoji,
      status: "brouillon",
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    setForm({ titre: "", cat: "produits", prix: "", description: "", emoji: "📦" });
    setShowForm(false);
    loadOffers(user.id);
  };

  const publish = async (id, current) => {
    const next = current === "active" ? "brouillon" : "active";
    await supabase.from("offers").update({ status: next }).eq("id", id);
    loadOffers(user.id);
  };

  if (loading) return <p className="text-sm text-inkFaint">Chargement…</p>;

  if (!user) {
    return (
      <div>
        <h1 className="font-display text-xl font-bold mb-1">Vendre</h1>
        <p className="text-sm text-inkSoft mb-5">Connecte-toi pour publier tes offres.</p>
        <a href="/compte" className="inline-block rounded-lg py-2.5 px-4 text-sm font-semibold" style={{ backgroundColor: "#2DD4C6", color: "#0D111C" }}>
          Aller à Compte
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-xl font-bold">Vendre</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: "#2DD4C6", color: "#0D111C" }}
        >
          + Offre
        </button>
      </div>
      <p className="text-sm text-inkSoft mb-4">Gérez votre activité, sans changer d'onglet.</p>

      {showForm && (
        <form onSubmit={submit} className="rounded-xl p-3.5 mb-4 flex flex-col gap-2.5 bg-surface border border-vendreSoft">
          <input
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="Titre de l'offre"
            className="rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
          />
          <div className="flex gap-2">
            <select
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
              className="flex-1 rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
            >
              <option value="produits">Produits</option>
              <option value="services">Services</option>
              <option value="logiciels">Logiciels & IA</option>
              <option value="business">Création de business</option>
            </select>
            <input
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              placeholder="Prix (ex. 29)"
              className="w-24 rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none"
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description courte"
            rows={2}
            className="rounded-lg px-3 py-2 text-sm bg-surfaceRaised border border-line outline-none resize-none"
          />
          <button type="submit" className="rounded-lg py-2 text-sm font-semibold" style={{ backgroundColor: "#2DD4C6", color: "#0D111C" }}>
            Enregistrer en brouillon
          </button>
          {message && <p className="text-xs text-red-400">{message}</p>}
        </form>
      )}

      <div className="flex flex-col gap-2.5">
        {offers.length === 0 && <p className="text-sm text-inkFaint">Aucune offre pour l'instant.</p>}
        {offers.map((o) => (
          <div key={o.id} className="rounded-xl p-3 flex items-center justify-between bg-surface border border-line">
            <div>
              <p className="text-sm font-semibold">{o.title}</p>
              <p className="text-xs text-inkFaint mt-0.5">{o.category} · {o.status}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="font-mono text-sm font-semibold text-vendre">{o.price} €</span>
              <button
                onClick={() => publish(o.id, o.status)}
                className="text-[11px] font-medium underline text-inkSoft"
              >
                {o.status === "active" ? "Repasser en brouillon" : "Publier"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
