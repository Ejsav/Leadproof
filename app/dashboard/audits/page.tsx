"use client";

import { useEffect, useState } from "react";
import { SavedAudit } from "@/lib/types";

export default function SavedAuditsPage() {
  const [audits, setAudits] = useState<SavedAudit[]>([]);

  useEffect(() => {
    fetch("/api/audits")
      .then((r) => r.json())
      .then((data) => setAudits(Array.isArray(data) ? data : []));
  }, []);

  return (
    <main className="container-shell py-10">
      <h1 className="text-3xl font-semibold">Saved Audits</h1>
      <p className="mt-2 text-foreground/70">Supabase-backed history (falls back to empty list without keys).</p>

      <div className="mt-8 grid gap-4">
        {audits.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-6 text-foreground/70">No audits saved yet.</p>
        ) : (
          audits.map((audit) => (
            <article key={audit.id ?? `${audit.businessName}-${audit.websiteUrl}`} className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-medium">{audit.businessName}</h2>
              <p className="text-sm text-foreground/70">{audit.websiteUrl} · {audit.city} · {audit.industry}</p>
              <p className="mt-3 text-sm text-foreground/80">{audit.summary}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
