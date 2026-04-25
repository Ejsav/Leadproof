export type RuleStatus = 'pass' | 'warning' | 'fail';

export type RuleSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ScanPage = {
  url: string;
  status: number;
  html: string;
  renderedHtml?: string;
  loadMs?: number;
};

export type PageData = {
  url: string;
  status: number;
  title?: string;
  metaDescription?: string;
  canonical?: string;
  h1s: string[];
  headings: { level: number; text: string }[];
  navTexts: string[];
  footerTexts: string[];
  links: { href: string; text: string; internal: boolean; isTel: boolean }[];
  ctas: { text: string; href?: string; y?: number }[];
  forms: {
    fieldCount: number;
    submitText?: string;
  }[];
  bodyText: string;
  viewport?: string;
  lang?: string;
  schemaTypes: string[];
  hasNoIndex: boolean;
  metadata: Record<string, string>;
  images: { src?: string; alt?: string }[];
  hasFavicon: boolean;
  renderError?: string;
  pageLoadMs?: number;
};

export type ScanData = {
  rootUrl: string;
  pages: PageData[];
  allLinks: string[];
};

export type RuleResult = {
  id: string;
  category: string;
  status: RuleStatus;
  severity: RuleSeverity;
  message: string;
  explanation: string;
  recommendation: string;
  evidence?: string[];
  weight: number;
};

export type RuleDefinition = {
  id: string;
  category: string;
  run: (data: ScanData) => RuleResult;
};

export type CategoryScore = {
  score: number;
  max: number;
};

export type ScanResult = {
  url: string;
  score: number;
  categoryScores: Record<string, CategoryScore>;
  results: RuleResult[];
  scannedAt: string;
  pagesScanned: number;
  summary: {
    strong: RuleResult[];
    highPriority: RuleResult[];
    warnings: RuleResult[];
    recommendations: string[];
  };
};
