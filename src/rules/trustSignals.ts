import type { RuleDefinition } from '../engine/ruleTypes.js';
import { countMatches, includesAny } from '../utils/text.js';
import { config } from '../engine/weights.js';

const category = 'Trust Signals';

export const trustSignalRules: RuleDefinition[] = [
  {
    id: 'trust-reviews-testimonials',
    category,
    run: ({ pages }) => {
      const body = pages[0].bodyText;
      const has = includesAny(body, ['review', 'testimonial', 'rating']);
      return {
        id: 'trust-reviews-testimonials',
        category,
        status: has ? 'pass' : 'warning',
        severity: has ? 'low' : 'medium',
        message: has ? 'Reviews/testimonials language detected.' : 'Potential issue detected: no clear review/testimonial section.',
        explanation: 'Social proof can reduce buyer hesitation.',
        recommendation: 'Add a testimonials or reviews section with authentic customer context.',
        weight: 1,
      };
    },
  },
  {
    id: 'trust-proof-assets',
    category,
    run: ({ pages }) => {
      const has = includesAny(pages[0].bodyText, ['gallery', 'portfolio', 'before and after', 'case study']);
      return {
        id: 'trust-proof-assets',
        category,
        status: has ? 'pass' : 'warning',
        severity: has ? 'low' : 'medium',
        message: has ? 'Proof-of-work section detected.' : 'ConversionLint could not detect clear proof-of-work content.',
        explanation: 'Proof assets help prospects verify capability.',
        recommendation: 'Add gallery, case studies, or project results.',
        weight: 1,
      };
    },
  },
  {
    id: 'trust-credentials',
    category,
    run: ({ pages }) => {
      const has = includesAny(pages[0].bodyText, config.trustKeywords);
      return {
        id: 'trust-credentials',
        category,
        status: has ? 'pass' : 'warning',
        severity: has ? 'low' : 'high',
        message: has ? 'Credential/trust language detected.' : 'Potential issue detected: limited credential language.',
        explanation: 'Credentials and guarantees boost trust for first-time visitors.',
        recommendation: 'Include licensed/insured, guarantee, or certification statements.',
        weight: 1,
      };
    },
  },
  {
    id: 'trust-specificity',
    category,
    run: ({ pages }) => {
      const genericCount = countMatches(pages[0].bodyText, ['quality', 'great', 'best', 'professional']) + countMatches(pages[0].bodyText, ['trusted', 'reliable']);
      return {
        id: 'trust-specificity',
        category,
        status: genericCount > 14 ? 'warning' : 'pass',
        severity: genericCount > 14 ? 'medium' : 'low',
        message: genericCount > 14 ? 'Potential issue detected: copy may rely on generic trust language.' : 'Copy appears reasonably specific.',
        explanation: 'Overly generic language can reduce credibility.',
        recommendation: 'Add concrete proof: counts, dates, client names, outcomes, certifications.',
        evidence: [`genericWordHits=${genericCount}`],
        weight: 1,
      };
    },
  },
];
