import Link from "next/link";

const cards = [
  { title: "New Audit", href: "/dashboard/new", description: "Run a fresh lead-generation audit." },
  { title: "Saved Audits", href: "/dashboard/audits", description: "Review previous scorecards." }
];

export default function DashboardPage() {
  return (
    <main className="container-shell py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-foreground/70">Launch audits, review results, and prep outreach.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="rounded-2xl border border-border bg-card p-6 hover:bg-muted/70">
            <h2 className="text-xl font-medium">{card.title}</h2>
            <p className="mt-2 text-sm text-foreground/70">{card.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
