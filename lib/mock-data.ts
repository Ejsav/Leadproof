import { AuditInput, AuditResult } from "@/lib/types";

function seededScore(seed: number) {
  return Math.max(3, Math.min(10, Math.floor((seed % 8) + 3)));
}

export function buildMockAudit(input: AuditInput): AuditResult {
  const base = input.businessName.length + input.city.length + input.industry.length;

  return {
    summary: `${input.businessName} has a credible foundation but leaves revenue on the table due to weak conversion pathways and under-leveraged local trust messaging. A focused homepage refresh and lead form optimization should raise inquiry volume quickly.`,
    topIssues: [
      "Primary call-to-action is buried below the fold.",
      "Mobile menu and contact actions require too many taps.",
      "Minimal social proof near service decision points.",
      "Local SEO signals are inconsistent across headings and metadata.",
      "Lead form asks for too much information too early."
    ],
    topFixes: [
      "Place one clear CTA in the hero with a contrasting button.",
      "Add sticky mobile call/text quote buttons.",
      "Embed testimonials and badge logos near key sections.",
      "Align service pages with city-specific keywords and schema.",
      "Reduce form fields to name, phone, and service type."
    ],
    coldEmail: `Subject: Quick growth wins for ${input.businessName}\n\nHi there,\nI reviewed ${input.websiteUrl} and found a few conversion gaps likely costing qualified leads in ${input.city}. I put together a short scorecard with top fixes that can improve inquiry rate without a full rebrand. Open to a 15-minute walkthrough this week?`,
    coldSms: `Hi! I audited ${input.businessName}'s site and found 3 quick fixes to increase ${input.city} leads. Want me to send the scorecard?`,
    rebuildPitch: `${input.businessName} could benefit from a focused conversion-first rebuild: clearer above-the-fold offer, trust blocks for ${input.industry}, and a streamlined lead capture flow tailored to ${input.city} search intent.`,
    scores: {
      firstImpression: seededScore(base),
      mobileConversion: seededScore(base + 1),
      ctaClarity: seededScore(base + 2),
      trustSignals: seededScore(base + 3),
      seoLocalRelevance: seededScore(base + 4),
      leadCapture: seededScore(base + 5),
      overallRevenuePotential: seededScore(base + 6)
    }
  };
}
