import { config } from '../engine/weights.js';
import type { RuleDefinition } from '../engine/ruleTypes.js';
import { includesAny, normalizeText } from '../utils/text.js';

const category = 'Above-the-Fold Conversion';

export const aboveFoldRules: RuleDefinition[] = [
  {
    id: 'abovefold-h1',
    category,
    run: ({ pages }) => {
      const page = pages[0];
      const hasH1 = page.h1s.length > 0;
      return {
        id: 'abovefold-h1',
        category,
        status: hasH1 ? 'pass' : 'fail',
        severity: hasH1 ? 'low' : 'high',
        message: hasH1 ? 'Clear H1 detected.' : 'Potential issue detected: no H1 found.',
        explanation: 'An H1 clarifies the primary offer at the top of the page.',
        recommendation: 'Add a single, specific H1 describing the service and audience.',
        evidence: page.h1s,
        weight: 1,
      };
    },
  },
  {
    id: 'abovefold-primary-cta',
    category,
    run: ({ pages }) => {
      const cta = pages[0].ctas.find((item) => includesAny(item.text, config.ctaKeywords));
      return {
        id: 'abovefold-primary-cta',
        category,
        status: cta ? 'pass' : 'fail',
        severity: cta ? 'low' : 'critical',
        message: cta ? 'Primary CTA detected.' : 'Potential issue detected: no primary CTA found.',
        explanation: 'Pages need a direct action path above the fold.',
        recommendation: 'Add a clear CTA such as "Get a Free Quote" or "Book a Call".',
        evidence: cta ? [cta.text] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'abovefold-cta-position',
    category,
    run: ({ pages }) => {
      const topCta = pages[0].ctas.find((cta) => typeof cta.y === 'number' && cta.y < 900);
      return {
        id: 'abovefold-cta-position',
        category,
        status: topCta ? 'pass' : 'warning',
        severity: topCta ? 'low' : 'medium',
        message: topCta
          ? 'Primary CTA appears near top of rendered page.'
          : 'ConversionLint could not detect a CTA near the fold.',
        explanation: 'Early CTAs reduce friction for ready-to-convert visitors.',
        recommendation: 'Place a clear CTA in the hero section within initial viewport.',
        evidence: topCta ? [topCta.text, `y=${topCta.y}`] : pages[0].renderError ? [pages[0].renderError] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'abovefold-weak-cta-language',
    category,
    run: ({ pages }) => {
      const weak = pages[0].ctas.find((cta) => includesAny(cta.text, config.weakCtaWords));
      return {
        id: 'abovefold-weak-cta-language',
        category,
        status: weak ? 'warning' : 'pass',
        severity: weak ? 'medium' : 'low',
        message: weak ? 'Potential issue detected: generic CTA language found.' : 'CTA language appears specific.',
        explanation: 'Specific CTA language improves intent clarity and conversion confidence.',
        recommendation: 'Replace generic CTAs like "Submit" with outcome-oriented language.',
        evidence: weak ? [weak.text] : undefined,
        weight: 1,
      };
    },
  },
  {
    id: 'abovefold-hero-clarity',
    category,
    run: ({ pages }) => {
      const text = normalizeText([pages[0].h1s[0] ?? '', pages[0].bodyText.slice(0, 600)].join(' '));
      const hasOffer = /(service|solution|repair|design|consult|install|marketing|development|agency)/.test(text);
      const hasAudience = /(homeowners|business|teams|companies|you|clients|local)/.test(text);
      const pass = hasOffer && hasAudience;
      return {
        id: 'abovefold-hero-clarity',
        category,
        status: pass ? 'pass' : 'warning',
        severity: pass ? 'low' : 'medium',
        message: pass ? 'Hero copy explains offer and audience.' : 'ConversionLint could not fully confirm hero clarity.',
        explanation: 'Visitors should quickly understand what the business does and for whom.',
        recommendation: 'Add concise hero copy that states the service and target customer.',
        evidence: [pages[0].h1s[0] ?? 'No H1'],
        weight: 1,
      };
    },
  },
];
