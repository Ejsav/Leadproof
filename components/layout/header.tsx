import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/70">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">LeadProof</Link>
        <nav className="flex gap-4 text-sm text-foreground/80">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/new">New Audit</Link>
          <Link href="/dashboard/audits">Saved Audits</Link>
        </nav>
      </div>
    </header>
  );
}
