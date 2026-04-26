import type { Rule } from '../engine/ruleTypes.js';

export const technicalBasicsRules: Rule = ({ pages, maxPages }) => {
  const page = pages[0];
  const brokenInternalLinks = pages
    .flatMap((p) => p.links)
    .filter((l) => l.isInternal && (l.href.includes('404') || l.href.startsWith('#/')));

  const headingOrderIssue = /h1.*h3/.test(page.html.toLowerCase()) && !/h2/.test(page.html.toLowerCase());

  return [
    {
      id: 'tb-broken-links',
      category: 'technicalBasics',
      status: maxPages > 1 && brokenInternalLinks.length > 0 ? 'warning' : 'pass',
      severity: 'medium',
      message:
        maxPages > 1 && brokenInternalLinks.length > 0
          ? 'Potential broken internal links detected.'
          : 'No obvious broken internal links detected in crawl sample.',
      explanation: 'Broken links interrupt conversion journeys.',
      recommendation: 'Fix or redirect broken internal links.',
      evidence: brokenInternalLinks.map((l) => `${l.text} -> ${l.href}`),
      weight: 0.5,
    },
    {
      id: 'tb-image-alt',
      category: 'technicalBasics',
      status: page.images.filter((img) => !img.alt || img.alt.trim().length === 0).length > 2 ? 'warning' : 'pass',
      severity: 'low',
      message:
        page.images.filter((img) => !img.alt || img.alt.trim().length === 0).length > 2
          ? 'Multiple images missing alt text.'
          : 'Image alt text coverage appears acceptable.',
      explanation: 'Missing alt text can reduce clarity and accessibility.',
      recommendation: 'Add descriptive alt text to important images.',
      weight: 0.5,
    },
    {
      id: 'tb-heading-order',
      category: 'technicalBasics',
      status: headingOrderIssue ? 'warning' : 'pass',
      severity: 'low',
      message: headingOrderIssue ? 'Potential heading order issue detected.' : 'Heading order appears reasonable.',
      explanation: 'Heading structure supports scannability and intent clarity.',
      recommendation: 'Use sequential heading levels where possible.',
      weight: 0.5,
    },
    {
      id: 'tb-empty-actions',
      category: 'technicalBasics',
      status: page.ctas.some((cta) => !cta.trim()) ? 'fail' : 'pass',
      severity: 'high',
      message: page.ctas.some((cta) => !cta.trim()) ? 'Empty button/link text detected.' : 'No empty action elements detected.',
      explanation: 'Blank actions confuse users and break conversion flow.',
      recommendation: 'Ensure all action elements have visible descriptive text.',
      weight: 0.5,
    },
    {
      id: 'tb-duplicate-h1',
      category: 'technicalBasics',
      status: page.h1s.length > 1 ? 'warning' : 'pass',
      severity: 'low',
      message: page.h1s.length > 1 ? 'Multiple H1 tags detected.' : 'Single H1 structure detected.',
      explanation: 'Multiple H1s can dilute primary page intent.',
      recommendation: 'Use one primary H1 on key conversion pages.',
      weight: 0.5,
    },
    {
      id: 'tb-lang-attr',
      category: 'technicalBasics',
      status: /<html[^>]+lang=/.test(page.html.toLowerCase()) ? 'pass' : 'warning',
      severity: 'low',
      message: /<html[^>]+lang=/.test(page.html.toLowerCase())
        ? 'HTML lang attribute found.'
        : 'HTML lang attribute missing.',
      explanation: 'Language declaration improves clarity across assistive contexts.',
      recommendation: 'Set <html lang="en"> or relevant language.',
      weight: 0.5,
    },
    {
      id: 'tb-http-status',
      category: 'technicalBasics',
      status: page.status >= 200 && page.status < 400 ? 'pass' : 'fail',
      severity: 'critical',
      message: page.status >= 200 && page.status < 400 ? `HTTP status ${page.status}.` : `HTTP status ${page.status} indicates an issue.`,
      explanation: 'Error status codes block conversion pathways.',
      recommendation: 'Ensure production URLs return successful status codes.',
      weight: 1,
    },
    {
      id: 'tb-page-speed-basic',
      category: 'technicalBasics',
      status: page.responseTimeMs > 2500 ? 'warning' : 'pass',
      severity: 'medium',
      message: page.responseTimeMs > 2500 ? 'Basic fetch timing appears slow.' : 'Basic fetch timing appears acceptable.',
      explanation: 'Slow pages may reduce conversion completion rates.',
      recommendation: 'Optimize server response and critical asset delivery.',
      weight: 0.5,
      evidence: [`responseTimeMs=${page.responseTimeMs}`],
    },
    {
      id: 'tb-title-length',
      category: 'technicalBasics',
      status: (page.title?.length ?? 0) > 65 ? 'warning' : 'pass',
      severity: 'low',
      message: (page.title?.length ?? 0) > 65 ? 'Title may be too long for SERP display.' : 'Title length appears reasonable.',
      explanation: 'Overlong titles can truncate critical intent messaging.',
      recommendation: 'Keep title near 50–60 characters when possible.',
      weight: 0.25,
    },
    {
      id: 'tb-description-length',
      category: 'technicalBasics',
      status: (page.description?.length ?? 0) > 160 ? 'warning' : 'pass',
      severity: 'low',
      message:
        (page.description?.length ?? 0) > 160
          ? 'Meta description may be too long.'
          : 'Meta description length appears reasonable.',
      explanation: 'Long descriptions can truncate key conversion messaging.',
      recommendation: 'Aim for 140–160 characters for meta descriptions.',
      weight: 0.25,
    },
  ];
};
