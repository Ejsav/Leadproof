"use client";

import { useEffect, useState } from "react";
import { ScoreCard } from "@/components/score-card";
import { SavedAudit } from "@/lib/types";

export default function ResultsPage() {
  const [audit, setAudit] = useState<SavedAudit | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("latestAudit");
    if (raw) setAudit(JSON.parse(raw));
  }, []);

  if (!audit) {
    return (
      <main className="container-shell py-10">
        <p className="text-foreground/70">No audit loaded yet. Create one from the New Audit page.</p>
      </main>
    );
  }

  return (
    <main className="container-shell space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">{audit.businessName} Audit Results</h1>
        <p className="mt-2 text-foreground/70">{audit.websiteUrl}</p>
      </div>

      <ScoreCard scores={audit.scores} />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-medium">Summary</h2>
        <p className="mt-2 text-foreground/80">{audit.summary}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-medium">Top 5 Issues</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
            {audit.topIssues.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-medium">Top 5 Fixes</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
            {audit.topFixes.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6"><h3 className="font-medium">Cold Email</h3><p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{audit.coldEmail}</p></div>
        <div className="rounded-2xl border border-border bg-card p-6"><h3 className="font-medium">Cold SMS</h3><p className="mt-3 text-sm text-foreground/80">{audit.coldSms}</p></div>
        <div className="rounded-2xl border border-border bg-card p-6"><h3 className="font-medium">Rebuild Pitch</h3><p className="mt-3 text-sm text-foreground/80">{audit.rebuildPitch}</p></div>
      </section>
    </main>
  );
}
