import type { Rule } from '../engine/ruleTypes.js';
import { KEYWORDS } from '../engine/weights.js';
import { countOccurrences, includesAny } from '../utils/text.js';

export const trustSignalsRules: Rule = ({ pages }) => {
  const page = pages[0];
  const text = pages.map((p) => p.text).join(' ');

  const hasReviews = includesAny(text, ['review', 'stars', 'google reviews']);
  const hasTestimonials = includesAny(text, ['testimonial', 'what clients say', 'customer story']);
  const hasProofSection = includesAny(text, ['portfolio', 'gallery', 'case study', 'before and after']);
  const hasAbout = pages.some(
    (p) => /about/.test(p.url) || includesAny(p.navText + p.text, ['about us', 'our story']),
  );

  return [
    {
      id: 'ts-reviews',
      category: 'trustSignals',
      status: hasReviews ? 'pass' : 'warning',
      severity: 'medium',
      message: hasReviews ? 'Reviews language detected.' : 'No clear reviews section detected.',
      explanation: 'Social proof can increase trust at first visit.',
      recommendation: 'Add a review summary or embedded review block.',
      weight: 2,
    },
    {
      id: 'ts-testimonials',
      category: 'trustSignals',
      status: hasTestimonials ? 'pass' : 'warning',
      severity: 'medium',
      message: hasTestimonials ? 'Testimonials signal detected.' : 'No testimonial section detected.',
      explanation: 'Testimonial content provides buyer reassurance.',
      recommendation: 'Add 2–3 testimonials with customer context.',
      weight: 2,
    },
    {
      id: 'ts-proof-section',
      category: 'trustSignals',
      status: hasProofSection ? 'pass' : 'warning',
      severity: 'medium',
      message: hasProofSection
        ? 'Proof section detected (portfolio/gallery/case study).'
        : 'No proof-of-work section detected.',
      explanation: 'Proof of outcomes supports decision confidence.',
      recommendation: 'Add gallery, project highlights, or case studies.',
      weight: 2,
    },
    {
      id: 'ts-about-page',
      category: 'trustSignals',
      status: hasAbout ? 'pass' : 'warning',
      severity: 'low',
      message: hasAbout ? 'About section/page detected.' : 'No clear About page/section detected.',
      explanation: 'People often verify business credibility before converting.',
      recommendation: 'Add an About section with team and business context.',
      weight: 1,
    },
    {
      id: 'ts-pricing-language',
      category: 'trustSignals',
      status: includesAny(text, ['pricing', 'estimate', 'quote']) ? 'pass' : 'warning',
      severity: 'medium',
      message: includesAny(text, ['pricing', 'estimate', 'quote'])
        ? 'Pricing/estimate language detected.'
        : 'Limited pricing or estimate language detected.',
      explanation: 'Pricing expectations reduce uncertainty.',
      recommendation: 'Add transparent pricing guidance or estimate process details.',
      weight: 2,
    },
    {
      id: 'ts-badges-credentials',
      category: 'trustSignals',
      status: includesAny(text, ['licensed', 'insured', 'certified', 'guarantee', 'warranty'])
        ? 'pass'
        : 'warning',
      severity: 'medium',
      message: includesAny(text, ['licensed', 'insured', 'certified', 'guarantee', 'warranty'])
        ? 'Credentials/guarantee language detected.'
        : 'No clear credential, guarantee, or badge language detected.',
      explanation: 'Credentials can improve trust in risk-sensitive services.',
      recommendation: 'Add licensed/insured/certification badges or guarantee copy.',
      weight: 2,
    },
    {
      id: 'ts-before-final-cta',
      category: 'trustSignals',
      status: /review|testimonial|licensed|guarantee/.test(page.text) ? 'pass' : 'warning',
      severity: 'low',
      message: /review|testimonial|licensed|guarantee/.test(page.text)
        ? 'Trust language appears before final CTA block.'
        : 'Potential issue detected: trust cues may appear too late or not at all.',
      explanation: 'Trust cues before action prompts can reduce hesitation.',
      recommendation: 'Insert trust snippets near key CTA sections.',
      weight: 2,
    },
    {
      id: 'ts-testimonial-context',
      category: 'trustSignals',
      status: /".+"\s*-\s*[a-z]/.test(page.text) ? 'pass' : 'warning',
      severity: 'low',
      message: /".+"\s*-\s*[a-z]/.test(page.text)
        ? 'Some testimonial context appears detectable.'
        : 'ConversionLint could not detect testimonial names/context.',
      explanation: 'Attributed testimonials generally feel more credible.',
      recommendation: 'Include first names, city, or project type with testimonials.',
      weight: 1,
    },
    {
      id: 'ts-credibility-proof',
      category: 'trustSignals',
      status: includesAny(text, KEYWORDS.trust) ? 'pass' : 'warning',
      severity: 'medium',
      message: includesAny(text, KEYWORDS.trust)
        ? 'Credibility language detected.'
        : 'Limited credibility proof language detected.',
      explanation: 'Credibility proof can increase conversion confidence.',
      recommendation: 'Add specific trust claims backed with evidence.',
      weight: 3,
    },
    {
      id: 'ts-generic-copy',
      category: 'trustSignals',
      status: countOccurrences(text, KEYWORDS.weakWords) > 3 ? 'warning' : 'pass',
      severity: 'medium',
      message:
        countOccurrences(text, KEYWORDS.weakWords) > 3
          ? 'Page copy appears potentially generic in repeated sections.'
          : 'Copy shows reasonable specificity signals.',
      explanation: 'Overly vague copy can reduce conversion clarity.',
      recommendation: 'Replace generic claims with specific outcomes, proof, and process details.',
      weight: 3,
    },
  ];
};
