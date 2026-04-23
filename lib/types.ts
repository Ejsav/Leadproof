export type AuditInput = {
  businessName: string;
  websiteUrl: string;
  industry: string;
  city: string;
  notes?: string;
};

export type AuditScores = {
  firstImpression: number;
  mobileConversion: number;
  ctaClarity: number;
  trustSignals: number;
  seoLocalRelevance: number;
  leadCapture: number;
  overallRevenuePotential: number;
};

export type AuditResult = {
  summary: string;
  topIssues: string[];
  topFixes: string[];
  coldEmail: string;
  coldSms: string;
  rebuildPitch: string;
  scores: AuditScores;
};

export type SavedAudit = AuditInput & AuditResult & {
  id?: string;
  created_at?: string;
};
