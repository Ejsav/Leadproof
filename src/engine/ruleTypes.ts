export type RuleStatus = 'pass' | 'warning' | 'fail';
export type RuleSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RuleResult = {
  id: string;
  category: RuleCategory;
  status: RuleStatus;
  severity: RuleSeverity;
  message: string;
  explanation: string;
  recommendation: string;
  evidence?: string[];
  weight: number;
};

export type RuleCategory =
  | 'aboveFold'
  | 'leadFlow'
  | 'trustSignals'
  | 'localSeo'
  | 'metadata'
  | 'technicalBasics'
  | 'conversionConsistency';

export type PageData = {
  url: string;
  html: string;
  text: string;
  title?: string;
  description?: string;
  status: number;
  responseTimeMs: number;
  headings: string[];
  h1s: string[];
  links: Array<{ href: string; text: string; isInternal: boolean }>;
  images: Array<{ src?: string; alt?: string }>;
  forms: Array<{ fieldCount: number; submitTexts: string[] }>;
  buttons: string[];
  ctas: string[];
  navText: string;
  footerText: string;
  heroText: string;
  hasViewport: boolean;
  canonical?: string;
  metadata: Record<string, string>;
  schemas: Array<{ type: string; raw: unknown }>;
  rendered?: {
    ctasAboveFold: string[];
    mobileHasActionPath: boolean;
  };
};

export type ScanContext = {
  startUrl: string;
  pages: PageData[];
  maxPages: number;
};

export type ScanResult = {
  url: string;
  scannedAt: string;
  pagesScanned: number;
  score: number;
  categoryScores: Record<RuleCategory, number>;
  results: RuleResult[];
  summary: {
    strong: RuleResult[];
    highPriorityIssues: RuleResult[];
    warnings: RuleResult[];
    recommendations: string[];
  };
};

export type Rule = (context: ScanContext) => RuleResult[];
