import { AuditScores } from "@/lib/types";

export function ScoreCard({ scores }: { scores: AuditScores }) {
  const scoreEntries = [
    ["First impression", scores.firstImpression],
    ["Mobile conversion", scores.mobileConversion],
    ["CTA clarity", scores.ctaClarity],
    ["Trust signals", scores.trustSignals],
    ["SEO/local relevance", scores.seoLocalRelevance],
    ["Lead capture", scores.leadCapture],
    ["Revenue potential", scores.overallRevenuePotential]
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {scoreEntries.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-foreground/70">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}/10</p>
        </div>
      ))}
    </div>
  );
}
