"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuditInput, AuditResult, SavedAudit } from "@/lib/types";

const initialState: AuditInput = {
  businessName: "",
  websiteUrl: "",
  industry: "",
  city: "",
  notes: ""
};

export default function NewAuditPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const auditRes = await fetch("/api/generate-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const audit = (await auditRes.json()) as AuditResult;
    const payload: SavedAudit = { ...form, ...audit };

    await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    localStorage.setItem("latestAudit", JSON.stringify(payload));
    setLoading(false);
    router.push("/dashboard/results");
  }

  return (
    <main className="container-shell py-10">
      <h1 className="text-3xl font-semibold">New Audit</h1>
      <p className="mt-2 text-foreground/70">Enter basic business details to generate a lead-generation scorecard.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">Business Name</label>
          <Input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
        </div>
        <div>
          <label className="mb-2 block text-sm">Website URL</label>
          <Input required type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
        </div>
        <div>
          <label className="mb-2 block text-sm">Industry</label>
          <Input required value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </div>
        <div>
          <label className="mb-2 block text-sm">City</label>
          <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm">Notes</label>
          <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <Button disabled={loading}>{loading ? "Generating..." : "Generate Audit"}</Button>
        </div>
      </form>
    </main>
  );
}
