"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const CATEGORIES = [
  { id: "produits", label: "Produits" },
  { id: "services", label: "Services" },
  { id: "logiciels", label: "Logiciels & IA" },
  { id: "business", label: "Création de business" },
];

export default function AcheterPage() {
  const [active, setActive] = useState("produits");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("offers")
        .select("id, title, price, emoji, category, seller:profiles(name)")
        .eq("status", "active")
        .eq("category", active)
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) setError(error.message);
      else setOffers(data || []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div>
      <h1 className="font-display text-xl font-bold mb-1">UNIVA</h1>
      <p className="text-sm text-inkSoft mb-5">Explorez tous les univers, au même endroit.</p>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className="rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap border"
            style={{
              backgroundColor: active === cat.id ? "#5B8CFF" : "#151B29",
              color: active === cat.id ? "#0D111C" : "#8E9AC0",
              borderColor: active === cat.id ? "#5B8CFF" : "#242C42",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-inkFaint">Chargement…</p>}
      {error && <p className="text-sm text-red-400">Erreur : {error}</p>}
      {!loading && !error && offers.length === 0 && (
        <p className="text-sm text-inkFaint">
          Aucune offre active dans cette catégorie pour l'instant. Va dans « Vendre » pour en publier une.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {offers.map((item) => (
          <div key={item.id} className="rounded-xl p-3 flex flex-col gap-2 bg-surface border border-line">
            <div className="w-full aspect-square rounded-lg flex items-center justify-center text-3xl bg-acheterSoft">
              {item.emoji || "📦"}
            </div>
            <p className="text-sm font-semibold leading-snug">{item.title}</p>
            <p className="text-xs text-inkFaint">{item.seller?.name || "Vendeur UNIVA"}</p>
            <span className="font-mono text-sm font-semibold text-acheter mt-auto">{item.price} €</span>
          </div>
        ))}
      </div>
    </div>
  );
}
