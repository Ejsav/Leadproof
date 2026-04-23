import { NextResponse } from "next/server";
import { buildMockAudit } from "@/lib/mock-data";
import { openai } from "@/lib/openai";
import { AuditInput, AuditResult } from "@/lib/types";

export async function POST(req: Request) {
  const input = (await req.json()) as AuditInput;

  if (!openai) {
    return NextResponse.json(buildMockAudit(input));
  }

  const prompt = `Return valid JSON only with keys: summary, topIssues (5), topFixes (5), coldEmail, coldSms, rebuildPitch, scores (firstImpression,mobileConversion,ctaClarity,trustSignals,seoLocalRelevance,leadCapture,overallRevenuePotential all as numbers 1-10). Analyze business: ${input.businessName}, url: ${input.websiteUrl}, industry: ${input.industry}, city: ${input.city}, notes: ${input.notes ?? "none"}. Keep tone practical and sales-ready.`;

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const text = response.output_text;
    const parsed = JSON.parse(text) as AuditResult;
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(buildMockAudit(input));
  }
}
