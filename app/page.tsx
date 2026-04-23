import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="container-shell py-16">
      <section className="rounded-2xl border border-border bg-card p-8 md:p-12">
        <p className="text-sm uppercase tracking-wider text-primary">Website Audit MVP</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">LeadProof helps you turn weak sites into qualified leads.</h1>
        <p className="mt-4 max-w-2xl text-foreground/70">
          Generate a professional scorecard and outreach copy for any local service business in under a minute.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/dashboard/new"><Button>Start new audit</Button></Link>
          <Link href="/dashboard"><Button variant="outline">Open dashboard</Button></Link>
        </div>
      </section>
    </main>
  );
}
