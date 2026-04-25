import type { RuleDefinition } from '../engine/ruleTypes.js';
import { normalizeText } from '../utils/text.js';

const category = 'Conversion Consistency';

export const consistencyRules: RuleDefinition[] = [
  {
    id: 'consistency-cta-wording',
    category,
    run: ({ pages }) => {
      const ctas = pages[0].ctas.map((c) => normalizeText(c.text));
      const unique = new Set(ctas);
      const pass = unique.size <= 6;
      return {
        id: 'consistency-cta-wording',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'CTA wording appears reasonably consistent.' : 'Potential issue detected: too many CTA variants.',
        explanation: 'Too many CTA labels can dilute page intent.',
        recommendation: 'Use a smaller set of consistent primary CTA phrases.',
        evidence: Array.from(unique).slice(0, 10),
        weight: 1,
      };
    },
  },
  {
    id: 'consistency-nav-footer-conversion-path',
    category,
    run: ({ pages }) => {
      const navHas = pages[0].navTexts.some((t) => /contact|quote|book|call|pricing/i.test(t));
      const footerHas = pages[0].footerTexts.join(' ').match(/contact|call|email|quote/i);
      const pass = navHas && Boolean(footerHas);
      return {
        id: 'consistency-nav-footer-conversion-path',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Navigation and footer include conversion paths.' : 'Potential issue detected: nav/footer conversion paths may be weak.',
        explanation: 'Persistent conversion paths help users act from any section.',
        recommendation: 'Add Contact/Quote actions in both nav and footer.',
        evidence: [`navHas=${navHas}`, `footerHas=${Boolean(footerHas)}`],
        weight: 1,
      };
    },
  },
  {
    id: 'consistency-post-section-cta',
    category,
    run: ({ pages }) => {
      const body = normalizeText(pages[0].bodyText);
      const lastQuarter = body.slice(Math.floor(body.length * 0.75));
      const hasLateCta = /contact|quote|book|call|schedule|get started/.test(lastQuarter);
      return {
        id: 'consistency-post-section-cta',
        category,
        status: hasLateCta ? 'pass' : 'warning',
        severity: hasLateCta ? 'low' : 'medium',
        message: hasLateCta ? 'CTA language appears later in the page.' : 'ConversionLint could not detect a clear final-stage CTA.',
        explanation: 'Late-stage CTAs support users who scroll for proof first.',
        recommendation: 'Repeat a direct CTA after major proof/feature sections.',
        weight: 1,
      };
    },
  },
  {
    id: 'consistency-dead-ends-crawl',
    category,
    run: ({ pages }) => {
      const checked = pages.length > 1;
      const deadEnds = pages.filter((p) => !p.links.some((l) => /contact|quote|book|call/i.test(l.href + l.text))).length;
      return {
        id: 'consistency-dead-ends-crawl',
        category,
        status: !checked || deadEnds === 0 ? 'pass' : 'warning',
        severity: !checked || deadEnds === 0 ? 'low' : 'medium',
        message: !checked || deadEnds === 0 ? 'No obvious dead-end conversion pages detected.' : 'Potential issue detected: some crawled pages appear to be conversion dead ends.',
        explanation: 'Important pages should keep users in a conversion path.',
        recommendation: 'Add contact/quote CTAs on deep pages to avoid dead ends.',
        evidence: checked ? [`deadEnds=${deadEnds}`, `pages=${pages.length}`] : ['Crawl mode not enabled'],
        weight: 1,
      };
    },
  },
];
