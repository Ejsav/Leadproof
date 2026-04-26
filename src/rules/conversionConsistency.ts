import type { Rule } from '../engine/ruleTypes.js';

const dominantCtaStem = (ctas: string[]): string | undefined => {
  const stems = ['quote', 'contact', 'book', 'call', 'schedule', 'pricing', 'start'];
  const counts = stems.map((stem) => ({ stem, count: ctas.filter((c) => c.includes(stem)).length }));
  return counts.sort((a, b) => b.count - a.count)[0]?.stem;
};

export const conversionConsistencyRules: Rule = ({ pages }) => {
  const page = pages[0];
  const ctas = page.ctas;
  const primaryStem = dominantCtaStem(ctas);
  const distinctTypes = new Set(
    ['quote', 'contact', 'book', 'call', 'schedule', 'pricing', 'start'].filter((stem) =>
      ctas.some((c) => c.includes(stem)),
    ),
  );

  return [
    {
      id: 'cc-cta-consistency',
      category: 'conversionConsistency',
      status: primaryStem ? 'pass' : 'warning',
      severity: 'medium',
      message: primaryStem
        ? `CTA wording has a detectable primary pattern (${primaryStem}).`
        : 'CTA wording consistency is unclear.',
      explanation: 'Consistent action language helps reduce cognitive load.',
      recommendation: 'Standardize CTA language around one primary action.',
      weight: 0.5,
    },
    {
      id: 'cc-too-many-ctas',
      category: 'conversionConsistency',
      status: distinctTypes.size > 4 ? 'warning' : 'pass',
      severity: 'medium',
      message: distinctTypes.size > 4 ? 'Too many competing CTA types detected.' : 'CTA variety appears manageable.',
      explanation: 'Too many action types can fragment user decision-making.',
      recommendation: 'Prioritize 1–2 primary CTA types across key sections.',
      weight: 0.5,
    },
    {
      id: 'cc-cta-after-sections',
      category: 'conversionConsistency',
      status: ctas.length >= 3 ? 'pass' : 'warning',
      severity: 'low',
      message: ctas.length >= 3 ? 'Multiple CTA placements detected.' : 'Limited CTA placements detected across sections.',
      explanation: 'Users often need repeated opportunities to act.',
      recommendation: 'Place CTAs after major content sections.',
      weight: 0.5,
    },
    {
      id: 'cc-nav-conversion-path',
      category: 'conversionConsistency',
      status: /contact|quote|book|call/.test(page.navText) ? 'pass' : 'warning',
      severity: 'medium',
      message: /contact|quote|book|call/.test(page.navText)
        ? 'Navigation includes conversion path.'
        : 'Navigation may lack direct conversion path.',
      explanation: 'Primary navigation should support action discovery.',
      recommendation: 'Add a persistent Contact/Quote path in navigation.',
      weight: 0.5,
    },
    {
      id: 'cc-footer-contact',
      category: 'conversionConsistency',
      status: /contact|quote|call|tel/.test(page.footerText) ? 'pass' : 'warning',
      severity: 'medium',
      message: /contact|quote|call|tel/.test(page.footerText)
        ? 'Footer includes contact options.'
        : 'Footer contact options may be limited.',
      explanation: 'Footer is a common final-decision zone.',
      recommendation: 'Add phone and contact links in footer.',
      weight: 0.5,
    },
    {
      id: 'cc-mobile-action-path',
      category: 'conversionConsistency',
      status: page.rendered?.mobileHasActionPath ? 'pass' : 'warning',
      severity: 'medium',
      message: page.rendered?.mobileHasActionPath
        ? 'Mobile action path detectable in rendered view.'
        : 'Mobile action path could not be confidently detected.',
      explanation: 'Mobile users need obvious action pathways.',
      recommendation: 'Ensure mobile layouts expose CTA buttons above and below content.',
      weight: 0.5,
    },
    {
      id: 'cc-vague-near-decision',
      category: 'conversionConsistency',
      status: /learn more|click here|continue/.test(page.text) ? 'warning' : 'pass',
      severity: 'low',
      message: /learn more|click here|continue/.test(page.text)
        ? 'Potential vague copy near decision points detected.'
        : 'Decision-point copy appears reasonably specific.',
      explanation: 'Vague language can reduce conversion clarity.',
      recommendation: 'Use intent-focused action language near CTAs.',
      weight: 0.5,
    },
    {
      id: 'cc-primary-goal-consistent',
      category: 'conversionConsistency',
      status: primaryStem ? 'pass' : 'warning',
      severity: 'low',
      message: primaryStem ? 'Primary conversion goal appears consistent.' : 'Primary conversion goal is unclear.',
      explanation: 'Consistent primary goals can improve flow completion.',
      recommendation: 'Align headings and CTA copy around one main conversion goal.',
      weight: 0.5,
    },
    {
      id: 'cc-quote-language-across-page',
      category: 'conversionConsistency',
      status: pages.every((p) => /quote|contact|call|book/.test(p.text)) ? 'pass' : 'warning',
      severity: 'low',
      message: pages.every((p) => /quote|contact|call|book/.test(p.text))
        ? 'Quote/contact language appears across scanned pages.'
        : 'Quote/contact language is inconsistent across scanned pages.',
      explanation: 'Consistent conversion cues across pages reduce dead ends.',
      recommendation: 'Include a clear action path on every key page.',
      weight: 0.5,
    },
    {
      id: 'cc-dead-ends',
      category: 'conversionConsistency',
      status: pages.some((p) => p.links.length === 0) ? 'warning' : 'pass',
      severity: 'medium',
      message: pages.some((p) => p.links.length === 0)
        ? 'Potential dead-end pages detected in crawl sample.'
        : 'No obvious dead-end pages detected in crawl sample.',
      explanation: 'Dead-end pages can interrupt conversion progression.',
      recommendation: 'Ensure important pages link to quote/contact actions.',
      weight: 0.5,
    },
  ];
};
