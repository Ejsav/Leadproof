import type { Rule } from '../engine/ruleTypes.js';
import { KEYWORDS } from '../engine/weights.js';
import { includesAny } from '../utils/text.js';

const genericBusinessWords = ['we help', 'we provide', 'services', 'solutions', 'for homeowners', 'for businesses'];

export const aboveFoldRules: Rule = ({ pages }) => {
  const page = pages[0];
  const ctas = page.ctas;
  const heroText = page.heroText || page.text.slice(0, 800);

  const hasStrongCta = ctas.some((cta) => includesAny(cta, KEYWORDS.ctaStrong));
  const hasWeakCta = ctas.some((cta) => includesAny(cta, KEYWORDS.ctaWeak));
  const aboveFoldCta = page.rendered?.ctasAboveFold.some((cta) => includesAny(cta, KEYWORDS.ctaStrong));

  return [
    {
      id: 'af-h1-present',
      category: 'aboveFold',
      status: page.h1s.length > 0 ? 'pass' : 'fail',
      severity: 'high',
      message: page.h1s.length > 0 ? 'Clear H1 detected.' : 'No H1 detected above the fold.',
      explanation: 'A specific H1 helps visitors instantly understand the offer.',
      recommendation: 'Add one descriptive H1 that names the main service and audience.',
      evidence: page.h1s,
      weight: 3,
    },
    {
      id: 'af-primary-cta',
      category: 'aboveFold',
      status: hasStrongCta ? 'pass' : 'fail',
      severity: 'critical',
      message: hasStrongCta ? 'Primary CTA detected.' : 'ConversionLint could not detect a strong primary CTA.',
      explanation: 'Users need a clear action such as quote, call, or booking.',
      recommendation: 'Add a specific CTA like “Get a Free Quote” or “Schedule Service”.',
      evidence: ctas.slice(0, 8),
      weight: 4,
    },
    {
      id: 'af-cta-above-fold',
      category: 'aboveFold',
      status: aboveFoldCta ? 'pass' : 'warning',
      severity: 'high',
      message: aboveFoldCta
        ? 'Strong CTA appears near top of rendered page.'
        : 'Potential issue detected: strong CTA not visible above the fold.',
      explanation: 'Immediate action options can reduce drop-off.',
      recommendation: 'Place a primary CTA button/link in the hero region.',
      evidence: page.rendered?.ctasAboveFold,
      weight: 3,
    },
    {
      id: 'af-cta-specific',
      category: 'aboveFold',
      status: hasWeakCta ? 'warning' : 'pass',
      severity: 'medium',
      message: hasWeakCta ? 'Weak CTA wording detected.' : 'CTA language appears specific.',
      explanation: 'Generic CTA copy can reduce clarity at decision points.',
      recommendation: 'Replace generic labels like “Submit” with intent-driven action text.',
      evidence: ctas.filter((cta) => includesAny(cta, KEYWORDS.ctaWeak)),
      weight: 2,
    },
    {
      id: 'af-hero-explains-business',
      category: 'aboveFold',
      status: includesAny(heroText, genericBusinessWords) ? 'pass' : 'warning',
      severity: 'medium',
      message: includesAny(heroText, genericBusinessWords)
        ? 'Hero copy explains business offer.'
        : 'ConversionLint could not confidently detect what the business does in hero copy.',
      explanation: 'Visitors scan quickly and need immediate context.',
      recommendation: 'Add one sentence in hero that explains the service outcome.',
      evidence: [heroText.slice(0, 180)],
      weight: 2,
    },
    {
      id: 'af-hero-audience',
      category: 'aboveFold',
      status: /for\s+[a-z\s]{3,30}/.test(heroText) ? 'pass' : 'warning',
      severity: 'low',
      message: /for\s+[a-z\s]{3,30}/.test(heroText)
        ? 'Audience language detected in hero copy.'
        : 'Potential issue detected: hero may not identify who the offer is for.',
      explanation: 'Audience qualifiers improve relevance and trust.',
      recommendation: 'Include phrasing like “for homeowners in [area]”.',
      evidence: [heroText.slice(0, 180)],
      weight: 2,
    },
    {
      id: 'af-trust-near-top',
      category: 'aboveFold',
      status: includesAny(heroText, KEYWORDS.trust) ? 'pass' : 'warning',
      severity: 'medium',
      message: includesAny(heroText, KEYWORDS.trust)
        ? 'Trust signal detected near top section.'
        : 'No trust signal detected near hero.',
      explanation: 'Early credibility cues can improve conversion confidence.',
      recommendation: 'Add trust badges, review highlights, or years in business near hero.',
      evidence: [heroText.slice(0, 180)],
      weight: 2,
    },
    {
      id: 'af-clear-next-step',
      category: 'aboveFold',
      status: /(get|book|request|call|schedule|start)/.test(ctas.join(' ')) ? 'pass' : 'fail',
      severity: 'high',
      message: /(get|book|request|call|schedule|start)/.test(ctas.join(' '))
        ? 'Clear next step appears available.'
        : 'No clear next-step language detected.',
      explanation: 'Users convert better with explicit action language.',
      recommendation: 'Add action-led CTA copy such as “Request Pricing” or “Book a Call”.',
      evidence: ctas.slice(0, 8),
      weight: 3,
    },
  ];
};
